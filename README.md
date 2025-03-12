# Cloudflare React Tailwind Worker

![Cloudflare Worker](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

A high-performance template for building server-rendered React applications with Cloudflare Workers and Tailwind CSS v4. Deploy globally at the edge with minimum latency and maximum performance.

## ✨ Features

- **⚡ Edge Rendering** - Server-side rendering at the edge for lightning-fast performance
- **🌐 Global Deployment** - Leverage Cloudflare's global network for minimal latency worldwide
- **⚛️ React 19** - Utilize the latest React features with server components
- **🎨 Tailwind CSS v4** - Next-generation utility-first CSS framework with native cascade layers
- **🔄 Live Reload** - Fast development workflow with hot module replacement
- **🧪 Testing** - Built-in test setup using Vitest and Cloudflare's testing tools
- **📝 Type Safety** - Full TypeScript support throughout the application
- **🔒 Authentication** - Built-in authentication utilities with JWT support
- **📡 RPC Client** - Type-safe RPC client for seamless server-client communication
- **📦 Zero Dependencies** - No runtime dependencies in the client bundle

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/feliperohdee/cloudflare-react-tailwind-worker.git
    cd cloudflare-react-tailwind-worker
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. Open your browser at [http://localhost:8787](http://localhost:8787)

## 📦 Project Structure

```
cloudflare-react-tailwind-worker/
├── app/                    # Client-side application code
│   ├── index.css           # Client-side styles (Tailwind import)
│   ├── index.ts            # Client entry point
│   └── rpc.ts              # RPC client utilities
├── public/                 # Static assets
│   ├── assets/             # Compiled assets
│   ├── images/             # Image files
│   └── style.css           # Compiled Tailwind CSS
├── tests/                  # Test files
├── worker/                 # Server-side worker code
│   ├── components/         # React components
│   ├── context.ts          # Context management
│   ├── index.tsx           # Worker entry point
│   ├── layout.tsx          # Main layout component
│   ├── pages/              # Page components
│   └── rpc.ts              # RPC server implementation
├── wrangler.jsonc          # Cloudflare Workers configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🔧 Development

### Available Scripts

- `yarn dev` - Starts the development server with hot reloading
- `yarn build` - Builds the application for production
- `yarn start` - Starts the worker locally
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

## 📡 RPC System

This project includes a robust type-safe RPC system for server-client communication. For detailed documentation, see [README-RPC.md](README-RPC.md).

### Server-side RPC Definition

```typescript
// worker/rpc.ts
class Rpc {
	async hello({ message }: { message: string }) {
		return {
			message: `Hello, ${message}!`,
			url: request.url
		};
	}
}
```

### Client-side RPC Usage

```typescript
// In your client code
import createRpcClient from '@/app/rpc';

const { resource } = createRpcClient();

// Create a resource for the hello method
const helloResource = resource('hello', { message: 'World' });

// Subscribe to data changes
helloResource.onData(data => {
	console.log(data.message); // "Hello, World!"
});

// Or use async/await
const data = await helloResource.fetch({ message: 'React' });
console.log(data.message); // "Hello, React!"
```

## 🎨 Tailwind CSS v4

This starter utilizes Tailwind CSS v4, bringing several improvements:

- CSS-first configuration
- Native CSS cascade layers
- Container query support
- Enhanced gradients and shadows
- 3D transforms
- Dynamic spacing scale

## 🌐 Deployment

### Preview Deployment

```bash
yarn deploy --env preview
```

### Production Deployment

```bash
yarn deploy
```

## 📚 Technology Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [React](https://react.dev/) - UI library (v19)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework (v4)
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vitest](https://vitest.dev/) - Testing framework
- [Typed RPC](https://github.com/fed135/typed-rpc) - Type-safe RPC library
- [use-request-utils](https://github.com/feliperohdee/use-request-utils) - Request utilities

## 📄 License

MIT © [Felipe Rohde](mailto:feliperohdee@gmail.com)

## 👤 Author

**Felipe Rohde**

- Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
- GitHub: [@feliperohdee](https://github.com/feliperohdee)
- Email: feliperohdee@gmail.com
