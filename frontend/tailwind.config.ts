import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: [
		"./app/**/*.{vue,js,ts}",
    	"./app.vue",
  	],
  	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist', ...defaultTheme.fontFamily.sans],
				mono: ['IBM Plex Sans', ...defaultTheme.fontFamily.mono],
			},
			colors: {
				page: 'hsl(var(--bg-page) / <alpha-value>)',
				primary: 'hsl(var(--bg-primary) / <alpha-value>)',
				secondary: 'hsl(var(--bg-secondary) / <alpha-value>)',
				pill: 'hsl(var(--bg-pill) / <alpha-value>)',
				badge: 'hsl(var(--txt-main) / <alpha-value>)',
				'txt-main': 'hsl(var(--txt-main) / <alpha-value>)',
				'txt-sec': 'hsl(var(--txt-sec) / <alpha-value>)',
				'txt-muted': 'hsl(var(--txt-muted) / <alpha-value>)',
				'str-light': 'hsl(var(--str-light) / <alpha-value>)',
			}
    	}
  	}
} satisfies Config