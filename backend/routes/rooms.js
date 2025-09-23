const express = require('express');
const Joi = require('joi');
const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Validation schemas
const createRoomSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string().valid('support', 'general', 'wellness', 'mindfulness', 'therapy', 'peer-support').required(),
  isPublic: Joi.boolean().default(true),
  maxMembers: Joi.number().min(2).max(500).default(100),
  rules: Joi.array().items(Joi.string().max(200)),
  tags: Joi.array().items(Joi.string().max(50))
});

// @route   GET /api/rooms
// @desc    Get all public rooms
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = { isPublic: true, isActive: true };
    if (category) {
      query.category = category;
    }

    const rooms = await Room.find(query)
      .populate('creator', 'username')
      .populate('members', 'username')
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Get recent message for each room
    const roomsWithMessages = await Promise.all(
      rooms.map(async (room) => {
        const recentMessage = await Message.findOne({ 
          room: room._id, 
          isDeleted: false 
        })
        .populate('sender', 'username')
        .sort({ timestamp: -1 });

        return {
          id: room._id,
          name: room.name,
          description: room.description,
          category: room.category,
          members: room.memberCount,
          active: room.activeCount,
          lastMessage: recentMessage ? recentMessage.content.substring(0, 100) : '',
          lastActivity: room.lastActivity,
          creator: room.creator?.username,
          tags: room.tags
        };
      })
    );

    res.json(roomsWithMessages);

  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server error fetching rooms' });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get room details
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('creator', 'username')
      .populate('members', 'username profile.avatar')
      .populate('moderators', 'username');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isPublic && !room.isMember(req.userId)) {
      return res.status(403).json({ message: 'Access denied to private room' });
    }

    const roomData = {
      id: room._id,
      name: room.name,
      description: room.description,
      category: room.category,
      isPublic: room.isPublic,
      members: room.memberCount,
      active: room.activeCount,
      creator: room.creator,
      moderators: room.moderators,
      rules: room.rules,
      tags: room.tags,
      settings: room.settings,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity
    };

    res.json(roomData);

  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Server error fetching room' });
  }
});

// @route   GET /api/rooms/:id/messages
// @desc    Get room messages
// @access  Private
router.get('/:id/messages', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const roomId = req.params.id;

    // Check if user has access to room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isPublic && !room.isMember(req.userId)) {
      return res.status(403).json({ message: 'Access denied to private room' });
    }

    const messages = await Message.find({ 
      room: roomId, 
      isDeleted: false 
    })
    .populate('sender', 'username profile.avatar')
    .sort({ timestamp: 1 }) // Ascending order for chat display
    .limit(parseInt(limit))
    .skip(parseInt(offset));

    const messagesData = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      userId: msg.sender._id,
      username: msg.sender.username,
      timestamp: msg.timestamp,
      edited: msg.edited,
      editedAt: msg.editedAt
    }));

    res.json(messagesData);

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error } = createRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const roomData = {
      ...req.body,
      creator: req.userId,
      members: [req.userId],
      moderators: [req.userId]
    };

    const room = new Room(roomData);
    await room.save();

    await room.populate('creator', 'username');

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        id: room._id,
        name: room.name,
        description: room.description,
        category: room.category,
        creator: room.creator.username
      }
    });

  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Server error creating room' });
  }
});

// @route   POST /api/rooms/:id/join
// @desc    Join a room
// @access  Private
router.post('/:id/join', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isActive) {
      return res.status(400).json({ message: 'Room is not active' });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ message: 'Room is full' });
    }

    if (room.isMember(req.userId)) {
      return res.status(400).json({ message: 'Already a member of this room' });
    }

    await room.addMember(req.userId);

    res.json({ message: 'Successfully joined the room' });

  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Server error joining room' });
  }
});

// @route   POST /api/rooms/:id/leave
// @desc    Leave a room
// @access  Private
router.post('/:id/leave', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isMember(req.userId)) {
      return res.status(400).json({ message: 'Not a member of this room' });
    }

    if (room.creator.equals(req.userId)) {
      return res.status(400).json({ message: 'Room creator cannot leave. Transfer ownership first.' });
    }

    await room.removeMember(req.userId);

    res.json({ message: 'Successfully left the room' });

  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ message: 'Server error leaving room' });
  }
});

// @route   GET /api/rooms/user/joined
// @desc    Get rooms user has joined
// @access  Private
router.get('/user/joined', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      members: req.userId,
      isActive: true
    })
    .populate('creator', 'username')
    .sort({ lastActivity: -1 });

    const roomsData = rooms.map(room => ({
      id: room._id,
      name: room.name,
      description: room.description,
      category: room.category,
      members: room.memberCount,
      active: room.activeCount,
      lastMessage: room.lastMessage,
      lastActivity: room.lastActivity
    }));

    res.json(roomsData);

  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({ message: 'Server error fetching user rooms' });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room (creator/moderator only)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isModerator(req.userId)) {
      return res.status(403).json({ message: 'Only moderators can update the room' });
    }

    const allowedUpdates = ['name', 'description', 'rules', 'tags', 'settings'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });

  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Server error updating room' });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete room (creator only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.creator.equals(req.userId)) {
      return res.status(403).json({ message: 'Only room creator can delete the room' });
    }

    // Soft delete - just mark as inactive
    room.isActive = false;
    await room.save();

    res.json({ message: 'Room deleted successfully' });

  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Server error deleting room' });
  }
});

module.exports = router;