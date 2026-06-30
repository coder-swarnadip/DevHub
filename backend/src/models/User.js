const mongoose = require('mongoose');
const config = require('./config');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
},
email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
},

    password: {
        type: String,
        required: true,
        select: false,
    },

    role: {
        type: String,
        enum: ['developer', 'company_admin', 'recruiter', 'admin'],
        default: 'developer',
    },

    avatar: {
        type: String,
        default: config.defaultAvatarUrl,
    },

    banner: {
        type: String,
        default: config.defaultBannerUrl,
    },

    bio: {
        type: String,
    },

    location: {
        type: String,
    },
    skills: {
        type: [String],
    },

    education: [
        {
            school: String,
            degree: String,
            field: String,
            startYear: Number,
            endYear: Number
        }
    ],
    experience: [{
        company: String,
        title: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
    }],
    resume: {
         url: String,
    publicId: String,
    },
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
        twitter: String
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    followersCount: {
        type: Number,
        default: 0,
    },

    followingCount: {
        type: Number,
        default: 0,
    },

   lastActiveAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
    }
)



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);