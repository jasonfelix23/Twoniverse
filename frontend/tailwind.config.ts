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
        background: "var(--background)",
        foreground: "var(--foreground)",
        greendark3: "#04343c",
        greendark2: "#0c4c54",
        greendark1: "#046473",
        greendark0: "#047c8c",
      },
    },
  },
  plugins: [],
};
export default config;
