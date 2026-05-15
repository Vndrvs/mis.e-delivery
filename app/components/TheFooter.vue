<script setup lang="ts">
import { RouterLink } from "vue-router";

const footerColumns = [
	{
		label: "Információ",
		children: [
			{ label: "Aktuális Események", to: "/workshopok/#upcoming-events" },
			{ label: "Kapcsolat", to: "/kapcsolat" },
			{ label: "Workshopok GYIK", to: "/workshopok/#workshops-faq" },
			{ label: "Online Suli GYIK", to: "/kurzus/#course-faq" },
		],
	},
	{
		label: "Jogi",
		children: [
			{ label: "Adatvédelmi Nyilatkozat", to: "/adatvedelmiNyilatkozat" },
			{ label: "Általános Szerződési Feltételek", to: "/aszf" },
			{ label: "Cookie Policy", to: "/" },
			{ label: "Impresszum", to: "/impresszum" },
		],
	},
	{
		label: "Oldalak",
		children: [
			{ label: "Kezdőlap", to: "/" },
			{ label: "Workshopok", to: "/workshopok" },
			{ label: "Online Suli", to: "/kurzus" },
			{ label: "Rólam", to: "/rolam" },
		],
	},
];
</script>

<template>
	<footer class="site-footer bg-page">
		<div class="site-footer__columns">
			<h1>default footer</h1>
		</div>
	</footer>
</template>
