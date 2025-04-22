import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'news.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    return data.news
  } catch (error) {
    console.error('Error reading news data:', error)
    throw createError({
      statusCode: 500,
      message: 'Ошибка при загрузке новостей'
    })
  }
}) 