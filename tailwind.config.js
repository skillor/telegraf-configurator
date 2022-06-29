/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light", {
            dark: {
                "primary": "#F28C18",
                "secondary": "#6D3A9C",
                "accent": "#51A800",
                "neutral": "#1B1D1D",
                "base-100": "#1e1e1e",
                "info": "#2463EB",
                "success": "#16A249",
                "warning": "#DB7706",
                "error": "#DC2828",
            }
        }],
    },
}
