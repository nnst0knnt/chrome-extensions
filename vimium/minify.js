const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const prefixer = require("autoprefixer");

const minify = async (css) =>
  (
    await postcss([
      prefixer,
      cssnano({
        preset: [
          "advanced",
          {
            discardComments: { removeAll: true },
            colormin: true,
            reduceIdents: true,
            mergeLonghand: true,
            mergeRules: true,
          },
        ],
      }),
    ]).process(css, { from: undefined })
  ).css;

const log = (name, raw, min) => {
  console.log(`✅ ${name}`);
  console.log(`  raw: ${(raw.length / 1024).toFixed(2)}kb`);
  console.log(`  min: ${(min.length / 1024).toFixed(2)}kb`);
  console.log(
    `  cut: ${(((raw.length - min.length) / raw.length) * 100).toFixed(1)}%\n`
  );
};

const run = async (file) => {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const name = path.basename(file, ".css");
    const out = path.join(path.dirname(file), `${name}.min.css`);

    const minified = await minify(raw);

    fs.writeFileSync(out, minified);

    log(name, raw, minified);
  } catch (e) {
    console.error(`❌ ${file}`, e);
  }
};

const scan = (dir) => {
  const list = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".css") && !f.endsWith(".min.css"));

  if (!list.length) {
    console.log("❌ no css found");

    return;
  }

  list.forEach((file) => run(path.join(dir, file)));
};

if (require.main === module) {
  scan(".");
}
