const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['support', 'general', 'wellness', 'mindfulness', 'therapy', 'peer-support']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  rules: [{
    type: String
  }],
  tags: [{
    type: String,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowInvites: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    slowMode: {
      type: Number,
      default: 0 // seconds between messages
    }
  }
}, {
  timestamps: true
});

// Virtual for member count
roomSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for active members (this would need real-time data)
roomSchema.virtual('activeCount').get(function() {
  // This is a placeholder - in real implementation, you'd track online users
  return Math.floor(this.members.length * 0.3); // Assume 30% are active
});

// Index for efficient queries
roomSchema.index({ category: 1, isActive: 1 });
roomSchema.index({ isPublic: 1, isActive: 1 });
roomSchema.index({ lastActivity: -1 });

// Pre-save middleware to update lastActivity
roomSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActivity')) {
    this.lastActivity = new Date();
  }
  next();
});

// Static method to get public rooms
roomSchema.statics.getPublicRooms = function() {
  return this.find({ isPublic: true, isActive: true })
    .populate('creator', 'username')
    .populate('members', 'username')
    .sort({ lastActivity: -1 });
};

// Instance method to add member
roomSchema.methods.addMember = function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.lastActivity = new Date();
  }
  return this.save();
};

// Instance method to remove member
roomSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => !member.equals(userId));
  this.lastActivity = new Date();
  return this.save();
};

// Instance method to check if user is member
roomSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.equals(userId));
};

// Instance method to check if user is moderator
roomSchema.methods.isModerator = function(userId) {
  return this.moderators.some(mod => mod.equals(userId)) || this.creator.equals(userId);
};

module.exports = mongoose.model('Room', roomSchema);