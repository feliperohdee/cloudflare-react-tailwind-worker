# Cloudflare React Tailwind Worker

![Cloudflare Worker](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

A modern, high-performance starter template for building server-rendered React applications with Cloudflare Workers and Tailwind CSS v4.

## ✨ Features

- **🚀 Cloudflare Workers** - Edge-based rendering for lightning-fast performance globally
- **🌐 Edge Computing** - Deploy globally with Cloudflare Workers
- **⚛️ React 19** - Server-side rendering with the latest React features
- **🎨 Tailwind CSS v4** - Next-generation utility-first CSS framework
- **📘 TypeScript** - Full type safety throughout the application
- **🔄 Live Reload** - Instant feedback during development
- **🧪 Testing** - Built-in test setup with Vitest and Cloudflare's testing tools
- **📝 ESLint & Prettier** - Code quality tools configured and ready to use
- **📦 Hono** - Lightweight, fast web framework for the edge

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare Workers CLI)

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/cloudflare-react-tailwind-worker.git
    cd cloudflare-react-tailwind-worker
    ```

2. Install dependencies:

    ```bash
    yarn install
    # or
    npm install
    ```

3. Start the development server:

    ```bash
    yarn dev
    # or
    npm run dev
    ```

4. Open your browser at [http://localhost:8787](http://localhost:8787) to see the application running.

## 📦 Project Structure

```
cloudflare-react-tailwind-worker/
├── public/               # Static assets served by Cloudflare Workers
│   ├── images/           # Images and other media files
│   └── style.css         # Compiled Tailwind CSS
├── src/
│   ├── components/       # React components
│   ├── layout.tsx        # Main layout component
│   ├── pages/            # Page components
│   ├── index.tsx         # Application entry point
│   └── style.css         # Tailwind CSS source file
├── tests/                # Test files
├── .cursor/              # Editor configuration
├── wrangler.jsonc        # Cloudflare Workers configuration
└── package.json          # Project dependencies and scripts
```

## 🔧 Development

### Available Scripts

- `yarn dev` - Starts the development server with hot reloading
- `yarn build` - Builds the application for production
- `yarn deploy` - Deploys the application to Cloudflare Workers
- `yarn test` - Runs the test suite
- `yarn lint` - Lints and formats the code

### Environment Variables

Environment variables can be configured in `wrangler.jsonc`:

```json
{
	"vars": {
		"PRODUCTION": "true"
	}
}
```

### Tailwind CSS v4

This starter uses Tailwind CSS v4, which brings several improvements over previous versions:

- CSS-first configuration
- Native CSS cascade layers
- Container query support
- Enhanced gradients and shadows
- 3D transforms
- Dynamic spacing scale

For more details, check out the [Tailwind CSS v4 documentation](https://tailwindcss.com/).

## 🌐 Deployment

### Preview Deployment

To create a preview deployment:

```bash
yarn deploy --env preview
# or
npm run deploy -- --env preview
```

### Production Deployment

To deploy to production:

```bash
yarn deploy
# or
npm run deploy
```

## 📚 Technology Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [React](https://react.dev/) - UI library
- [Hono](https://hono.dev/) - Web framework for the edge
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vitest](https://vitest.dev/) - Testing framework

## License

MIT © [Felipe Rohde](mailto:feliperohdee@gmail.com)

## Author

**Felipe Rohde**

- Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
- Github: [@feliperohdee](https://github.com/feliperohdee)
- Email: feliperohdee@gmail.com
