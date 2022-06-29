/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,ts}',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: [
            {
                light: {
                    "primary": "#057AFF",
                    "secondary": "#463AA1",
                    "accent": "#C149AD",
                    "neutral": "#021431",
                    "base-100": "#FFFFFF",
                    "info": "#93E6FB",
                    "success": "#80CED1",
                    "warning": "#EFD8BD",
                    "error": "#E58B8B",
                }
            }, {
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
