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
	<title>SystemShift - Switch to Linux Excellence</title>
	<meta
		name="description"
		content="Professional migration services from Windows to Fedora Linux. Secure, customized, and supported."
	/>
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Section -->
	<section class="hero-bg relative flex min-h-screen items-center justify-center px-4 text-center">
		<div class="scroll-reveal visible relative z-10 mx-auto max-w-4xl">
			<h1 class="text-gradient-blue mb-6 text-5xl leading-tight font-bold md:text-7xl lg:text-8xl">
				SystemShift
			</h1>
			<p class="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-cyber-silver md:text-2xl">
				Migrate from Windows to Fedora Linux with seamless expertise. Secure, customized, and
				future-proof your computing.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/contact" class="cyber-glow btn btn-lg btn-primary">Start Migration</a>
				<a href="#services" class="btn btn-outline btn-lg">Explore Services</a>
			</div>
		</div>
		<div class="cyber-line absolute right-0 bottom-0 left-0 h-1"></div>
	</section>

	<!-- Why Switch Section -->
	<section id="why" class="cyberpunk-grid bg-cyber-midnight py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="scroll-reveal mb-4 text-4xl font-bold text-cyber-white md:text-5xl">
					Why Fedora Linux?
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-lg text-cyber-silver">
					Leave the vulnerabilities of Windows behind. Embrace the open-source power of Linux for
					unmatched security, performance, and freedom.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<div class="scroll-reveal cyber-box p-8 text-center">
					<h3 class="mb-4 text-2xl font-bold text-cyber-neon">Superior Security</h3>
					<p class="text-cyber-silver">
						Linux's permission model and rapid updates shield you from threats that plague Windows
						daily.
					</p>
				</div>

				<div class="scroll-reveal cyber-box p-8 text-center">
					<h3 class="mb-4 text-2xl font-bold text-cyber-electric">Blazing Performance</h3>
					<p class="text-cyber-silver">
						Lightweight and efficient—run circles around bloated Windows with Fedora's optimized
						kernel.
					</p>
				</div>

				<div class="scroll-reveal cyber-box p-8 text-center">
					<h3 class="mb-4 text-2xl font-bold text-cyber-pulse">Total Customization</h3>
					<p class="text-cyber-silver">
						Tailor your OS to perfection. No more compromises—Linux bends to your workflow.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Comparison Section -->
	<section id="comparison" class="bg-cyber-charcoal py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="scroll-reveal mb-4 text-4xl font-bold text-cyber-white md:text-5xl">
					Windows vs. Fedora Linux
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-lg text-cyber-silver">
					See why Linux outshines Windows in every critical aspect.
				</p>
			</div>

			<div class="scroll-reveal overflow-x-auto">
				<table class="comparison-table w-full text-cyber-silver">
					<thead>
						<tr>
							<th class="text-2xl">Feature</th>
							<th class="text-2xl">Windows</th>
							<th class="text-2xl">Fedora Linux</th>
						</tr>
					</thead>
					<tbody>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Security</td>
							<td>Prone to viruses, frequent patches</td>
							<td>Immutable core, SELinux enforcement</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Performance</td>
							<td>Resource-heavy, slows over time</td>
							<td>Lightweight, consistent speed</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Cost</td>
							<td>Expensive licenses</td>
							<td>Completely free</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Customization</td>
							<td>Limited theming</td>
							<td>Endless tweaks & extensions</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Privacy</td>
							<td>Telemetry tracking</td>
							<td>No corporate spying</td>
						</tr>
						<tr class="hover:bg-cyber-black/30">
							<td class="font-medium text-cyber-verify">Support</td>
							<td>Paid tiers</td>
							<td>Community + our premium service</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section id="services" class="bg-cyber-midnight py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="scroll-reveal mb-4 text-4xl font-bold text-cyber-white md:text-5xl">
					Our Services
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-lg text-cyber-silver">
					From migration to maintenance, we handle it all with precision and care.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-neon">Guided Setup Process</h3>
					<p class="mb-4 text-cyber-silver">
						Expert hands-on migration: data transfer, app compatibility, and seamless transition
						without downtime.
					</p>
					<div class="badge badge-primary">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-electric">OS Customization</h3>
					<p class="mb-4 text-cyber-silver">
						Personalize your Fedora install: themes, workflows, extensions—make it yours from day
						one.
					</p>
					<div class="badge badge-secondary">Premium Add-on</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-pulse">Security Hardening</h3>
					<p class="mb-4 text-cyber-silver">
						Post-install fortress: firewalls, encryption, audits to lock down your system against
						threats.
					</p>
					<div class="badge badge-success">Included</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-neon">Automation Services</h3>
					<p class="mb-4 text-cyber-silver">
						Script your routines: backups, updates, monitoring—effortless efficiency at your
						fingertips.
					</p>
					<div class="badge badge-accent">Premium Add-on</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-electric">Remote Log Analysis</h3>
					<p class="mb-4 text-cyber-silver">
						Proactive monitoring: We scan logs 24/7 to nip issues in the bud before they impact you.
					</p>
					<div class="badge badge-primary">Ongoing Support</div>
				</div>

				<div class="scroll-reveal service-card cyber-box card">
					<h3 class="mb-4 text-2xl font-bold text-cyber-pulse">Free Recovery</h3>
					<p class="mb-4 text-cyber-silver">
						Zero-cost fixes: If anything goes wrong, our team restores your system swiftly and
						securely.
					</p>
					<div class="badge badge-success">Lifetime Guarantee</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Support Section -->
	<section id="support" class="bg-cyber-charcoal py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="scroll-reveal mb-4 text-4xl font-bold text-cyber-white md:text-5xl">
					Unmatched Support
				</h2>
				<p class="scroll-reveal mx-auto max-w-3xl text-lg text-cyber-silver">
					We're with you every step—and beyond. Long-term peace of mind included.
				</p>
			</div>

			<div class="scroll-reveal mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
				<div class="cyber-panel p-8">
					<h3 class="mb-4 text-2xl font-bold text-cyber-highlight">24/7 Remote Monitoring</h3>
					<p class="text-cyber-silver">
						Automated alerts and expert analysis ensure your system runs flawlessly. Catch problems
						before they start.
					</p>
				</div>

				<div class="cyber-panel p-8">
					<h3 class="mb-4 text-2xl font-bold text-cyber-highlight">Lifetime Recovery</h3>
					<p class="text-cyber-silver">
						Free fixes for any issue. Our team handles hardware glitches, software bugs, or
						migrations—guaranteed.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-cyber-midnight py-20 text-center">
		<div class="scroll-reveal container mx-auto px-4">
			<h2 class="mb-6 text-4xl font-bold text-cyber-white md:text-5xl">
				Ready to Forge Your Future?
			</h2>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-cyber-silver">
				Join thousands who've switched to Linux with confidence. Your seamless migration starts
				today.
			</p>
			<a href="/contact" class="cyber-glow btn inline-block btn-xl btn-primary">Get Started Now</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-cyber-black py-8 text-center text-cyber-silver">
		<div class="container mx-auto px-4">
			<p>
				&copy; 2025 FedoraForge. All rights reserved. | <a
					href="/privacy"
					class="text-cyber-electric hover:text-cyber-neon">Privacy Policy</a
				>
			</p>
		</div>
	</footer>
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
		padding: 1rem;
		text-align: left;
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
