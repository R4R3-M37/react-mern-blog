import ArticleModel from '../models/Article.js'
import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'

export const getPostByTags = async (req, res) => {
	const tag = req.params.tag

	try {
		const articles = await ArticleModel.find({ tags: tag.split(' ,') })
			.populate('author')
			.exec()

		res.status(200).json(articles)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getNews = async (req, res) => {
	try {
		const articles = await ArticleModel.find()
			.sort([['createdAt', -1]])
			.populate('author')
			.exec()

		res.status(200).json(articles)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getPopular = async (req, res) => {
	try {
		const articles = await ArticleModel.find()
			.sort([['viewsCount', -1]])
			.populate('author')
			.exec()

		res.status(200).json(articles)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const articles = await ArticleModel.find().limit(5).exec()

		const tags = articles
			.map((post) => post.tags)
			.flat()
			.slice(0, 5)

		res.status(200).json(tags)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const articles = await ArticleModel.find().populate('author').exec()

		res.status(200).json(articles)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const articleId = req.params.id

		ArticleModel.findOneAndUpdate(
			{
				_id: articleId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(error, doc) => {
				if (error) {
					console.log(error)
					return res.status(500).json({
						message: 'Не удалось получить статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статья не найдена',
					})
				}

				res.status(200).json(doc)
			}
		).populate('author')
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const create = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		const doc = new ArticleModel({
			title: req.body.title,
			description: req.body.description,
			imagePreview: req.body.imagePreview,
			tags: req.body.tags,
			author: user,
		})

		const post = await doc.save()

		res.status(200).json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const articleId = req.params.id
		ArticleModel.findOneAndDelete(
			{
				_id: articleId,
			},
			(error, doc) => {
				if (error) {
					console.log(error)
					return res.status(500).json({ message: 'Не удалось удалить статью' })
				}

				if (!doc) {
					return res.status(404).json({ message: 'Не удалось найти статью' })
				}

				res.status(200).json({ message: 'Статья удалена' })
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const update = async (req, res) => {
	try {
		const { id } = req.params
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
		const decoded = jwt.verify(token, 'secret123')

		const article = await ArticleModel.findById(id).exec()

		if (decoded._id === article.author._id.toString()) {
			await ArticleModel.updateOne(
				{
					_id: id,
				},
				{
					title: req.body.title,
					description: req.body.description,
					imagePreview: req.body.imagePreview,
					tags: req.body.tags,
				}
			)
			return res.status(200).json({ message: 'Статья успешно обновлена' })
		}

		return res.status(400).json({ message: 'Вы не автор статьи' })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}
