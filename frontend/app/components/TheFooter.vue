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
			<div
				v-for="(col, index) in footerColumns"
				:key="index"
				class="site-footer__column"
			>
				<h3 class="site-footer__title">
					{{ col.label }}
				</h3>
				<ul class="site-footer__list">
					<li
						v-for="item in col.children"
						:key="item.label"
					>
						<RouterLink
							:to="item.to"
							class="site-footer__link"
						>
							{{ item.label }}
						</RouterLink>
					</li>
				</ul>
			</div>
		</div>
		<div class="site-footer__bottom">
			<p class="site-footer__copyright">
				&copy; {{ new Date().getFullYear() }} Nikolett Agoston
			</p>
		</div>
	</footer>
</template>
