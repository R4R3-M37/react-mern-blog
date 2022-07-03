import { body } from 'express-validator'

export const articleValidation = [
	body('title', 'Введите заголовок статьи').isLength({ min: 5 }).isString(),
	body('description', 'Введите описание статьи').isLength({ min: 5 }).isString(),
	body('tags', 'Укажите имя').optional().isString(),
	body('imagePreview', 'Неверная ссылка на изображение').optional().isString(),
]
