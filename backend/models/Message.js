const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  messageType: {
    type: String,
    enum: ['text', 'system', 'announcement'],
    default: 'text'
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient room-based queries
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ sender: 1, timestamp: -1 });

// Virtual for formatted timestamp
messageSchema.virtual('formattedTime').get(function() {
  return this.timestamp.toLocaleTimeString();
});

// Pre-save middleware for edit tracking
messageSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.edited = true;
    this.editedAt = new Date();
  }
  next();
});

// Static method to get room messages with pagination
messageSchema.statics.getRoomMessages = function(roomId, limit = 50, offset = 0) {
  return this.find({ 
    room: roomId, 
    isDeleted: false 
  })
  .populate('sender', 'username profile.avatar')
  .populate('replyTo', 'content sender')
  .sort({ timestamp: -1 })
  .limit(limit)
  .skip(offset)
  .exec();
};

// Static method to get recent messages for room preview
messageSchema.statics.getRecentRoomMessage = function(roomId) {
  return this.findOne({ 
    room: roomId, 
    isDeleted: false 
  })
  .populate('sender', 'username')
  .sort({ timestamp: -1 })
  .exec();
};

// Instance method to soft delete
messageSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

// Instance method to add reaction
messageSchema.methods.addReaction = function(emoji, userId) {
  const existingReaction = this.reactions.find(r => r.emoji === emoji);
  
  if (existingReaction) {
    if (!existingReaction.users.includes(userId)) {
      existingReaction.users.push(userId);
    }
  } else {
    this.reactions.push({
      emoji: emoji,
      users: [userId]
    });
  }
  
  return this.save();
};

// Instance method to remove reaction
messageSchema.methods.removeReaction = function(emoji, userId) {
  const reactionIndex = this.reactions.findIndex(r => r.emoji === emoji);
  
  if (reactionIndex !== -1) {
    const reaction = this.reactions[reactionIndex];
    reaction.users = reaction.users.filter(id => !id.equals(userId));
    
    if (reaction.users.length === 0) {
      this.reactions.splice(reactionIndex, 1);
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);