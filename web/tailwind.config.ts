import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      ss: "0.5rem",
    },
    extend: {
      colors: {
        "custom-blue-gray": "hsl(240, 6%, 63%)", // thorin blue-gray
      },
    },
  },
  plugins: [],
};

export default config;
