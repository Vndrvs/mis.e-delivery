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
	<footer class="site-footer">
		<SocialIconContainer class="site-footer__social-container" />
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

<style scoped lang="postscss">
.site-footer {
    padding-top: var(--section-margin-y);
    display: flex;
    flex-direction: column;
    background-color: var(--color-secondary);
    color: var(--text-color);
	align-items: center;

	&__social-container {
		display: flex;
		gap: $space-s;
		margin-bottom: $space-s;

		:deep(.social-link) {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: $space-l;
			height: $space-l;
			border-radius: $radius-full;
			background-color: var(--color-card-stroke);
			transition: background-color 0.2s ease, transform 0.2s ease;

			&:hover {
				background-color: color-mix(in srgb, var(--color-card-stroke) 95%, black 5%);
				transform: translateY(-2px);
			}
		}

		:deep(.social-icon) {
			width: 1.2rem;
			height: 1.2rem;
			object-fit: contain;
		}
	}

    &__columns {
        padding-inline: $space-s;
        display: flex;
        flex-direction: column;
        align-items: center;
		justify-items: center;

        width: 100%;

        @include breakpoint(medium) {
            flex-direction: row;
            justify-content: space-between;
            justify-items: space-between;
        }
    }

    &__column {
        text-align: center;
		justify-items: center;
		width: 100%;

		@include breakpoint(medium) {
			width: 33%;
		}
    }

    &__title {
        font-family: $font-sora;
        font-weight: $weight-bold;
        margin-bottom: $space-s;
        font-size: $fs-24;
        color: var(--color-card-stroke);
    }

    &__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    &__link {
        display: block;
        text-align: center;
        font-family: $font-sora;
        color: var(--text-color);
        text-decoration: none;
        margin-bottom: $space-s;
        transition: color 0.2s;

        &:hover {
            color: var(--color-accent);
        }
    }

    &__bottom {
        margin-top: var(--section-margin-y);
        text-align: center;
        font-size: 0.875rem;
    }
}
</style>