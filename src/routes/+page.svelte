<script lang="ts">
	import { onMount } from 'svelte';
	// import { scrollReveal } from '$lib/actions/scrollReveal';
	let sections: HTMLElement[] = [];
	let observer: IntersectionObserver;

	onMount(() => {
		let cancelled = false;

		// await tick();
		sections = Array.from(document.querySelectorAll('.scroll-reveal'));

		if (typeof IntersectionObserver === 'undefined') {
			console.warn('IntersectionObserver not supported');
		}

		if (typeof IntersectionObserver !== 'undefined') {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.add('visible');
							entry.target.classList.add('animate-slide-in');
							observer.unobserve(entry.target);
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: '0px 0px -5% 0px'
				}
			);

			if (!cancelled) {
				setTimeout(() => {
					sections.forEach((section) => observer.observe(section));
				}, 100);
			}
		}

		// Return cleanup function synchronously
		return () => {
			cancelled = true;
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<svelte:head>
	<title>System Shift - Switch to Linux Confidently</title>
	<meta
		content="Professional migration services from Windows to Fedora Linux. Secure, customized, and supported."
		name="description"
	/>
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Section -->
	<section class="hero-bg relative flex min-h-screen items-center justify-center px-4 text-center">
		<div class="scroll-reveal visible relative z-10 mx-auto max-w-4xl">
			<h1
				class="text-gradient-blue mb-6 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
			>
				System Shift
			</h1>
			<p
				class="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-cyber-silver sm:text-xl md:text-2xl"
			>
				Migrate from Windows to Fedora Linux with seamless expertise. Secure, customized, and
				future-proof your computing.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/contact"
					class="cyber-glow btn w-full btn-lg btn-sm btn-primary sm:w-auto sm:btn-md"
					>Start Migration</a
				>
				<a href="#services" class="btn w-full btn-outline btn-lg btn-sm sm:w-auto sm:btn-md"
					>Explore Services</a
				>
			</div>
		</div>
		<div class="cyber-line absolute right-0 bottom-0 left-0 h-1"></div>
	</section>

	<!-- Why Switch Section -->
	<section id="why" class="cyberpunk-grid bg-cyber-midnight py-12 sm:py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="scroll-reveal mb-4 text-3xl font-bold text-cyber-white sm:text-4xl md:text-5xl">
					Why Fedora Linux?
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-base text-cyber-silver sm:text-lg">
					Leave the vulnerabilities of Windows behind. Embrace the open-source power of Linux for
					unmatched security, performance, and freedom.
				</p>
			</div>

			<div class="grid gap-6 sm:gap-8 md:grid-cols-3">
				<div class="scroll-reveal cyber-box p-6 text-center sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-neon sm:text-2xl">Superior Security</h3>
					<p class="text-sm text-cyber-silver sm:text-base">
						Linux's permission model and rapid updates shield you from threats that plague Windows
						daily.
					</p>
				</div>

				<div class="scroll-reveal cyber-box p-6 text-center sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-electric sm:text-2xl">
						Blazing Fast Performance
					</h3>
					<p class="text-sm text-cyber-silver sm:text-base">
						Lightweight and efficient—run circles around bloated Windows with Fedora's optimized
						kernel.
					</p>
				</div>

				<div class="scroll-reveal cyber-box p-6 text-center sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-pulse sm:text-2xl">Total Customization</h3>
					<p class="text-sm text-cyber-silver sm:text-base">
						Tailor your OS to perfection. No more compromises—Linux bends to your workflow.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Comparison Section -->
	<section id="comparison" class="bg-cyber-charcoal py-12 sm:py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="scroll-reveal mb-4 text-3xl font-bold text-cyber-white sm:text-4xl md:text-5xl">
					Windows vs. Fedora Linux
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-base text-cyber-silver sm:text-lg">
					See why Linux outshines Windows in every critical aspect.
				</p>
			</div>

			<div class="scroll-reveal overflow-x-auto">
				<table class="comparison-table w-full text-xs text-cyber-silver sm:text-sm">
					<thead>
						<tr>
							<th class="px-2 py-2 text-left text-base sm:px-4 sm:py-3 sm:text-xl">Feature</th>
							<th class="px-2 py-2 text-left text-base sm:px-4 sm:py-3 sm:text-xl">Windows</th>
							<th class="px-2 py-2 text-left text-base sm:px-4 sm:py-3 sm:text-xl">Fedora Linux</th>
						</tr>
					</thead>
					<tbody>
						<tr class="hover:bg-cyber-black/30">
							<td class="px-2 py-2 font-medium text-cyber-verify sm:px-4 sm:py-3">Performance</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Resource-heavy, slows over time</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Lightweight, consistent speed</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="px-2 py-2 font-medium text-cyber-verify sm:px-4 sm:py-3">Cost</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Expensive licenses</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">No license costs</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="px-2 py-2 font-medium text-cyber-verify sm:px-4 sm:py-3">Customization</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Limited theming</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Endless tweaks & extensions</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="px-2 py-2 font-medium text-cyber-verify sm:px-4 sm:py-3">Privacy</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Telemetry, data collection, advertising ID</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">No Microsoft or Government spying</td>
						</tr>
						<!-- <tr class="hover:bg-cyber-black/30">
                            <td class="px-2 py-2 sm:px-4 sm:py-3 font-medium text-cyber-verify">Support</td>
                            <td class="px-2 py-2 sm:px-4 sm:py-3">Paid tiers</td>
                            <td class="px-2 py-2 sm:px-4 sm:py-3">Community + our premium service</td>
                        </tr> -->
						<tr class="hover:bg-cyber-black/30">
							<td class="px-2 py-2 font-medium text-cyber-verify sm:px-4 sm:py-3">Security</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3">Prone to viruses, frequent patches</td>
							<td class="px-2 py-2 sm:px-4 sm:py-3"
								>Immutable core, SELinux enforcement (exceptionally lower risk of getting a virus)</td
							>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section id="services" class="bg-cyber-midnight py-12 sm:py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="scroll-reveal mb-4 text-3xl font-bold text-cyber-white sm:text-4xl md:text-5xl">
					Our Services
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-base text-cyber-silver sm:text-lg">
					From migration to maintenance, we handle it all with precision and care.
				</p>
			</div>

			<div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-neon sm:text-2xl">Guided Setup Process</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Expert hands-on migration: data transfer, app compatibility, and seamless transition in
						just an hour.
					</p>
					<div class="badge badge-primary">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-electric sm:text-2xl">OS Customization</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Personalize your Fedora install: themes, workflows, extensions — make it yours from day
						one.
					</p>
					<div class="badge badge-secondary">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-pulse sm:text-2xl">Security Hardening</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Turn your system into a fortress: firewalls, encryption, audits to lock down your system
						against threats.
					</p>
					<div class="badge badge-success">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-neon sm:text-2xl">Automation Services</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Automate critical system functions including file backups, updates, system maintenance -
						giving you peace of mind to focus on what's important.
					</p>
					<div class="badge badge-accent">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-electric sm:text-2xl">
						Remote Log Analysis
					</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Optional System Monitoring: We scan logs 24/7 to assist with analyzing any problems that
						may arise with your computer.
					</p>
					<div class="badge badge-primary">Ongoing Support</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-pulse sm:text-2xl">Free Recovery</h3>
					<p class="mb-4 text-sm text-cyber-silver sm:text-base">
						Zero-cost fixes*: If anything goes wrong, our team restores your system swiftly and
						securely.
					</p>
					<div class="badge badge-success">Included</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Support Section -->
	<section id="support" class="bg-cyber-charcoal py-12 sm:py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="scroll-reveal mb-4 text-3xl font-bold text-cyber-white sm:text-4xl md:text-5xl">
					Unmatched Support
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-base text-cyber-silver sm:text-lg">
					We're with you every step—and beyond. Long-term peace of mind included.
				</p>
			</div>

			<div class="scroll-reveal mx-auto grid max-w-4xl gap-6 sm:gap-8 md:grid-cols-2">
				<div class="cyber-panel p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-highlight sm:text-2xl">
						24/7 Remote Monitoring
					</h3>
					<p class="text-sm text-cyber-silver sm:text-base">
						Automated alerts and expert analysis ensure your system runs flawlessly. Catch problems
						before they start.
					</p>
				</div>

				<div class="cyber-panel p-6 sm:p-8">
					<h3 class="mb-4 text-xl font-bold text-cyber-highlight sm:text-2xl">Recovery Services</h3>
					<p class="text-sm text-cyber-silver sm:text-base">
						Fixes for critical issues included in lifetime plan.* Our team handles operating system
						glitches, software bugs, or system upgrade problems.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Disclaimer Section -->
	<section class="border-t border-cyber-silver/20 bg-cyber-midnight py-6">
		<div class="container mx-auto px-4">
			<div class="text-center">
				<p
					class="scroll-reveal mx-auto max-w-3xl text-xs leading-relaxed text-cyber-silver/80 italic sm:text-sm"
				>
					*Asterisked services: 2 free basic support usages; subsequent ones subject to lump sum
					fee.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-cyber-midnight py-12 text-center sm:py-16 md:py-20">
		<div class="scroll-reveal container mx-auto px-4">
			<h2 class="mb-6 text-3xl font-bold text-cyber-white sm:text-4xl md:text-5xl">
				Ready to Forge Your Future?
			</h2>
			<p class="mx-auto mb-8 max-w-2xl text-base text-cyber-silver sm:text-lg">
				Join thousands who've switched to Linux with confidence. Your seamless migration starts
				today.
			</p>
			<a href="/contact" class="cyber-glow btn inline-block btn-md btn-primary sm:btn-lg md:btn-xl"
				>Get Started Now</a
			>
		</div>
	</section>
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

	.animate-slide-in {
		animation: cyber-pulse 2s infinite;
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

	.comparison-table th,
	.comparison-table td {
		border-bottom: 1px solid var(--color-cyber-silver);
	}

	.comparison-table th {
		background: var(--color-cyber-charcoal);
		color: var(--color-cyber-neon);
	}

	.service-card {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.service-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2);
	}
</style>
