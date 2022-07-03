import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: {
			type: String,
			default:
				'https://media.istockphoto.com/vectors/default-placeholder-profile-icon-vector-id666545204?b=1&k=20&m=666545204&s=612x612&w=0&h=lISapC3Y2nnRS1hC0dZbTl0iHLL28JqmJJnie4JygAA=',
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('User', UserSchema)
