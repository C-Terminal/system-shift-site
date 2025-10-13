<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { fade, slide } from 'svelte/transition';
    import { onMount } from 'svelte';
  
    export let data: PageData;

    let formSubmitting = false;
  
    // superForm client setup
    const {
      form,          // writable store of form data
      enhance,       // use:enhance action for progressive enhancement
      errors,        // validation errors
      constraints,   // HTML constraint attributes store
      message        // success message store
    } = superForm(data.form, {
        onSubmit: () => {
          formSubmitting = true;
        },
      onError: ({ result }) => {
        console.debug('Validation errors:', result.error);
      },
      onResult: ({ result }) => {
        formSubmitting = false;
        if (result.type === 'success') {
          // Optional redirect; comment out if you prefer inline success notice
          goto('/thank-you');
        }
      }
    });
  
    // Focus management
    let nameInput: HTMLInputElement;
    let emailInput: HTMLInputElement;
    let messageInput: HTMLTextAreaElement;
  
    onMount(() => {
      nameInput?.focus();
    });
  
    function onNameBlur() {
      if ($form.name?.trim() && !$form.email) emailInput?.focus();
    }
    function onEmailBlur() {
      if ($form.email?.trim() && !$form.message) messageInput?.focus();
    }
  
    // For convenience in markup
    $: $form;       // form data
    $: $errors;     // current errors
    $: $message;    // server message
    $: $constraints;
  </script>
  
  <svelte:head>
    <title>Contact Us - SystemShift Technologies</title>
  </svelte:head>
  
  <div class="min-h-screen bg-cyber-midnight py-12 relative overflow-hidden">
    <!-- Background particles -->
    <div class="cyber-particle" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
    <div class="cyber-particle" style="top: 20%; right: 15%; animation-delay: 2s;"></div>
    <div class="cyber-particle" style="bottom: 30%; left: 20%; animation-delay: 4s;"></div>
  
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="p-8 mb-8 rounded-2xl bg-cyber-black/40 border border-cyber-silver/20 shadow-xl" in:fade={{ duration: 800 }}>
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-cyber-white text-center drop-shadow">Get In Touch</h1>
        <p class="text-cyber-silver mb-8 text-center leading-relaxed">Ready to shift to superior systems? Drop us a line—we'll respond faster than a kernel update.</p>
  
        <!-- Superforms-enhanced form -->
        <form method="POST" use:enhance class="space-y-6">
          <!-- Honeypot (hidden from humans) -->
          <input type="text" name="company" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
  
          <!-- Name -->
          <div class="relative mb-6">
            <label for="name" class="block text-sm font-medium mb-2 text-cyber-silver">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              bind:value={$form.name}
              {...$constraints.name}
              class="
                w-full px-4 py-3 rounded-lg transition-all duration-300
                bg-cyber-black/50 border border-cyber-silver/20 text-cyber-white placeholder-cyber-silver/50
                focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:border-transparent
                shadow-sm
                {$errors.name ? 'border-cyber-alert ring-1 ring-cyber-alert/50' : ''}
                {$message ? 'border-cyber-verify ring-1 ring-cyber-verify/40 bg-cyber-verify/10' : ''}"
              placeholder="Your name"
              aria-invalid={$errors.name ? 'true' : 'false'}
              aria-describedby={$errors.name ? 'name-error' : undefined}
              bind:this={nameInput}
              on:blur={onNameBlur}
              required
            />
            {#if $errors.name}
              <p id="name-error" class="mt-2 text-sm text-cyber-alert">{$errors.name[0]?.message}</p>
            {/if}
          </div>
  
          <!-- Email -->
          <div class="relative mb-6">
            <label for="email" class="block text-sm font-medium mb-2 text-cyber-silver">Contact Email</label>
            <input
              id="email"
              name="email"
              type="email"
              bind:value={$form.email}
              {...$constraints.email}
              class="
                w-full px-4 py-3 rounded-lg transition-all duration-300
                bg-cyber-black/50 border border-cyber-silver/20 text-cyber-white placeholder-cyber-silver/50
                focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:border-transparent
                shadow-sm
                {$errors.email ? 'border-cyber-alert ring-1 ring-cyber-alert/50' : ''}
                {$message ? 'border-cyber-verify ring-1 ring-cyber-verify/40 bg-cyber-verify/10' : ''}"
              placeholder="your@email.com"
              aria-invalid={$errors.email ? 'true' : 'false'}
              aria-describedby={$errors.email ? 'email-error' : undefined}
              bind:this={emailInput}
              on:blur={onEmailBlur}
              required
            />
            {#if $errors.email}
              <p id="email-error" class="mt-2 text-sm text-cyber-alert">{$errors.email[0]}</p>
            {/if}
          </div>
  
          <!-- Message -->
          <div class="relative mb-6">
            <label for="message" class="block text-sm font-medium mb-2 text-cyber-silver">Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              bind:value={$form.message}
              {...$constraints.message}
              class="
                w-full px-4 py-3 h-32 resize-none rounded-lg transition-all duration-300
                bg-cyber-black/50 border border-cyber-silver/20 text-cyber-white placeholder-cyber-silver/50
                focus:outline-none focus:ring-2 focus:ring-cyber-neon focus:border-transparent
                shadow-sm
                {$errors.message ? 'border-cyber-alert ring-1 ring-cyber-alert/50' : ''}
                {$message ? 'border-cyber-verify ring-1 ring-cyber-verify/40 bg-cyber-verify/10' : ''}"
              placeholder="Tell us about your setup or questions..."
              aria-invalid={$errors.message ? 'true' : 'false'}
              aria-describedby={$errors.message ? 'message-error' : undefined}
              bind:this={messageInput}
            />
            {#if $errors.message}
              <p id="message-error" class="mt-2 text-sm text-cyber-alert">{$errors.message[0]}</p>
            {/if}
          </div>
  
          <!-- Submit -->
          <button
            type="submit"
            class="
              relative w-full inline-flex items-center justify-center font-semibold
              rounded-lg px-4 py-3 transition
              bg-cyber-electric text-cyber-black hover:bg-cyber-neon
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-neon
              overflow-hidden
            "
            in:slide={{ duration: 300, delay: 100 }}
            disabled={formSubmitting}
          >
            {#if formSubmitting}
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-cyber-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            {:else}
              Send Transmission
            {/if}
          </button>
        </form>
  
        {#if $message}
          <div
            class="mt-6 p-4 rounded-lg border border-cyber-verify/30 bg-cyber-verify/10 flex items-start gap-2"
            in:fade={{ duration: 500 }}
            out:fade={{ duration: 300 }}
            role="status"
          >
            <svg class="w-6 h-6 text-cyber-verify" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-cyber-verify">{$message}</span>
          </div>
        {/if}
      </div>
  
      <div class="text-center space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-8">
        <a href="/services" class="inline-block px-4 py-2 rounded-lg border border-cyber-electric/60 text-cyber-electric hover:text-cyber-neon hover:border-cyber-neon transition">Our Services</a>
        <a href="/sla" class="inline-block px-4 py-2 rounded-lg text-cyber-silver hover:text-cyber-white transition">View SLA</a>
      </div>
    </div>
  </div>
  
  <style>
    .cyber-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--color-cyber-neon, #22d3ee);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      opacity: 0.7;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  </style>
  