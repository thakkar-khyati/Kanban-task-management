const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Column name is required'],
    trim: true,
    maxlength: [50, 'Column name cannot exceed 50 characters']
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  }
}, { _id: false });

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    minlength: [1, 'Board title cannot be empty'],
    maxlength: [100, 'Board title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Board owner is required']
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  invitations: [{
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'viewer'],
      default: 'member'
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    invitedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      }
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'declined'],
      default: 'pending'
    }
  }],
  columns: {
    type: [columnSchema],
    default: [
      { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' },
      { id: 'in-progress', name: 'In Progress', order: 1, color: '#3B82F6' },
      { id: 'done', name: 'Done', order: 2, color: '#10B981' }
    ],
    validate: {
      validator: function(columns) {
        return columns.length > 0;
      },
      message: 'Board must have at least one column'
    }
  },
  settings: {
    allowGuestAccess: {
      type: Boolean,
      default: false
    },
    allowTaskCreation: {
      type: Boolean,
      default: true
    },
    allowTaskDeletion: {
      type: Boolean,
      default: true
    },
    allowColumnModification: {
      type: Boolean,
      default: true
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task count
boardSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'boardId',
  count: true
});

// Virtual for task count by column
boardSchema.virtual('taskCountByColumn', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'boardId',
  options: { 
    match: { status: { $exists: true } }
  }
});

// Index for better query performance
boardSchema.index({ ownerId: 1, isArchived: 1 });
boardSchema.index({ 'members.user': 1 });
boardSchema.index({ 'invitations.email': 1 });
boardSchema.index({ 'invitations.token': 1 });
boardSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to ensure column order is unique and owner is a member
boardSchema.pre('save', function(next) {
  if (this.columns && this.columns.length > 0) {
    // Sort columns by order
    this.columns.sort((a, b) => a.order - b.order);
    
    // Ensure unique order values
    const orders = this.columns.map(col => col.order);
    const uniqueOrders = [...new Set(orders)];
    
    if (orders.length !== uniqueOrders.length) {
      // Reassign order values
      this.columns.forEach((col, index) => {
        col.order = index;
      });
    }
  }
  
  // Ensure owner is always a member with owner role
  if (this.ownerId && this.isNew) {
    const ownerExists = this.members.some(member => 
      member.user.toString() === this.ownerId.toString()
    );
    
    if (!ownerExists) {
      this.members.push({
        user: this.ownerId,
        role: 'owner',
        joinedAt: new Date()
      });
    }
  }
  
  next();
});

// Method to add a new column
boardSchema.methods.addColumn = function(name, color = '#3B82F6') {
  const newOrder = this.columns.length;
  const newColumn = {
    id: `column-${Date.now()}`,
    name,
    order: newOrder,
    color
  };
  
  this.columns.push(newColumn);
  return this.save();
};

// Method to remove a column
boardSchema.methods.removeColumn = function(columnId) {
  this.columns = this.columns.filter(col => col.id !== columnId);
  return this.save();
};

// Method to reorder columns
boardSchema.methods.reorderColumns = function(columnIds) {
  const reorderedColumns = [];
  
  columnIds.forEach((columnId, index) => {
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      column.order = index;
      reorderedColumns.push(column);
    }
  });
  
  this.columns = reorderedColumns;
  return this.save();
};

// Method to add a member to the board
boardSchema.methods.addMember = function(userId, role = 'member', invitedBy = null) {
  // Check if user is already a member
  const existingMember = this.members.find(member => member.user.toString() === userId.toString());
  if (existingMember) {
    throw new Error('User is already a member of this board');
  }
  
  this.members.push({
    user: userId,
    role,
    joinedAt: new Date(),
    invitedBy
  });
  
  return this.save();
};

// Method to remove a member from the board
boardSchema.methods.removeMember = function(userId) {
  // Don't allow removing the owner
  if (this.ownerId.toString() === userId.toString()) {
    throw new Error('Cannot remove board owner');
  }
  
  this.members = this.members.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

// Method to update member role
boardSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  if (!member) {
    throw new Error('Member not found');
  }
  
  // Don't allow changing owner role
  if (member.role === 'owner') {
    throw new Error('Cannot change owner role');
  }
  
  member.role = newRole;
  return this.save();
};

// Method to check if user has access to board
boardSchema.methods.hasAccess = function(userId) {
  // Owner always has access
  const ownerId = this.ownerId._id ? this.ownerId._id : this.ownerId;
  if (ownerId.toString() === userId.toString()) {
    return { hasAccess: true, role: 'owner' };
  }
  
  // Check if user is a member
  const member = this.members.find(member => {
    const memberUserId = member.user._id ? member.user._id : member.user;
    return memberUserId.toString() === userId.toString();
  });
  if (member) {
    return { hasAccess: true, role: member.role };
  }
  
  return { hasAccess: false, role: null };
};

// Method to check if user can perform action
boardSchema.methods.canPerformAction = function(userId, action) {
  const { hasAccess, role } = this.hasAccess(userId);
  
  if (!hasAccess) return false;
  
  const permissions = {
    owner: ['read', 'write', 'delete', 'invite', 'manage_members', 'manage_settings'],
    admin: ['read', 'write', 'invite', 'manage_members'],
    member: ['read', 'write'],
    viewer: ['read']
  };
  
  return permissions[role]?.includes(action) || false;
};

// Method to create invitation
boardSchema.methods.createInvitation = function(email, role = 'member', invitedBy) {
  // Check if user is already a member
  const existingMember = this.members.find(member => 
    member.user.email === email.toLowerCase()
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this board');
  }
  
  // Check if invitation already exists
  const existingInvitation = this.invitations.find(inv => 
    inv.email === email.toLowerCase() && inv.status === 'pending'
  );
  
  if (existingInvitation) {
    throw new Error('Invitation already sent to this email');
  }
  
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.invitations.push({
    email: email.toLowerCase(),
    role,
    token,
    invitedBy,
    invitedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    status: 'pending'
  });
  
  return this.save();
};

// Method to accept invitation
boardSchema.methods.acceptInvitation = function(token, userId) {
  const invitation = this.invitations.find(inv => 
    inv.token === token && inv.status === 'pending' && inv.expiresAt > new Date()
  );
  
  if (!invitation) {
    throw new Error('Invalid or expired invitation');
  }
  
  // Add user as member
  this.addMember(userId, invitation.role, invitation.invitedBy);
  
  // Mark invitation as accepted
  invitation.status = 'accepted';
  
  return this.save();
};

// Method to decline invitation
boardSchema.methods.declineInvitation = function(token) {
  const invitation = this.invitations.find(inv => inv.token === token);
  
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  invitation.status = 'declined';
  return this.save();
};

module.exports = mongoose.model('Board', boardSchema);
