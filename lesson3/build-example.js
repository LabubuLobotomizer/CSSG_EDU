// Regenerates mini-instagram/starter/ (step 1) and mini-instagram/completed/
// (last step) from example.js so the slides and the real project always match.
// Run from this folder: node build-example.js
const fs = require('fs');
const path = require('path');
const example = require('./example.js');

const versions = { react: '^19.2.0', 'react-dom': '^19.2.0', 'react-router': '^7.9.0' };
const devVersions = { '@vitejs/plugin-react': '^5.0.0', vite: '^7.1.0' };

function packageJson(withRouter) {
  const dependencies = { react: versions.react, 'react-dom': versions['react-dom'] };
  if (withRouter) dependencies['react-router'] = versions['react-router'];
  return JSON.stringify({
    name: 'mini-instagram', private: true, version: '0.0.0', type: 'module',
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
    dependencies, devDependencies: devVersions
  }, null, 2) + '\n';
}

const viteConfig = 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\n' +
  '// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n});\n';

function write(folder, step, withRouter) {
  const out = path.join(__dirname, 'mini-instagram', folder);
  fs.rmSync(path.join(out, 'src'), { recursive: true, force: true });
  const files = Object.assign(example.files(step), {
    'package.json': packageJson(withRouter),
    'vite.config.js': viteConfig,
    '.gitignore': 'node_modules\ndist\n'
  });
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
    fs.writeFileSync(path.join(out, name), text);
  }
  console.log('Wrote mini-instagram/' + folder + '/ (step ' + step + ', ' + Object.keys(files).length + ' files)');
}

write('starter', 1, false);
write('completed', example.last, true);
