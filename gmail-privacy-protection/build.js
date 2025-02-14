import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

async function mkdir(name) {
  try {
    await fs.mkdirSync(name, { recursive: true });
  } catch (e) {
    console.error(e);
  }
}

async function cp(src, dest) {
  const stats = await fs.statSync(src);

  if (stats.isDirectory()) {
    await mkdir(dest);

    const files = await fs.readdirSync(src);

    await Promise.all(files.map((file) => cp(path.join(src, file), path.join(dest, file))));
  } else {
    await mkdir(path.dirname(dest));

    await fs.copyFileSync(src, dest);
  }
}

async function build() {
  await mkdir('distributions/content');
  await mkdir('distributions/popup');

  await esbuild.build({
    entryPoints: {
      'content/index': 'sources/entries/content/index.ts',
      'popup/index': 'sources/entries/popup/index.ts',
    },
    bundle: true,
    outdir: 'distributions',
    format: 'iife',
    platform: 'browser',
    target: ['chrome58'],
    loader: { '.ts': 'ts', '.svg': 'text' },
    minify: true,
  });

  await esbuild.build({
    entryPoints: {
      index: 'sources/entries/index.css',
      'content/index': 'sources/entries/content/index.css',
      'popup/index': 'sources/entries/popup/index.css',
    },
    bundle: true,
    outdir: 'distributions',
    loader: { '.css': 'css' },
    minify: true,
  });

  await Promise.all([
    cp('sources/entries/popup/index.html', 'distributions/popup/index.html'),
    cp('sources/assets/enabled-symbols', 'distributions/assets/enabled-symbols'),
    cp('sources/manifest.json', 'distributions/manifest.json'),
  ]);
}

build().catch((e) => {
  console.error(e);

  process.exit(1);
});
