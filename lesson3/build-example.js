// Regenerates mini-instagram/starter/ (step 1) and mini-instagram/completed/ (last step)
// from example.js so the slides and the real project always match.
// The config files match `npm create vite@latest -- --template react-ts`.
// Run from this folder: node build-example.js
const fs = require('fs');
const path = require('path');
const example = require('./example.js');

const packageJson = JSON.stringify({
  name: 'mini-instagram', private: true, version: '0.0.0', type: 'module',
  scripts: { dev: 'vite', build: 'tsc -b && vite build', preview: 'vite preview' },
  dependencies: { react: '^19.3.1', 'react-dom': '^19.3.1' },
  devDependencies: {
    '@types/node': '^24.19.2', '@types/react': '^19.3.0', '@types/react-dom': '^19.3.0',
    '@vitejs/plugin-react': '^6.1.2', typescript: '~7.0.2', vite: '^8.3.4'
  }
}, null, 2) + '\n';

const json = value => JSON.stringify(value, null, 2) + '\n';
const shared = {
  skipLibCheck: true,
  allowImportingTsExtensions: true,
  verbatimModuleSyntax: true,
  moduleDetection: 'force',
  noEmit: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  erasableSyntaxOnly: true,
  noFallthroughCasesInSwitch: true
};
const config = {
  'package.json': packageJson,
  'tsconfig.json': json({ files: [], references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }] }),
  'tsconfig.app.json': json({
    compilerOptions: Object.assign({
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
      target: 'es2023', lib: ['ES2023', 'DOM'], module: 'esnext', types: ['vite/client'],
      allowArbitraryExtensions: true, moduleResolution: 'bundler', jsx: 'react-jsx'
    }, shared),
    include: ['src']
  }),
  'tsconfig.node.json': json({
    compilerOptions: Object.assign({
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
      target: 'es2023', lib: ['ES2023'], types: ['node'], module: 'nodenext'
    }, shared),
    include: ['vite.config.ts']
  }),
  'vite.config.ts': 'import react from "@vitejs/plugin-react";\nimport { defineConfig } from "vite";\n\n' +
    '// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n});\n',
  '.gitignore': 'node_modules\ndist\n*.local\n'
};

function write(folder, step) {
  const out = path.join(__dirname, 'mini-instagram', folder);
  fs.rmSync(path.join(out, 'src'), { recursive: true, force: true });
  fs.rmSync(path.join(out, 'vite.config.js'), { force: true }); // left over from the JavaScript version
  const files = Object.assign(example.files(step), config);
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
    fs.writeFileSync(path.join(out, name), text);
  }
  console.log('Wrote mini-instagram/' + folder + '/ (step ' + step + ', ' + Object.keys(files).length + ' files)');
}

write('starter', 1);
write('completed', example.last);
