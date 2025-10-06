<script>
	// import { onMount } from "svelte";

	// Reactive current year
	// let currentYear = $state(new Date().getFullYear());

	// // Reactive time for Toronto
	// let currentTime = $state(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Toronto' }));

	// // Update time every second
	// onMount(() => {
	// 	const interval = setInterval(() => {
	// 		currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Toronto' });
	// 	}, 1000);
	// 	return () => clearInterval(interval);
	// });

	// Placeholder data - replace with actual links/structure as needed
	const linkSections = [
		{
			title: 'Company',
			links: [
				{ name: 'About Us', href: '/about' },
				{ name: 'Careers', href: '/careers' },
				{ name: 'Press', href: '/press' }
			]
		},
		{
			title: 'Services',
			links: [
				{ name: 'Foreign Exchange', href: '/forex' },
				{ name: 'Remittance', href: '/remittance' },
				{ name: 'Money Orders', href: '/money-orders' },
				{ name: 'Virtual Currency', href: '/crypto' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ name: 'Privacy Policy', href: '/privacy' },
				{ name: 'Terms of Service', href: '/terms' },
				{ name: 'Cookie Policy', href: '/cookies' }
			]
		},
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
  class="bg-fintech-white font-sans dark:bg-fintech-dark border-t border-fintech-light-gray dark:border-fintech-muted text-gray-900 dark:text-gray-200"
>
  <div class="container mx-auto px-4 py-12 md:py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
      <!-- Branding Section -->
      <div class="col-span-2 lg:col-span-1 mb-6 lg:mb-0">
        <a
          href="/"
          class="flex items-center space-x-2 mb-4"
          aria-label="The GCE Homepage"
        >
          <span
            class="text-lg font-semibold text-fintech-red-canadian dark:text-fintech-red-canadian"
          >
            The GCE
          </span>
        </a>
        <p class="text-sm text-gray-600 dark:text-gray-200">
          Innovating the future of financial services.
        </p>
      </div>

      <!-- Link Sections -->
      {#each linkSections as section (section.title)} 
        <div>
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-fintech-red-canadian dark:text-fintech-red-canadian mb-4"
          >
            {section.title}
          </h3>
          <ul class="space-y-3">
            {#each section.links as link (link.name)}
              <li>
                <a
                  href={link.href}
                  class="text-md text-gray-600 dark:text-gray-200 hover:text-fintech-red-canadian dark:hover:text-fintech-red-canadian transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fintech-red-canadian focus:ring-offset-2 dark:focus:ring-offset-fintech-dark"
                >
                  {link.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Bottom Section -->
    <div
      class="mt-10 pt-8 border-t border-fintech-light-gray dark:border-fintech-muted flex flex-col md:flex-row items-center justify-between text-sm"
    >
      <div class="text-center md:text-left mb-4 md:mb-0">
        <p class="text-gray-600 dark:text-gray-200">
          © 2025 The GCE Inc. All rights reserved.
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-200 opacity-80">
          Financial services involve risk. Please read our full disclosures and terms. Not investment advice.
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-200 opacity-80">
          Based in Mississauga, ON, Canada.
        </p>
      </div>

    </div>
  </div>
</footer>