# Images

Place site images here. They are served from the site root as `/images/...`.

## Logo

The navbar and footer use the SVG logo in the **project root** (`public/`): **`soil2spoon_white.svg`**. The favicon in `index.html` also points to `/soil2spoon_white.svg`. Replace or update that file to change the logo. A light-background version is at `soil2spoon.svg`.

## Structure

- **`/` (public root)** — Logo SVGs: `soil2spoon.svg`, `soil2spoon_white.svg`
- **`/images/`** — Icons, banners, etc.
- **`/images/products/`** — Product photos (e.g. for `src/data/products.js`)
  - Example: `garlic-paste.jpg` → use as `/images/products/garlic-paste.jpg`

## Using local images in products

In `src/data/products.js`, replace Unsplash URLs with local paths:

```js
image: '/images/products/garlic-paste.jpg',
images: ['/images/products/garlic-paste.jpg', '/images/products/garlic-paste-2.jpg'],
```

Vite serves everything in `public/` at the root, so no import is needed for these paths.

## Why product images might not show

If **Garlic Paste** or **Garlic Powder** show a placeholder instead of your image:

1. **Check the path** — Files must be in `public/images/products/` (this folder).
2. **Check the filename** — The app looks for exactly `garlic-paste.jpg` and `garlic-powder.jpg`. If you use different names (e.g. `Garlic-Paste.png`), either rename the files or update the paths in `src/data/products.js`.
3. **Restart the dev server** — After adding files to `public/`, restart `npm run dev` and refresh the page.
