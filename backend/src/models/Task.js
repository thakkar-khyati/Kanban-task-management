const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Task title cannot be empty'],
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: ''
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: [true, 'Board ID is required']
  },
  status: {
    type: String,
    required: [true, 'Task status is required'],
    trim: true,
    maxlength: [50, 'Status cannot exceed 50 characters']
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High', 'Critical'],
      message: 'Priority must be Low, Medium, High, or Critical'
    },
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  labels: [{
    type: String,
    trim: true,
    maxlength: [30, 'Label cannot exceed 30 characters']
  }],
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  position: {
    type: Number,
    default: 0,
    min: 0
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  if (!this.subtasks || this.subtasks.length === 0) {
    return this.status === 'done' ? 100 : 0;
  }
  
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'done';
});

// Virtual for days until due
taskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Indexes for better query performance
taskSchema.index({ boardId: 1, status: 1, position: 1 });
taskSchema.index({ boardId: 1, priority: 1 });
taskSchema.index({ boardId: 1, dueDate: 1 });
taskSchema.index({ boardId: 1, labels: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware
taskSchema.pre('save', function(next) {
  // Update completedAt when status changes to 'done'
  if (this.isModified('status') && this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Clear completedAt when status changes from 'done'
  if (this.isModified('status') && this.status !== 'done' && this.completedAt) {
    this.completedAt = null;
  }
  
  // Set archivedAt when isArchived changes to true
  if (this.isModified('isArchived') && this.isArchived && !this.archivedAt) {
    this.archivedAt = new Date();
  }
  
  // Clear archivedAt when isArchived changes to false
  if (this.isModified('isArchived') && !this.isArchived && this.archivedAt) {
    this.archivedAt = null;
  }
  
  next();
});

// Method to add a subtask
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({
    title,
    completed: false,
    createdAt: new Date()
  });
  return this.save();
};

// Method to toggle subtask completion
taskSchema.methods.toggleSubtask = function(subtaskIndex) {
  if (this.subtasks[subtaskIndex]) {
    this.subtasks[subtaskIndex].completed = !this.subtasks[subtaskIndex].completed;
    return this.save();
  }
  throw new Error('Subtask not found');
};

// Method to add a comment
taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content,
    createdAt: new Date()
  });
  return this.save();
};

// Method to move task to new position
taskSchema.methods.moveToPosition = function(newPosition) {
  this.position = newPosition;
  return this.save();
};

// Static method to get tasks by board with proper ordering
taskSchema.statics.getTasksByBoard = function(boardId, status = null) {
  const query = { boardId, isArchived: false };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('assignee', 'name email')
    .populate('comments.user', 'name email')
    .sort({ position: 1, createdAt: 1 });
};

module.exports = mongoose.model('Task', taskSchema);
