/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#cc9966",
        "brand-light": "#cccc99",
        "brand-dark": "#330000",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#374151",
            h1: {
              color: "#111827",
              fontWeight: "700",
              fontSize: "2.25rem",
              lineHeight: "2.5rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h2: {
              color: "#111827",
              fontWeight: "600",
              fontSize: "1.875rem",
              lineHeight: "2.25rem",
              marginTop: "1.75rem",
              marginBottom: "0.75rem",
            },
            h3: {
              color: "#111827",
              fontWeight: "600",
              fontSize: "1.5rem",
              lineHeight: "2rem",
              marginTop: "1.5rem",
              marginBottom: "0.5rem",
            },
            h4: {
              color: "#111827",
              fontWeight: "600",
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              marginTop: "1.25rem",
              marginBottom: "0.5rem",
            },
            p: {
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
              lineHeight: "1.75rem",
            },
            ul: {
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
            },
            ol: {
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
            },
            li: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            a: {
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: "#1d4ed8",
              },
            },
            blockquote: {
              borderLeftColor: "#e5e7eb",
              borderLeftWidth: "4px",
              paddingLeft: "1rem",
              fontStyle: "italic",
              color: "#6b7280",
            },
            code: {
              backgroundColor: "#f3f4f6",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            },
            pre: {
              backgroundColor: "#1f2937",
              color: "#f9fafb",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflow: "auto",
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              borderRadius: "0",
            },
            hr: {
              borderColor: "#e5e7eb",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            strong: {
              fontWeight: "600",
              color: "#111827",
            },
            em: {
              fontStyle: "italic",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
