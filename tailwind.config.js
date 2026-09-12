import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    pink: '#E8B4B8',
                    'pink-hover': '#D99B9F',
                    cream: '#FDF6EC',
                    'cream-dark': '#F5E8D3',
                    sage: '#A8BBA3',
                    'sage-dark': '#8FA58A',
                    text: '#4A3F35',
                    'text-light': '#7A6E63',
                    'error-soft': '#D98880',
                    'success-soft': '#8FBC94',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Nunito Sans', ...defaultTheme.fontFamily.sans],
                poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
                playfair: ['"Playfair Display"', 'serif'],
            },
        },
    },

    plugins: [forms],
};
