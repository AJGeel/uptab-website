import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          400: "#25B1FF",
          500: "#138CD0",
          800: "#085884",
        },
        black: "#020E2C",
      },
    },
  },
  plugins: [typographyPlugin],
};
export default config;
