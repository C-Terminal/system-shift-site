<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { SlaSuccessMessage } from './+page.server';
	import { superForm } from 'sveltekit-superforms';
	import Agreement from '$lib/components/sla/Agreement.svelte';

	export let data: PageData;

	// superforms gives us a typed form object back from load/actions
	const { form } = data;

	// --- Local UI state ---
	let formSubmitting = false;

	const { enhance, message } = superForm(data.form, {
		onSubmit: () => {
			formSubmitting = true;
		},
		onError: () => {
			formSubmitting = false;
		},
		onResult: () => {
			// server action returns a (possibly fresh) form with message, errors, and cleared data
			// superforms updates `form` for us automatically
			formSubmitting = false;

			// Keep local mirrors in sync after a successful reset:
			// If the server returned a fresh/empty form, these will be blank.
			clientSignature = (form.data?.clientSignature as string) ?? '';
			providerSignature = (form.data?.providerSignature as string) ?? '';

			// normalize effective date local string again
			const v = form.data?.effectiveDate as unknown;
			if (!v) {
				effectiveDateStr = '';
			} else if (typeof v === 'string') {
				effectiveDateStr = v;
			} else if (v instanceof Date) {
				effectiveDateStr = toYMD(v);
			} else {
				try {
					const parsed = new Date(String(v));
					effectiveDateStr = isNaN(parsed.getTime()) ? '' : toYMD(parsed);
				} catch {
					effectiveDateStr = '';
				}
			}
		}
	});

	// Signatures are stored as base64 data URLs; we keep local copies and also
	// mirror them into form.data so superforms posts them.
	let clientSignature: string = (form.data?.clientSignature as string) ?? '';
	let providerSignature: string = (form.data?.providerSignature as string) ?? '';

	// effectiveDate input expects YYYY-MM-DD; superforms+Zod will coerce this to Date server-side
	function toYMD(d: Date) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}
	const today = toYMD(new Date());

	// Normalize whatever we have in form.data.effectiveDate to a string the <input type="date"> can use
	let effectiveDateStr: string = (() => {
		const v = form.data?.effectiveDate as unknown;
		if (!v) return '';
		if (typeof v === 'string') return v;
		if (v instanceof Date) return toYMD(v);
		// if hydration passed a serialized date string:
		try {
			const parsed = new Date(String(v));
			return isNaN(parsed.getTime()) ? '' : toYMD(parsed);
		} catch {
			return '';
		}
	})();

	// Keep form.data in sync when user edits date
	function onDateInput(value: string) {
		effectiveDateStr = value;
		// let the schema coerce this string to Date on submit
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(form.data as any).effectiveDate = value;
		// clear any visible error on input
		form.errors.effectiveDate = undefined;
	}

	// --- Signature pads ---
	let clientCanvas: HTMLCanvasElement;
	let providerCanvas: HTMLCanvasElement;

	function setupSignaturePad(canvas: HTMLCanvasElement, onSave: (dataUrl: string) => void) {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		let drawing = false;

		const resize = () => {
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
			onSave(canvas.toDataURL());
		};

		// Mouse
		canvas.addEventListener('mousedown', start);
		canvas.addEventListener('mousemove', move);
		canvas.addEventListener('mouseup', stop);
		canvas.addEventListener('mouseleave', stop);
		// Touch
		canvas.addEventListener('touchstart', start, { passive: false });
		canvas.addEventListener('touchmove', move, { passive: false });
		canvas.addEventListener('touchend', stop);

		// Initial + responsive sizing
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
			form.data.clientSignature = url;
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

	// Type guard to render a rich message object
	const isObjMessage = (m: unknown): m is SlaSuccessMessage =>
		!!m && typeof m === 'object' && 'title' in m;
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

			<!-- Status message (typed SlaMsg); fall back to $page.status if you used plain strings) -->
			{#if $message}
				<div
					class="mb-6 rounded border px-3 py-2"
					class:!border-green-500={$message.status === 'success'}
					class:!border-red-500={$message.status === 'error'}
				>
					{$message.text}
					{#if $message.savedId}
						<span class="ml-2 opacity-75">(ID: {$message.savedId})</span>
					{/if}
				</div>
			{/if}

			<form method="POST" use:enhance>
				<!-- Signatures are posted as hidden fields -->
				<input type="hidden" name="clientSignature" bind:value={clientSignature} />
				<input type="hidden" name="providerSignature" bind:value={providerSignature} />

				<div class="form-group mb-6">
					<label class="form-label">Effective Date</label>
					<input
						type="date"
						name="effectiveDate"
						min={today}
						bind:value={effectiveDateStr}
						class="input-bordered input w-full text-black {form.errors.effectiveDate
							? 'border-cyber-alert'
							: ''}"
						on:input={(e) => onDateInput((e.target as HTMLInputElement).value)}
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
						bind:value={form.data.clientName as string | undefined}
						class="input-bordered input w-full text-black {form.errors.clientName
							? 'border-cyber-alert'
							: ''}"
						on:input={() => (form.errors.clientName = undefined)}
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
							<p class="error-message">{form.errors.clientSignature[0]}</p>
						{/if}
						<button type="button" class="btn mt-2 btn-sm" on:click={() => clearSignature('client')}>
							Clear Signature
						</button>
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
							on:click={() => clearSignature('provider')}
						>
							Clear Signature
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="cyber-glow btn w-full btn-lg btn-primary"
					disabled={formSubmitting}
				>
					{#if formSubmitting}Submitting...{:else}Submit Agreement{/if}
				</button>
			</form>
		</div>

		<!-- Static reference block (optional) -->
		<Agreement />
	</div>
</div>

<style>
	:global(.cyber-form) {
		background: var(--color-cyber-charcoal);
		border: 1px solid color-mix(in oklab, var(--color-cyber-blue), transparent 80%);
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
