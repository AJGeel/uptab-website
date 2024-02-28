import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

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
      keyframes: {
        graciousEntry: {
          "0%": { opacity: "0", filter: "blur(.2rem)" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        graciousEntry: "graciousEntry 1.5s ease-in-out",
      },
    },
  },
  plugins: [typographyPlugin],
};
export default config;
