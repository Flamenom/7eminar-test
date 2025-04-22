# Руководство по тестированию

## Обзор

В проекте используются следующие типы тестов:
- Модульные тесты (Unit tests)
- Компонентные тесты (Component tests)
- Интеграционные тесты (Integration tests)

## Запуск тестов

### Запуск всех тестов

```bash
pnpm test
```

### Запуск конкретного теста

```bash
pnpm test <path-to-test-file>
```

### Запуск тестов в режиме watch

```bash
pnpm test:watch
```

### Запуск тестов с покрытием

```bash
pnpm test:coverage
```

## Написание тестов

### Модульные тесты

Модульные тесты находятся в директории `test/unit/`. Пример теста:

```typescript
import { describe, it, expect } from 'vitest'
import { useNewsStore } from '~/stores/news'

describe('News Store', () => {
  it('должен загружать новости', async () => {
    const store = useNewsStore()
    await store.fetchNews()
    expect(store.news).toHaveLength(10)
  })
})
```

### Компонентные тесты

Компонентные тесты находятся в директории `test/components/`. Пример теста:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsCard from '~/components/NewsCard.vue'

describe('NewsCard', () => {
  it('отображает заголовок новости', () => {
    const wrapper = mount(NewsCard, {
      props: {
        news: {
          title: 'Test News',
          content: 'Test Content'
        }
      }
    })
    expect(wrapper.text()).toContain('Test News')
  })
})
```

### Интеграционные тесты

Интеграционные тесты находятся в директории `test/integration/`. Пример теста:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsPage from '~/pages/news/[id].vue'

describe('News Page', () => {
  it('загружает и отображает новость', async () => {
    const wrapper = mount(NewsPage, {
      props: {
        id: 1
      }
    })
    await flushPromises()
    expect(wrapper.find('.news-title').text()).toBe('Test News')
  })
})
```

## Моки и заглушки

### Моки для composables

```typescript
vi.mock('#imports', () => ({
  useAsyncData: vi.fn(() => ({
    data: ref([]),
    pending: ref(false),
    error: ref(null)
  }))
}))
```

### Моки для store

```typescript
vi.mock('~/stores/news', () => ({
  useNewsStore: vi.fn(() => ({
    news: [],
    fetchNews: vi.fn()
  }))
}))
```

## Лучшие практики

1. **Именование тестов**
   - Используйте описательные имена
   - Начинайте с "должен" или "should"
   - Группируйте связанные тесты

2. **Структура теста**
   - Подготовка (setup)
   - Действие (action)
   - Проверка (assertion)

3. **Моки**
   - Мокайте только внешние зависимости
   - Используйте реалистичные данные
   - Очищайте моки после тестов

4. **Асинхронные тесты**
   - Используйте async/await
   - Дожидайтесь завершения всех промисов
   - Обрабатывайте ошибки

## Отладка тестов

### Включение отладки

```bash
pnpm test:debug
```

### Использование console.log

```typescript
it('тестовый пример', () => {
  console.log('Debug info:', someValue)
  expect(someValue).toBe(expectedValue)
})
```

## Покрытие кода

### Генерация отчета о покрытии

```bash
pnpm test:coverage
```

### Интерпретация результатов

- Зеленый: покрытый код
- Красный: непокрытый код
- Желтый: частично покрытый код

## CI/CD интеграция

Тесты автоматически запускаются:
- При создании PR
- При пуше в main
- По расписанию (ежедневно)

## Устранение неполадок

### Распространенные проблемы

1. **Тесты не проходят**
   - Проверьте моки
   - Проверьте асинхронные операции
   - Проверьте окружение

2. **Ошибки типов**
   - Проверьте типы в моках
   - Проверьте импорты
   - Обновите типы

3. **Проблемы с асинхронностью**
   - Используйте flushPromises
   - Проверьте порядок операций
   - Добавьте таймауты

## Контакты

Для вопросов по тестированию:
- Email: test@example.com
- Slack: #testing
- GitHub Issues: https://github.com/your-repo/issues 