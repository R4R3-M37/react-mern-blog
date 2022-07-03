import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
	try {
		const { password } = req.body
		const salt = await bcrypt.genSalt(10)
		const pswrdHash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			passwordHash: pswrdHash,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({
			message: 'Неверный логин или пароль',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(400).json({
				message: 'Неверная почта или пароль',
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверная почта или пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '1d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось выполнить запрос',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Нет доступа',
		})
	}
}
