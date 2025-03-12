import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	build: {
		manifest: true,
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
	plugins: [cloudflare(), tailwindcss()],
	resolve: {
		alias: {
			'@': __dirname
		}
	}
});
