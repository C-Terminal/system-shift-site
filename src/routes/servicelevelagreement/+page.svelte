<script lang="ts">
	import { onMount } from 'svelte';
	// import { enhance } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import type { SlaInput } from '$lib/schemas/sla';
	import { superForm } from 'sveltekit-superforms';
	import Agreement from '$lib/components/sla/Agreement.svelte';
	export let data: PageData;

	// superforms gives us a "form" object with data, errors, constraints, etc.
	// data.form is a SuperValidated<SlaSchema>, already typed.
	const { form } = data;

	// Local helpers
	let formSubmitted = false;

	const { enhance } = superForm(data.form);

	// We keep hidden inputs bound to these (superforms will sync them).
	// Initialize from form.data so we don't lose SSR-filled state after hydration.
	let clientSignature: string = (form.data?.clientSignature as string) ?? '';
	let providerSignature: string = (form.data?.providerSignature as string) ?? '';

	// Effective date control uses YYYY-MM-DD; for min= today
	const todayLocal = (() => {
		const d = new Date();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${d.getFullYear()}-${m}-${day}`;
	})();

	// --- Signature pads ---
	let clientCanvas: HTMLCanvasElement;
	let providerCanvas: HTMLCanvasElement;

	function setupSignaturePad(canvas: HTMLCanvasElement, onSave: (dataUrl: string) => void) {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		let drawing = false;

		const resize = () => {
			// Keep existing content? For simplicity, we clear on resize.
			canvas.width = canvas.offsetWidth;
			canvas.height = 200;
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = '#22d3ee';
		};

		const getPos = (e: MouseEvent | TouchEvent) => {
			const rect = canvas.getBoundingClientRect();
			const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
			const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
			return { x: clientX - rect.left, y: clientY - rect.top };
		};

		const start = (e: MouseEvent | TouchEvent) => {
			e.preventDefault();
			drawing = true;
			const { x, y } = getPos(e);
			ctx.beginPath();
			ctx.moveTo(x, y);
		};

		const move = (e: MouseEvent | TouchEvent) => {
			if (!drawing) return;
			e.preventDefault();
			const { x, y } = getPos(e);
			ctx.lineTo(x, y);
			ctx.stroke();
		};

		const stop = () => {
			if (!drawing) return;
			drawing = false;
			const url = canvas.toDataURL();
			onSave(url);
		};

		// Events
		canvas.addEventListener('mousedown', start);
		canvas.addEventListener('mousemove', move);
		canvas.addEventListener('mouseup', stop);
		canvas.addEventListener('mouseleave', stop);

		canvas.addEventListener('touchstart', start, { passive: false });
		canvas.addEventListener('touchmove', move, { passive: false });
		canvas.addEventListener('touchend', stop);

		// Initialize
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		// Cleanup
		return () => {
			ro.disconnect();
			canvas.removeEventListener('mousedown', start);
			canvas.removeEventListener('mousemove', move);
			canvas.removeEventListener('mouseup', stop);
			canvas.removeEventListener('mouseleave', stop);

			canvas.removeEventListener('touchstart', start);
			canvas.removeEventListener('touchmove', move);
			canvas.removeEventListener('touchend', stop);
		};
	}

	function clearSignature(kind: 'client' | 'provider') {
		const canvas = kind === 'client' ? clientCanvas : providerCanvas;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (kind === 'client') {
			clientSignature = '';
			form.data.clientSignature = '';
			form.errors.clientSignature = ['Client signature is required'];
		} else {
			providerSignature = '';
			form.data.providerSignature = '';
			form.errors.providerSignature = ['Provider signature is required'];
		}
	}

	onMount(() => {
		const disposeClient = setupSignaturePad(clientCanvas, (url) => {
			clientSignature = url;
			form.data.clientSignature = url; // keep superforms model in sync
			form.errors.clientSignature = undefined;
		});
		const disposeProvider = setupSignaturePad(providerCanvas, (url) => {
			providerSignature = url;
			form.data.providerSignature = url;
			form.errors.providerSignature = undefined;
		});

		return () => {
			disposeClient?.();
			disposeProvider?.();
		};
	});

	// Enhance submit with superforms
	// const enhanceOptions = enhance(form, {
	//   onSubmit: () => {
	//     formSubmitted = true;
	//   },
	//   onError: () => {
	//     formSubmitted = false;
	//   },
	//   onResult: () => {
	//     // Keep button state snappy; superforms updates form with messages/errors.
	//     formSubmitted = false;
	//   }
	// });

	// Optional client-side guard before submit (superforms still validates)
	function preSubmit(e: Event) {
		// superforms will handle validation, but you can add UX checks here if needed
		// e.g., ensure signatures aren’t blank if you disabled the inputs by mistake
	}
</script>

<svelte:head>
	<title>SLA Agreement - SystemShift Technologies</title>
</svelte:head>

<div class="min-h-screen bg-cyber-midnight py-12">
	<div class="container mx-auto max-w-4xl px-4">
		<div class="cyber-form card mb-8 p-8">
			<h1 class="mb-6 text-center text-4xl font-bold text-cyber-white">
				Service Level Agreement (SLA)
			</h1>
			<p class="mb-8 text-center text-cyber-silver">
				Please fill out and sign the agreement below.
			</p>

			<!-- superforms: bind this to form -->
			<form method="POST" use:enhance on:submit={preSubmit}>
				<!-- Hidden signature fields (kept in sync in onMount handlers) -->
				<input type="hidden" name="clientSignature" bind:value={clientSignature} />
				<input type="hidden" name="providerSignature" bind:value={providerSignature} />

				<div class="form-group mb-6">
					<label class="form-label">Effective Date</label>
					<input
						type="date"
						name="effectiveDate"
						bind:value={form.data.effectiveDate}
						min={todayLocal}
						class="text-black input-bordered input w-full {form.errors.effectiveDate
							? 'border-cyber-alert'
							: ''}"
						required
					/>
					{#if form.errors.effectiveDate}
						<p class="error-message">{form.errors.effectiveDate}</p>
					{/if}
				</div>

				<div class="form-group mb-6">
					<label class="form-label">Client Name</label>
					<input
						type="text"
						name="clientName"
						bind:value={form.data.clientName as SlaInput['clientName']}
						class="text-black input-bordered input w-full {form.errors.clientName ? 'border-cyber-alert' : ''}"
						
						required
					/>
					{#if form.errors.clientName}
						<p class="error-message">{form.errors.clientName}</p>
					{/if}
				</div>

				<div class="mb-8 grid gap-8 md:grid-cols-2">
					<div>
						<label class="form-label">Client Signature</label>
						<canvas
							bind:this={clientCanvas}
							class="signature-pad block h-48 w-full {form.errors.clientSignature
								? 'border-cyber-alert'
								: ''}"
						/>
						{#if clientSignature}
							<div class="text-cyber-success mt-2 text-sm">Signature captured</div>
						{/if}
						{#if form.errors.clientSignature}
							<p class="error-message">{form.errors.clientSignature}</p>
						{/if}
						<button type="button" class="btn mt-2 btn-sm" on:click={() => clearSignature('client')}
							>Clear Signature</button
						>
					</div>

					<div>
						<label class="form-label">Provider Signature (SystemShift Technologies)</label>
						<canvas
							bind:this={providerCanvas}
							class="signature-pad block h-48 w-full {form.errors.providerSignature
								? 'border-cyber-alert'
								: ''}"
						/>
						{#if providerSignature}
							<div class="text-cyber-success mt-2 text-sm">Signature captured</div>
						{/if}
						{#if form.errors.providerSignature}
							<p class="error-message">{form.errors.providerSignature}</p>
						{/if}
						<button
							type="button"
							class="btn mt-2 btn-sm"
							on:click={() => clearSignature('provider')}>Clear Signature</button
						>
					</div>
				</div>

				<!-- Form-level message (success/failure) -->
				{#if form.message}
					<div class="mb-4 alert alert-info">{form.message}</div>
				{/if}

				<button
					type="submit"
					class="cyber-glow btn w-full btn-lg btn-primary"
					disabled={formSubmitted}
				>
					{#if formSubmitted}
						Submitting...
					{:else}
						Submit Agreement
					{/if}
				</button>
			</form>
		</div>

		<!-- Static SLA reference (unchanged content block) -->
		<Agreement />
	</div>
</div>

<style>
	:global(.cyber-form) {
		background: var(--color-cyber-charcoal);
		border: 1px solid var(--color-cyber-blue/20);
		box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
	}
	.signature-pad {
		border: 2px solid color-mix(in srgb, var(--color-cyber-silver), transparent 70%);
		border-radius: 0.5rem;
		background: var(--color-cyber-black);
		cursor: crosshair;
		transition: border-color 0.2s ease;
	}
	.signature-pad:hover {
		border-color: var(--color-cyber-neon);
	}
	.border-cyber-alert {
		border-color: var(--color-cyber-alert) !important;
	}
	.error-message {
		color: var(--color-cyber-alert);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
