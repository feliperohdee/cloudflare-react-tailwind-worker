# Type-Safe RPC Client

This project includes a robust type-safe RPC (Remote Procedure Call) system for seamless server-client communication. This document explains how to use the RPC client effectively in your application.

## Table of Contents

- [Introduction](#introduction)
- [Basic Usage](#basic-usage)
- [Resource API](#resource-api)
- [Configuration Options](#configuration-options)
- [Type Safety](#type-safety)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)

## Introduction

The RPC client provides a clean, type-safe interface for communicating with the server. It handles:

- Request/response cycles
- Loading states
- Error handling
- Data caching
- Subscription-based updates
- Automatic cleanup

## Basic Usage

```typescript
import createRpcClient from '@/app/rpc';

// Create an RPC client
const { rpc, resource } = createRpcClient();

// Create a resource for the hello method
const helloResource = resource('hello', { message: 'World' });

// Subscribe to data changes
helloResource.onData(data => {
	console.log(`Received: ${data.message}`); // "Hello, World!"
});

// Fetch data with new parameters
const response = await helloResource.fetch({ message: 'React' });
console.log(response.message); // "Hello, React!"
```

## Resource API

When you create a resource with `resource(method, ...args)`, it returns an object with the following API:

### Methods

| Method                   | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `fetch(...args)`         | Execute the RPC call with optional new arguments            |
| `getState()`             | Get the current state (data, error, loading, loaded, index) |
| `setData(newData)`       | Manually update the data state                              |
| `updateArgs(...newArgs)` | Update the arguments and trigger a refetch                  |
| `cancelPending()`        | Cancel any pending requests                                 |
| `dispose()`              | Clean up all resources and subscriptions                    |

### Subscriptions

| Subscription          | Description                        |
| --------------------- | ---------------------------------- |
| `on(callback)`        | Subscribe to all state events      |
| `onData(callback)`    | Subscribe to data changes only     |
| `onError(callback)`   | Subscribe to errors only           |
| `onLoading(callback)` | Subscribe to loading state changes |
| `onLoaded(callback)`  | Subscribe to loaded state changes  |

Each subscription method returns an unsubscribe function that you should call to avoid memory leaks:

```typescript
const unsubscribe = helloResource.onData(data => {
	console.log(data);
});

// Later, when you don't need the subscription:
unsubscribe();

// Or use the dispose method to clean up all subscriptions:
helloResource.dispose();
```

### State Events

The `on` callback receives an event name and the current state:

| Event             | Description                                        |
| ----------------- | -------------------------------------------------- |
| `'loading-start'` | Triggered when a request begins                    |
| `'loading-end'`   | Triggered when a request ends (success or error)   |
| `'loaded'`        | Triggered when data is successfully loaded         |
| `'data'`          | Triggered when data changes (via fetch or setData) |
| `'error'`         | Triggered when an error occurs                     |

```typescript
helloResource.on((event, state) => {
	switch (event) {
		case 'loading-start':
			console.log('Request started');
			break;
		case 'data':
			console.log('Data received:', state.data);
			break;
		case 'error':
			console.error('Error occurred:', state.error);
			break;
	}
});
```

## Configuration Options

The `createRpcClient` function accepts configuration options:

```typescript
const client = createRpcClient({
	// API endpoint URL (default: '/api/rpc')
	url: '/api/rpc',

	// Request credentials (default: undefined)
	credentials: 'include',

	// Custom headers provider
	getHeaders: () => ({
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}),

	// Enable/disable request aborting (default: true)
	abortable: true,

	// Debounce time in milliseconds (default: 300)
	debounceTime: 500,

	// Custom transcoder for request/response serialization
	transcoder: customTranscoder,

	// Custom UUID generator
	uuid: customUuidGenerator
});
```

## Type Safety

This library provides full type safety when used with TypeScript. It leverages your RPC interface definitions to provide proper typing for method names, parameters, and return values.

### Server-Side RPC Definition

```typescript
// worker/rpc.ts
class Rpc {
	async hello({ message }: { message: string }) {
		return {
			message: `Hello, ${message}!`,
			url: request.url
		};
	}

	async signin({ email, password }: { email: string; password: string }) {
		const res = await this.auth.sign({ email, password });
		return {
			email,
			token: res.token
		};
	}
}

export default Rpc;
```

### Client-Side Type-Safe Usage

```typescript
import type Rpc from '@/worker/rpc';
import createRpcClient from '@/app/rpc';

// Create type-safe client
const { resource } = createRpcClient();

// Type parameters: <ReturnType, MethodName>
// The return type and method name are properly typed
const signinResource = resource<{ email: string; token: string }, 'signin'>(
	'signin',
	{ email: 'user@example.com', password: 'password123' }
);

// Parameters are also properly typed
const response = await signinResource.fetch({
	email: 'new@example.com',
	password: 'newpassword'
});

// Access typed response properties
console.log(response.token);
```

## Error Handling

Errors are wrapped in `HttpError` instances from the `use-http-error` library:

```typescript
// Handle errors with try/catch
try {
	const data = await signinResource.fetch({
		email: 'user@example.com',
		password: 'password123'
	});
	console.log('Authentication successful:', data);
} catch (error) {
	if (error.status === 401) {
		console.error('Invalid credentials');
	} else if (error.status === 429) {
		console.error('Rate limited. Try again later.');
	} else {
		console.error('Error:', error.message);
	}
}

// Or subscribe to errors
signinResource.onError(error => {
	console.error('Error code:', error.status);
	console.error('Error message:', error.message);
	console.error('Context:', error.context);
});
```

## Advanced Patterns

### Authentication Flow

```javascript
// Create RPC client
const { resource } = createRpcClient();

// Create signin resource
const signinResource = resource('signin', {
	email: '',
	password: ''
});

// DOM elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');

// Subscribe to loading state
signinResource.onLoading(loading => {
	submitButton.disabled = loading;
	buttonText.textContent = loading ? 'Signing in...' : 'Sign in';
});

// Subscribe to errors
signinResource.onError(err => {
	errorMessage.textContent = err.message;
	errorMessage.style.display = 'block';
});

// Handle form submission
loginForm.addEventListener('submit', async e => {
	e.preventDefault();
	errorMessage.style.display = 'none';

	try {
		const data = await signinResource.fetch({
			email: emailInput.value,
			password: passwordInput.value
		});

		// Store token and redirect
		localStorage.setItem('token', data.token);
		window.location.href = '/dashboard';
	} catch (err) {
		// Error is already handled by onError subscription
	}
});

// Clean up when page unloads
window.addEventListener('unload', () => {
	signinResource.dispose();
});
```

HTML structure for the form:

```html
<form id="login-form">
	<div
		id="error-message"
		class="error"
		style="display: none;"
	></div>
	<input
		id="email"
		type="email"
		placeholder="Email"
		required
	/>
	<input
		id="password"
		type="password"
		placeholder="Password"
		required
	/>
	<button
		id="submit-button"
		type="submit"
	>
		<span id="button-text">Sign in</span>
	</button>
</form>
```

### Real-time Updates with Resource

```javascript
// DOM elements
const userProfileContainer = document.getElementById('user-profile');
const loadingIndicator = document.getElementById('loading');
const userNameElement = document.getElementById('user-name');
const userEmailElement = document.getElementById('user-email');
const userIdInput = document.getElementById('user-id');
const fetchButton = document.getElementById('fetch-button');

// Create RPC client
const { resource } = createRpcClient();

// Initialize with default user ID
let currentUserId = userIdInput.value || '1';
const userResource = resource('getUserProfile', { userId: currentUserId });

// Subscribe to data changes
const unsubscribeData = userResource.onData(user => {
	if (user) {
		loadingIndicator.style.display = 'none';
		userProfileContainer.style.display = 'block';
		userNameElement.textContent = user.name;
		userEmailElement.textContent = user.email;
	}
});

// Subscribe to loading state
const unsubscribeLoading = userResource.onLoading(loading => {
	loadingIndicator.style.display = loading ? 'block' : 'none';
	userProfileContainer.style.display = loading ? 'none' : 'block';
});

// Initial fetch
userResource.fetch();

// Fetch new user when ID changes
fetchButton.addEventListener('click', () => {
	const newUserId = userIdInput.value;
	if (newUserId !== currentUserId) {
		currentUserId = newUserId;
		userResource.updateArgs({ userId: newUserId });
	}
});

// Clean up when page unloads
window.addEventListener('unload', () => {
	unsubscribeData();
	unsubscribeLoading();
	userResource.dispose();
});
```

HTML structure for user profile:

```html
<div>
	<div>
		<label for="user-id">User ID:</label>
		<input
			id="user-id"
			type="text"
			value="1"
		/>
		<button id="fetch-button">Fetch User</button>
	</div>

	<div id="loading">Loading user data...</div>

	<div
		id="user-profile"
		style="display: none;"
	>
		<h1 id="user-name"></h1>
		<p id="user-email"></p>
	</div>
</div>
```

### Aborting All Pending Requests

```javascript
// Create client with abort control
const { resource, abortAll } = createRpcClient();

// Create resources for different API endpoints
const profileResource = resource('getUserProfile', { userId: '1' });
const postsResource = resource('getUserPosts', { userId: '1' });
const statsResource = resource('getUserStats', { userId: '1' });

// Logout button
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', () => {
	// Abort all pending requests
	abortAll();

	// Clear token and redirect
	localStorage.removeItem('token');
	window.location.href = '/login';
});

// You could also abort specific requests
const cancelProfileFetch = () => {
	profileResource.cancelPending();
};
```

## 📄 License

MIT © [Felipe Rohde](mailto:feliperohdee@gmail.com)

## 👤 Author

**Felipe Rohde**

- Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
- GitHub: [@feliperohdee](https://github.com/feliperohdee)
- Email: feliperohdee@gmail.com
