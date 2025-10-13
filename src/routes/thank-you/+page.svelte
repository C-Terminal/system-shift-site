<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import EnergyBeam from '$lib/components/EnergyBeam.svelte';

	let isPopupVisible = true;
	let isBeamAnimating = false;
	let isMainContentVisible = false;

	// Optional: Define interface for type safety
	interface EnergyBeamProps {
		isBeamAnimating?: boolean;
		orbSize?: 'sm' | 'md' | 'lg';
		duration?: number;
	}

	// Energy beam configuration
	let beamProps: EnergyBeamProps = {
		isBeamAnimating: false,
		orbSize: 'md',
		duration: 1500
	};

	onMount(() => {
		// Trigger beam animation after a short delay
		setTimeout(() => {
			isBeamAnimating = true;
			beamProps.isBeamAnimating = true;
		}, 750);

		// Hide popup and show main content after beam animation
		setTimeout(() => {
			isPopupVisible = false;
			isMainContentVisible = true;
		}, 2500);
	});
</script>

<svelte:head>
	<title>Thank You - System Shift</title>
	<meta
		name="description"
		content="Your migration journey with System Shift has begun. Welcome to the future of computing."
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden">
	<!-- Animated Background -->
	<div class="fixed inset-0 z-0">
		<div class="hero-bg h-screen"></div>
		<!-- Floating particles/orbs for extra sleekness -->
		<div class="absolute inset-0">
			<div class="absolute top-20 left-10 h-2 w-2 animate-ping rounded-full bg-cyber-neon"></div>
			<div
				class="absolute top-40 right-20 h-4 w-4 animate-pulse rounded-full bg-cyber-electric delay-1000"
			></div>
			<div
				class="absolute bottom-20 left-1/2 h-3 w-3 animate-bounce rounded-full bg-cyber-accent delay-2000"
			></div>
			<div
				class="absolute right-10 bottom-40 h-2 w-2 animate-ping rounded-full bg-cyber-pulse delay-3000"
			></div>
		</div>
	</div>

	<!-- Popup Overlay with Energy Beam -->
	{#if isPopupVisible}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/80 backdrop-blur-md transition-all duration-1000"
			transition:fade={{ duration: 1000 }}
		>
			<div class="relative flex flex-col items-center justify-center px-4 text-center">
				<h1 class="mb-4 animate-pulse text-3xl font-bold text-cyber-neon sm:text-4xl md:text-5xl">
					Activation Complete
				</h1>
				<p class="max-w-md text-lg text-cyber-silver sm:text-xl">
					Your System Shift is initiating. Hold on tight— the future is loading.
				</p>
				<!-- Energy Beam Component -->

					<EnergyBeam
						isBeamAnimating={beamProps.isBeamAnimating || false}
						orbSize={beamProps.orbSize || 'md'}
						duration={beamProps.duration || 1500}
					/>

			</div>
		</div>
	{/if}

	<!-- Main Thank You Content -->
	{#if isMainContentVisible}
		<div
			class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center transition-all duration-1000"
		>
			<!-- Success Orb/Icon -->
			<div class="relative mb-8">
				<div
					class="animate-bounce-slow flex h-24 w-24 items-center justify-center rounded-full bg-cyber-verify shadow-xl shadow-cyber-verify/30 sm:h-32 sm:w-32"
				>
					<svg
						class="h-12 w-12 text-cyber-black sm:h-16 sm:w-16"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<!-- Glow ring -->
				<div
					class="absolute inset-0 h-24 w-24 animate-ping rounded-full bg-cyber-verify/20 sm:h-32 sm:w-32"
				></div>
			</div>

			<div
				class="scroll-reveal mx-auto max-w-4xl"
				in:fade={{ duration: 800, delay: 200 }}
				out:fade={{ duration: 500 }}
			>
				<h1
					class="text-gradient-blue mb-6 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl lg:text-7xl"
				>
					Thank You for Choosing System Shift!
				</h1>
				<p
					class="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-cyber-silver sm:text-xl md:text-2xl"
				>
					Your migration to Fedora Linux is underway. We've received your details and our team will
					reach out within 24 hours to kickstart your seamless transition to a secure,
					high-performance computing future.
				</p>
				<div class="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href="/dashboard"
						class="cyber-glow btn w-full transform transition-transform duration-300 btn-lg btn-primary hover:scale-105 sm:w-auto sm:btn-xl"
						in:scale={{ duration: 600, delay: 400 }}
					>
						Track Progress
					</a>
					<a
						href="/services"
						class="btn w-full transform transition-transform duration-300 btn-outline btn-lg hover:scale-105 sm:w-auto sm:btn-xl"
						in:scale={{ duration: 600, delay: 600 }}
					>
						Explore More
					</a>
				</div>
			</div>

			<!-- Animated Stats/Highlights -->
			<div
				class="mx-auto mt-16 grid w-full max-w-4xl gap-8 px-4 md:grid-cols-3"
				in:slide={{ duration: 800, delay: 800 }}
			>
				<div class="cyber-box animate-float p-6 text-center sm:p-8">
					<h3 class="mb-2 text-3xl font-bold text-cyber-neon">99.9%</h3>
					<p class="text-sm text-cyber-silver">Uptime Guarantee</p>
				</div>
				<div class="cyber-box animate-float p-6 text-center delay-1000 sm:p-8">
					<h3 class="mb-2 text-3xl font-bold text-cyber-electric">24/7</h3>
					<p class="text-sm text-cyber-silver">Expert Support</p>
				</div>
				<div class="cyber-box animate-float p-6 text-center delay-2000 sm:p-8">
					<h3 class="mb-2 text-3xl font-bold text-cyber-pulse">100%</h3>
					<p class="text-sm text-cyber-silver">Satisfaction</p>
				</div>
			</div>

			<!-- Cyber Line Separator -->
			<div class="cyber-line mx-auto mt-20 w-full max-w-2xl"></div>

			<!-- Final CTA -->
			<div class="mt-12 text-center" in:fade={{ duration: 800, delay: 1000 }}>
				<p class="mb-4 text-cyber-silver">Questions? We're here to help.</p>
				<a
					href="/contact"
					class="cyber-glow btn transform transition-transform duration-300 btn-lg btn-accent hover:scale-105"
				>
					Reach Out
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: translateY(50px);
		transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.scroll-reveal.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-bg {
		background: linear-gradient(
			135deg,
			var(--color-cyber-midnight) 0%,
			var(--color-cyber-black) 100%
		);
		position: relative;
		overflow: hidden;
	}

	.hero-bg::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			radial-gradient(circle at 20% 80%, var(--color-cyber-neon) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, var(--color-cyber-electric) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, var(--color-cyber-accent) 0%, transparent 50%);
		opacity: 0.1;
		animation: cyber-pulse 4s ease-in-out infinite alternate;
	}

	/* Floating animation for stats */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.animate-float {
		animation: float 3s ease-in-out infinite;
	}

	.animate-float.delay-1000 {
		animation-delay: 1s;
	}

	.animate-float.delay-2000 {
		animation-delay: 2s;
	}

	/* Slow bounce for orb */
	@keyframes bounce-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.animate-bounce-slow {
		animation: bounce-slow 2s ease-in-out infinite;
	}

	.cyber-line {
		height: 1px;
		background: linear-gradient(to right, transparent, var(--color-cyber-blue) / 30, transparent);
	}

	@keyframes cyber-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	.text-gradient-blue {
		background: linear-gradient(to right, var(--color-cyber-electric), var(--color-cyber-neon));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.cyber-box {
		background: var(--color-cyber-charcoal);
		border: 1px solid var(--color-cyber-blue) / 20;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
		transition: all 0.3s ease;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		font-weight: 500;
		transition: all 0.2s;
	}

	.btn:focus-visible {
		outline: none;
		ring: 2px;
		ring-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.btn-lg {
		height: 3rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		font-size: 1rem;
	}

	.btn-xl {
		height: 3.5rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		font-size: 1.125rem;
	}

	.btn-primary {
		background: var(--color-cyber-blue);
		color: var(--color-cyber-white);
	}

	.btn-primary:hover {
		background: var(--color-cyber-blue);
		opacity: 0.9;
	}

	.btn-outline {
		border: 1px solid;
		border-color: var(--color-cyber-silver);
		opacity: 0.2;
		background: transparent;
		color: var(--color-cyber-white);
	}

	.btn-outline:hover {
		background: var(--color-cyber-charcoal);
		border-color: var(--color-cyber-blue);
		opacity: 0.3;
	}

	.btn-accent {
		background: var(--color-cyber-neon);
		color: var(--color-cyber-black);
	}

	.btn-accent:hover {
		background: var(--color-cyber-neon);
		opacity: 0.9;
	}

	.cyber-glow {
		box-shadow:
			0 0 10px 0 var(--color-cyber-neon),
			0 0 20px 0 var(--color-cyber-neon);
		opacity: 0.3;
	}

	.cyber-glow:hover {
		box-shadow:
			0 0 15px 0 var(--color-cyber-neon),
			0 0 30px 0 var(--color-cyber-neon);
		opacity: 0.5;
	}
</style>
