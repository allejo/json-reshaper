/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				'left-sidebar': 'minmax(0, 1fr) min-content minmax(0, 1fr)',
			},
		},
	},
	plugins: [],
};
