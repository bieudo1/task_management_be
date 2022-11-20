const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Schema = mongoose.Schema
const userSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			selected: false
		},
		position: {
			type: String,
			required: true,
			enum: ['Ceo', 'Manager', 'Worker'],
		},
		team: {
			type:Schema.Types.ObjectId,
            required: false,
            ref: "Team",
		},
		avatarUrl: {
			type: String,
			required: false,
		},
		phone1: {
			type: Number,
			required: false,
			default: '',
		},
		phone2: {
			type: Number,
			required: false,
			default: '',
		},
		manager: {
            type:Schema.Types.ObjectId,
            required: false,
            ref: "User",
		},
		isDeleted: { type: Boolean, default: false, select: false },
		completedWorkCount: { type: Number, default:0},
		jobsReceivedCount: { type: Number, default:0},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.toJSON = function() {
	const user = this._doc;
	delete user.password;
	delete user.isDeleted;
	return user;
}

userSchema.methods.generateToken = async function() {
	const accessToken = await jwt.sign({_id: this._id}, JWT_SECRET_KEY,{
		expiresIn: "1d",
	});
	return accessToken
}

const User = mongoose.model('User', userSchema);

module.exports = User;
