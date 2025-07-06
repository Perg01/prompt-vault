// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- The only change is here
    autoprefixer: {},
  },
};
export default config;