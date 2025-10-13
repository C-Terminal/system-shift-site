<script>
	const linkSections = [
		{
			title: 'Support',
			links: [
				{ name: 'Contact Us', href: '/contact' },
				{ name: 'Help Center', href: '/help' },
				{ name: 'FAQs', href: '/faq' }
			]
		}
	];
</script>

<footer
	class="border-t border-b border-cyber-charcoal bg-cyber-midnight font-space-grotesk text-cyber-white"
>
	<div class="container mx-auto px-4 py-12 md:py-16">
		<div class="mb-10 grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
			<!-- Branding Section -->
			<div class="col-span-2 mb-6 lg:col-span-1 lg:mb-0">
				<a href="/" class="mb-4 flex items-center space-x-2" aria-label="System Shift Homepage">
					<span class="text-lg font-semibold text-cyber-neon"> System Shift </span>
				</a>
				<div class="mb-4 text-center md:mb-0 md:text-left">
					<p class="text-cyber-silver">© 2025 System Shift Inc. All rights reserved.</p>
				</div>
			</div>

			<!-- Link Sections -->
			{#each linkSections as section (section.title)}
				<div class="cyber-box">
					<h3 class="mb-4 text-sm font-semibold tracking-wider text-cyber-electric uppercase">
						{section.title}
					</h3>
					<ul class="space-y-3">
						{#each section.links as link (link.name)}
							<li>
								<a
									href={link.href}
									class="text-base text-cyber-silver transition-colors duration-200 hover:text-cyber-neon focus:ring-2 focus:ring-cyber-neon focus:ring-offset-2 focus:ring-offset-cyber-midnight focus:outline-none"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</footer>
