# Confuse Coder website

Next.js site for [@confuse__coder](https://www.instagram.com/confuse__coder/) and [@confuse__coder.dev](https://www.instagram.com/confuse__coder.dev/).
It reads `../notes` and `../Project` at build time, so a new notes file shows up on the site after the next deploy.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Deploy (Vercel): import this repo and set **Root Directory = `website`**.
