import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'

import { loginValidation, registerValidation } from './validations/auth.js'
import { checkAuth } from './utils/checkAuth.js'
import { getMe, login, register } from './controllers/UserController.js'

import {
	create,
	getAll,
	getLastTags,
	getNews,
	getOne,
	getPopular,
	getPostByTags,
	remove,
	update,
} from './controllers/ArticleController.js'
import { articleValidation } from './validations/article.js'
import { errorValidationHandler } from './utils/errors.js'

mongoose
	.connect('mongodb+srv://admin:11223344@cluster0.tqab9.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('monDB start'))
	.catch((error) => {
		console.log('monDB error', error)
	})

const app = express()
const port = 3001
const storage = multer.diskStorage({
	destination: (_1, _2, cb) => {
		cb(null, 'json-server/uploads')
	},
	filename: (_1, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('json-server/uploads'))
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	next()
})

app.post('/auth/login', loginValidation, errorValidationHandler, login)
app.post('/auth/register', registerValidation, errorValidationHandler, register)
app.get('/auth/user', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags/:tag', getPostByTags)

app.get('/tags', getLastTags)

app.get('/posts/news', getNews)
app.get('/posts/popular', getPopular)

app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts/create', checkAuth, articleValidation, errorValidationHandler, create)
app.patch('/posts/:id', checkAuth, articleValidation, errorValidationHandler, update)
app.delete('/posts/:id', checkAuth, remove)

app.listen(port, (err) => {
	if (err) {
		console.log(err)
	}
	console.log(`Server started on ${port} port`)
})
