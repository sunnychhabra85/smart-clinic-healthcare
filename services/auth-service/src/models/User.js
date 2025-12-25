const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User role enum 
const USER_ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    CLINICIAN: 'clinician',
}

//User status enum
const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
}

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Lastname is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Exclude password from query results by default
    },
    roles:{
        type: [String],
        enum: Object.values(USER_ROLES),
        default: [USER_ROLES.PATIENT],
        required: true,
    },
    status:{
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.ACTIVE,
    },
    refreshToken: {
        type: String,
        select: false, // Exclude refreshToken from query results by default
    },
    lastLogin:{
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes
UserSchema.index({ status: 1 });

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        return next(err);
    }
});

//instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

//Instance method to check if user has a specific role
UserSchema.methods.hasRole = function(role) {
    return this.roles.includes(role);
};

//Instance method to check if user has any of the specified roles
UserSchema.methods.hasAnyRole = function(roles) {
    return this.roles.some(role => roles.includes(role));
}

//Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};


const User = mongoose.model('User', UserSchema);
module.exports = {
    User,
    USER_ROLES,
    USER_STATUS
};