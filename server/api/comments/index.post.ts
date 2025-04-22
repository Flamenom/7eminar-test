import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { newsId, author, content } = body

    if (!newsId || !author || !content) {
      throw createError({
        statusCode: 400,
        message: 'All required fields must be filled'
      })
    }

    const filePath = join(process.cwd(), 'public', 'data', 'comments.json')
    
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        message: 'Comments file not found'
      })
    }

    const fileContent = await readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Создаем новый комментарий
    const newComment = {
      id: data.comments.length + 1,
      newsId: Number(newsId),
      author,
      content,
      date: new Date().toISOString()
    }
    
    // Добавляем комментарий в массив
    data.comments.push(newComment)
    
    // Сохраняем обновленные данные
    await writeFile(filePath, JSON.stringify(data, null, 2))
    
    return newComment
  } catch (error) {
    console.error('Error adding comment:', error)
    throw createError({
      statusCode: 500,
      message: 'Error adding comment'
    })
  }
}) 