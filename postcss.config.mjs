const config = {
  theme: {
    extend: {
      colors: {
        forestgreen: "#1D3D1E",
        gold: {
          DEFAULT: "#B38025", // main gold
          light: "#F1DD8C",   // light gold
          medium: "#D6B666"  // medium gold
        }
      }
    }
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
