/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./modules/**/components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                expense: 'var(--expense)',
                income: 'var(--income)',
                card: 'var(--card)',
                subtext: 'var(--subtext)',
                border: 'var(--border)',
            }
        },
    },
    plugins: [],
};
