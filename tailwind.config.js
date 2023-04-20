/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [
        function ({ addBase, theme }) {
            function extractColorVars(colorObj, colorGroup = '') {
                return Object.keys(colorObj).reduce((vars, colorKey) => {
                    const value = colorObj[colorKey];

                    const newVars =
                        typeof value === 'string'
                            ? { [`--color${colorGroup}-${colorKey}`]: value }
                            : extractColorVars(value, `-${colorKey}`);

                    return { ...vars, ...newVars };
                }, {});
            }

            addBase({
                ':root': extractColorVars(theme('colors')),
            });
        },
    ],
};