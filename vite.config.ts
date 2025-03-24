import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	build: {
		manifest: true,
		minify: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'app/index.ts')
			},
			output: {
				entryFileNames: '[name].[hash].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name].[hash].[ext]'
			}
		}
	},
	define: {
		// required to instruct cloudflare to build react in production mode
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	},
	plugins: [cloudflare(), tailwindcss()],
	resolve: {
		alias: {
			'@': __dirname
		}
	}
});
