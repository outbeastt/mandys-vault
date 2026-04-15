import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#050505',
        'hot-pink': '#FF69B4',
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(to bottom, #FF69B4, #FF1493, #8B008B)',
      },
    },
  },
  plugins: [],
};
export default config;