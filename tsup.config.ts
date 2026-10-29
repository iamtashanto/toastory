import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    react: 'src/react/index.tsx',
    vue: 'src/vue/index.ts',
    angular: 'src/angular/index.ts',
    svelte: 'src/svelte/index.ts',
    native: 'src/native/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
  external: [
    'react',
    'react-dom',
    'vue',
    '@angular/core',
    'rxjs',
    'svelte',
    'react-native',
    'react-native-reanimated',
    'expo-blur',
    'expo-haptics',
    'dompurify',
  ],
});
