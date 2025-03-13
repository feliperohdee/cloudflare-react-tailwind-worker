# Cloudflare React Tailwind Worker

![Cloudflare Worker](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Alpine.js](https://img.shields.io/badge/Alpine.js-3.14-8BC0D0?style=for-the-badge&logo=alpine.js&logoColor=white)

A high-performance, edge-first framework for building server-rendered React applications with Cloudflare Workers, Tailwind CSS v4, and Alpine.js for rich interactivity. Deploy globally with near-zero latency for the ultimate user experience.

## ✨ Features

- **⚡ Full Edge Rendering** - Server-side React rendering at 275+ global edge locations
- **🔄 Alpine.js Integration** - Lightweight JavaScript for micro-interactions without React hydration cost
- **🌐 Global CDN** - Automatic content delivery through Cloudflare's high-performance network
- **⚛️ React 19** - Latest React features optimized for server components
- **🎨 Tailwind CSS v4** - Next-generation utility-first CSS with native cascade layers
- **📱 Mobile-First** - Responsive design patterns built into the core components
- **🔒 Authentication** - Built-in JWT-based authentication with secure cookies
- **📡 Type-Safe RPC** - End-to-end typed communication between client and server
- **🧪 Testing Suite** - Comprehensive testing with Vitest and Cloudflare's testing tools
- **🦄 Zero Client Runtime** - Minimal JavaScript sent to the client for optimal performance
- **🔥 Live Reload** - Fast development workflow with hot module replacement

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
├── app/                    # Client-side code
│   ├── index.css           # Client styles (Tailwind import)
│   ├── index.ts            # Client entry point with Alpine.js setup
│   └── rpc.ts              # RPC client utilities for API communication
├── public/                 # Static assets
│   ├── assets/             # Compiled assets (generated)
│   ├── images/             # Image files
│   └── style.css           # Compiled Tailwind CSS (generated)
├── tests/                  # Test files
├── worker/                 # Server-side edge code
│   ├── components/         # React components (server-rendered)
│   ├── context.ts          # Request context management
│   ├── index.tsx           # Worker entry point
│   ├── layout.tsx          # Main application layout
│   ├── pages/              # Page components
│   └── rpc.ts              # RPC server implementation
├── wrangler.jsonc          # Cloudflare Workers configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🔄 Alpine.js Integration

This project leverages Alpine.js for client-side interactivity without the overhead of full React hydration. Alpine.js provides a lightweight solution for micro-interactions:

```html
<div x-data="{ open: false }">
	<button x-on:click="open = !open">Toggle Menu</button>

	<div
		x-show="open"
		class="menu"
	>
		<!-- Menu content -->
	</div>
</div>
```

Alpine.js is automatically initialized in the client entry point (`app/index.ts`).

## 📡 RPC System

This project includes a robust type-safe RPC system for seamless server-client communication. For detailed documentation, see [README-RPC.md](README-RPC.md):

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

// Or use with Alpine.js
Alpine.data('demoComponent', () => ({
	message: '',
	async fetchGreeting() {
		const result = await resource('hello', { message: 'Alpine' }).fetch();
		this.message = result.message;
	}
}));
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

## 🌐 Deployment

### Preview Deployment

```bash
yarn deploy --env preview
```

### Production Deployment

```bash
yarn deploy
```

## 🎯 Performance Optimization

This framework is built with performance in mind:

1. **Edge-First Rendering** - Pages are rendered at the edge location closest to your users
2. **Minimal JavaScript** - Alpine.js for interactivity with a fraction of the bundle size
3. **Optimized Asset Delivery** - Automatic asset optimization through Cloudflare's CDN

## 📚 Technology Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [React](https://react.dev/) - UI library (v19)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework (v4)
- [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework for interactivity
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
