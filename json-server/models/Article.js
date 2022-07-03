import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: '',
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imagePreview: {
			type: String,
			default:
				'https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png',
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Article', ArticleSchema)
