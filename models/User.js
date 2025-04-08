const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminCode: {
        type: String,
        trim: true,
        select: false // Don't include this field in queries by default
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Remove any existing indexes that might cause conflicts
userSchema.indexes().forEach(index => {
    if (index.rollNo) {
        userSchema.index({ rollNo: 1 }, { unique: false });
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        console.log('Pre-save middleware triggered for user:', this._id || 'new user');
        
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) {
            console.log('Password not modified, skipping hashing');
            return next();
        }
        
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully');
        
        next();
    } catch (error) {
        console.error('Error in password hashing:', {
            error: error.message,
            stack: error.stack
        });
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparing passwords for user:', this._id);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// Handle duplicate key errors
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
