# Cloudflare React Tailwind Worker

![Cloudflare Worker](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Web Components](https://img.shields.io/badge/Web_Components-Native-4285F4?style=for-the-badge&logo=webcomponents.org&logoColor=white)

A high-performance, edge-first framework for building server-rendered React applications with Cloudflare Workers, Tailwind CSS v4, and React Web Components for rich interactivity. Deploy globally with near-zero latency for the ultimate user experience.

## ✨ Features

- **⚡ Full Edge Rendering** - Server-side React rendering at 275+ global edge locations
- **🧩 React Web Components** - Custom elements powered by React with client-side interactivity
- **🌐 Global CDN** - Automatic content delivery through Cloudflare's high-performance network
- **⚛️ React 19** - Latest React features optimized for server components
- **🎨 Tailwind CSS v4** - Next-generation utility-first CSS with native cascade layers
- **📱 Mobile-First** - Responsive design patterns built into the core components
- **🔒 Authentication** - Built-in JWT-based authentication with secure cookies
- **📡 Type-Safe RPC** - End-to-end typed communication between client and server
- **🧪 Testing Suite** - Comprehensive testing with Vitest and Cloudflare's testing tools
- **🔥 Live Reload** - Fast development workflow with hot module replacement
- **🛠️ Web Component Bridge** - Seamless transition between server-rendered React and client-side interactivity

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
│   ├── components/         # React components that can be used on client-side
│   ├── hooks/              # React hooks for state management
│   ├── libs/               # Utility functions
│   ├── index.css           # Client styles (Tailwind import)
│   └── index.ts            # Client entry point
├── app-web-components/     # Web Components wrapper for React components
│   ├── index.tsx           # Web Components registration
│   └── components/         # Individual web components
├── public/                 # Static assets
│   ├── assets/             # Compiled assets (generated)
│   ├── images/             # Image files
│   └── style.css           # Compiled Tailwind CSS (generated)
├── worker/                 # Server-side edge code
│   ├── components/         # React components (server-rendered)
│   ├── context.ts          # Request context management
│   ├── index.tsx           # Worker entry point
│   ├── layout.tsx          # Main application layout
│   ├── pages/              # Page components
│   └── rpc.ts              # RPC server implementation
├── worker-tests/           # Test files
├── wrangler.jsonc          # Cloudflare Workers configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🧩 React Web Components

This project leverages React Web Components for client-side interactivity without the overhead of full React hydration. This provides a clean bridge between server-rendered React and client-side functionality:

### Creating a Web Component

```typescript
// app-web-components/my-button.tsx
import React from 'react';
import exportComponent from '@/app/libs/export-web-component';

const MyButton = ({ text, onClick }) => {
  const handleClick = () => {
    console.log('Button clicked');
    if (onClick) onClick();
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleClick}
    >
      {text || 'Click Me'}
    </button>
  );
};

export default exportComponent(MyButton, {
  props: {
    text: 'string',
    onClick: 'function'
  }
});
```

### Registering the Web Component

```typescript
// app-web-components/index.tsx
import r2wc from '@r2wc/react-to-web-component';
import MyButton from './my-button';

// Define the component for use in TypeScript
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			['x-my-button']: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & {
					text?: string;
					onclick?: string;
				},
				HTMLElement
			>;
		}
	}
}

// Register the web component
customElements.define('x-my-button', r2wc(MyButton.component, MyButton));
```

### Using in HTML/JSX

```html
<!-- In your server-rendered React component -->
<div>
	<h1>Interactive Components</h1>
	<x-my-button
		text="Click me!"
		onclick="alert('Hello from Web Component')"
	></x-my-button>
</div>
```

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
// In your React web component
import { useState } from 'react';
import useRpc from '@/app/hooks/use-rpc';
import exportComponent from '@/app/libs/export-web-component';

const GreetingComponent = () => {
  const [greeting, setGreeting] = useState('');
  const { resource } = useRpc();

  const fetchGreeting = async () => {
    const result = await resource('hello', { message: 'World' }).fetch();
    setGreeting(result.message);
  };

  return (
    <div className="p-4 border rounded">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchGreeting}
      >
        Get Greeting
      </button>
      {greeting && <p className="mt-4">{greeting}</p>}
    </div>
  );
};

export default exportComponent(GreetingComponent);
```

## 🔧 Development

### Available Scripts

- `yarn dev` - Starts the development server with hot reloading
- `yarn build` - Builds the application for production
- `yarn start` - Starts the worker locally
- `yarn deploy` - Deploys the application to Cloudflare Workers
- `yarn test` - Runs the test suite
- `yarn lint` - Lints and formats the code
- `yarn add-component` - Adds a new shadcn/ui component

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
2. **Minimal JavaScript** - React Web Components for interactivity with targeted bundle size
3. **Optimized Asset Delivery** - Automatic asset optimization through Cloudflare's CDN
4. **Progressive Enhancement** - Server-rendered HTML with optional client-side interactivity

## 📚 Technology Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [React](https://react.dev/) - UI library (v19)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework (v4)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) - Native browser component standard
- [R2WC](https://github.com/crisward/r2wc) - React to Web Component bridge
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
