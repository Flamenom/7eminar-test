import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const newsId = Number(query.newsId)

    if (isNaN(newsId)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid news ID'
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
    
    // Фильтруем комментарии по ID новости
    const comments = data.comments.filter((comment: any) => comment.newsId === newsId)
    
    return comments
  } catch (error) {
    console.error('Error reading comments:', error)
    throw createError({
      statusCode: 500,
      message: 'Error loading comments'
    })
  }
}) 