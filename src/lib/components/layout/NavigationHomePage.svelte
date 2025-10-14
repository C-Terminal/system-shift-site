<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';

	// Reactive state for menu toggle
	let isMenuOpen = $state(false);
	
	// Active link tracking
	let activeLink = $state('/');
	
	// Animation direction control
	let menuHeight;
	
	// Hover states for glow effects
	let hoveredLink = $state(Number(null) || null);

	// Navigation links
	const navLinks = [
		{ name: 'Service Level Agreement', href: '/sla', id: 2 },
		{ name: 'Contact Us', href: '/contact', id: 4 },
		{name: "SLA entries", href: '/sla/list', id: 3}

		// { name: 'Help Center', href: '/help', id: 5 },
		// { name: 'FAQs', href: '/faq', id: 6 }

	];

	// Toggle menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Close menu on link click (mobile)
	function closeMenu() {
		isMenuOpen = false;
	}
	
	// Set hovered link for glow effect
	/**
	 * @param {number | null} index
	 */
	function setHoveredLink(index) {
		hoveredLink = Number(index);
	}
	
	function clearHoveredLink() {
		hoveredLink = null;
	}
	
	// Set active link based on current path
	function setActivePath() {
		activeLink = window.location.pathname;
	}

	// Ensure menu closes on resize to desktop
	onMount(() => {
		setActivePath();
		
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				isMenuOpen = false;
			}
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
</script>

<nav
	class="bg-cyber-midnight border-cyber-blue/20 border-b shadow-md backdrop-blur-sm sticky top-0 z-50 font-jet-mono"
	aria-label="Main navigation"
	role="navigation"
>
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<!-- Branding -->
		<div class="flex-shrink-0">
			<a
				href="/"
				class="font-space-grotesk text-xl font-bold tracking-tight flex items-center"
				aria-label="System Shift Homepage"
			>
				<span class="text-cyber-white">System</span>
				<span class="text-cyber- cyber-glow  text-gradient-purple ml-1">Shift</span>
			</a>
		</div>

		<!-- Desktop Navigation (md: and up) -->
		<div class="hidden md:flex md:items-center md:space-x-6">
			{#each navLinks as link, index (link.id)}
				<a
					href={link.href}
					class="text-cyber-silver hover:text-cyber-neon focus:ring-cyber-neon transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-offset-cyber-midnight text-sm font-medium py-2 px-1 border-b-2 border-transparent {activeLink === link.href ? 'border-cyber-electric text-cyber-white' : ''} {hoveredLink === index ? 'cyber-glow' : ''}"
					in:fade={{ duration: 300, delay: index * 100 }}
					on:mouseenter={() => setHoveredLink(index)}
					on:mouseleave={clearHoveredLink}
				>
					{link.name}
				</a>
			{/each}
		</div>

		<!-- Action Buttons -->
		<div class="hidden md:flex items-center space-x-4">
			<button 
				class="btn-ghost text-cyber-silver hover:text-cyber-white p-2 rounded-full transition-all duration-200" 
				aria-label="Search"
				in:fade={{ duration: 300, delay: 400 }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
			

		</div>

		<!-- Mobile Controls -->
		<div class="flex items-center space-x-2 md:hidden">
			<!-- Search Button -->
			<button
				class="text-cyber-silver hover:text-cyber-neon focus:ring-cyber-neon rounded-full p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-offset-cyber-midnight"
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>

			<!-- Hamburger Button -->
			<button
				type="button"
				class="text-cyber-silver hover:text-cyber-neon focus:ring-cyber-neon p-2 transition-all duration-300 md:hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-midnight focus:outline-none {isMenuOpen ? 'text-cyber-neon' : ''}"
				aria-label="Toggle navigation menu"
				aria-haspopup="true"
				aria-controls="mobile-menu"
				aria-expanded={isMenuOpen}
				on:click={toggleMenu}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 transition-transform duration-300 {isMenuOpen ? 'rotate-90' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					{#if !isMenuOpen}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h7"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div
			class="bg-cyber-charcoal border-cyber-blue/10 border-t md:hidden"
			id="mobile-menu"
			role="menu"
			in:fly={{ y: -20, duration: 300, easing: quintOut }}
			out:fly={{ y: -20, duration: 200 }}
			bind:clientHeight={menuHeight}
		>
			<ul class="space-y-1 px-4 py-3">
				{#each navLinks as link, index (link.id)}}
					<li
						in:fly={{ y: -10, delay: index * 75, duration: 200 }}
					>
						<a
							href={link.href}
							class="text-cyber-silver hover:text-cyber-neon hover:bg-cyber-blue/5 focus:ring-cyber-neon block rounded-md px-3 py-2 text-base transition-all duration-200 focus:ring-2 focus:outline-none {activeLink === link.href ? 'bg-cyber-blue/10 text-cyber-white' : ''}"
							role="menuitem"
							on:click={closeMenu}
						>
							{link.name}
						</a>
					</li>
				{/each}
				
				<!-- Mobile sign in button -->
				<li in:fly={{ y: -10, delay: navLinks.length * 75, duration: 200 }}>
					<div class="px-3 pt-4 pb-1">
						<button class="w-full btn btn-sm btn-primary">
							Sign In
						</button>
					</div>
				</li>
			</ul>
		</div>
	{/if}
</nav>

<style>
	/* Add any additional component-specific styles here */
	:global(.cyber-glow) {
		text-shadow: 0 0 5px rgb(34 211 238 / 70%), 0 0 10px rgb(14 165 233 / 30%);
	}
</style>