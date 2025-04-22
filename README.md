# News Application on Nuxt 3

A web application for displaying news and comments with SSR support, built on Nuxt 3.

## Technologies

- Nuxt 3
- Vue 3
- Pinia (state management)
- Bootstrap 5 (UI components)
- TypeScript

## Features

- News list display
- News search
- News detail page
- Comment system
- SSR (Server Side Rendering)
- Responsive design

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the project root (if needed):
```env
NUXT_PUBLIC_API_BASE=/data
```

## Running the Project

### Development Mode
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

### Running Production Version
```bash
pnpm start
```

## Project Structure

```
project/
├── components/     # Vue components
├── pages/         # Application pages
├── composables/   # Composable functions
├── middleware/    # Middleware
├── plugins/       # Plugins
├── stores/        # Pinia stores
├── public/        # Static files
│   └── data/      # JSON data
└── tests/         # Tests
```

## Testing

```bash
# Run tests
pnpm test
```

## License

MIT 