import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library';

  if (isLibrary) {
    // Configuración para build de librería
    return {
      plugins: [
        react(),
        dts({
          include: ['src/lib/index.ts', 'src/components/**/*.tsx'],
          rollupTypes: true,
        }),
      ],
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'FormEngine',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
          // Externalizar TODAS las dependencias para que el proyecto consumidor las instale
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'react-hook-form',
            'zod',
            '@hookform/resolvers',
            '@tanstack/react-query',
            'clsx',
            'tailwind-merge',
            'lucide-react',
            /^react\/.*/,
            /^react-dom\/.*/,
          ],
          output: {
            // Preservar estructura de módulos para tree-shaking
            preserveModules: false,
            exports: 'named',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'style.css';
              return assetInfo.name || 'asset';
            },
          },
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
          },
        },
        sourcemap: false, // Desactivado para builds de producción (GitHub Packages)
        emptyOutDir: true,
        minify: 'esbuild', // Minificado para reducir tamaño del paquete
      },
    };
  }

  // Configuración para desarrollo y landing page
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist-demo',
      sourcemap: true,
    },
    base: './',
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'dist/',
          'dist-demo/',
        ],
      },
    },
  };
});
