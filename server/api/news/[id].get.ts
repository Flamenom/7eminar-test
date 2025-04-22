import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Неверный ID новости'
      })
    }

    const filePath = join(process.cwd(), 'public', 'data', 'news.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    const newsItem = data.news.find((item: any) => item.id === id)
    
    if (!newsItem) {
      throw createError({
        statusCode: 404,
        message: 'Новость не найдена'
      })
    }
    
    return newsItem
  } catch (error: any) {
    console.error('Error reading news data:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при загрузке новости'
    })
  }
}) 