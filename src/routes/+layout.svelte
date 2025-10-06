<script lang="ts">
	import NavigationHomePage from '$lib/components/layout/NavigationHomePage.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import '../app.css'; // Tailwind CSS import


	// export let data: LayoutData;

	// $: session = data.session; // Session data is reactive

	// This script ensures the correct theme is applied before the page renders
	// to prevent theme flickering
	if (typeof window !== 'undefined') {
		const script = document.createElement('script');
		script.textContent = `
      (function() {
        const theme = localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      })();
    `;
		document.head.appendChild(script);
	}
</script>

<NavigationHomePage/>
<!-- <ThemeToggle/> -->
<div class="flex min-h-screen flex-col">
	<main class="flex-grow">
		<slot />
	</main>

	<Footer />
</div>
