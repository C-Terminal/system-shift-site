<script lang="ts">
	import { enhance } from '$app/forms';

	import { goto } from '$app/navigation';
	import type { SlaFormResponse, FormErrors } from '$lib/types/sla'; // Adjust path
  
	export let form: SlaFormResponse | null;
  
	let effectiveDate: string = form?.effectiveDate ?? '';
	let clientName: string = form?.clientName ?? '';
	let clientSignature: string = form?.clientSignature ?? '';
	let providerSignature: string = form?.providerSignature ?? '';
	let formSubmitted: boolean = false;
	let errors: FormErrors = form?.errors ?? {};
  
	const currentDate: string = '2025-10-07';
  
	// Signature pad functionality
	let clientCanvas: HTMLCanvasElement;
	let providerCanvas: HTMLCanvasElement;
	let clientCtx: CanvasRenderingContext2D;
	let providerCtx: CanvasRenderingContext2D;
	let isDrawing: boolean = false;
  
	function initSignaturePad(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
	  canvas.width = canvas.offsetWidth;
	  canvas.height = 200;
  
	  ctx.strokeStyle = '#22d3ee'; // cyber-neon
	  ctx.lineWidth = 2;
	  ctx.lineCap = 'round' as CanvasLineCap;
	  ctx.lineJoin = 'round' as CanvasLineJoin;
  
	  function getPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
		const rect = canvas.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		return {
		  x: clientX - rect.left,
		  y: clientY - rect.top
		};
	  }
  
	  function startDrawing(e: MouseEvent): void {
		isDrawing = true;
		const pos = getPosition(e);
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
	  }
  
	  function draw(e: MouseEvent): void {
		if (!isDrawing) return;
		e.preventDefault();
		const pos = getPosition(e);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	  }
  
	  function stopDrawing(): void {
		if (isDrawing) {
		  isDrawing = false;
		  const dataUrl = canvas.toDataURL();
		  if (canvas.id === 'client-signature') {
			clientSignature = dataUrl;
			validateField('clientSignature');
		  } else {
			providerSignature = dataUrl;
			validateField('providerSignature');
		  }
		}
	  }
  
	  canvas.addEventListener('mousedown', startDrawing);
	  canvas.addEventListener('mousemove', draw);
	  canvas.addEventListener('mouseup', stopDrawing);
	  canvas.addEventListener('mouseout', stopDrawing);
  
	  // Touch support
	  canvas.addEventListener('touchstart', (e: TouchEvent) => {
		e.preventDefault();
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent('mousedown', {
		  clientX: touch.clientX,
		  clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	  });
  
	  canvas.addEventListener('touchmove', (e: TouchEvent) => {
		e.preventDefault();
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent('mousemove', {
		  clientX: touch.clientX,
		  clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	  });
  
	  canvas.addEventListener('touchend', (e: TouchEvent) => {
		e.preventDefault();
		const mouseEvent = new MouseEvent('mouseup', {});
		canvas.dispatchEvent(mouseEvent);
	  });
	}
  
	function clearSignature(canvasId: string): void {
	  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
	  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  if (canvasId === 'client-signature') {
		clientSignature = '';
		errors.clientSignature = 'Signature required';
	  } else {
		providerSignature = '';
		errors.providerSignature = 'Signature required';
	  }
	  canvas.classList.add('border-cyber-alert');
	}
  
	$: if (clientCanvas) {
	  clientCtx = clientCanvas.getContext('2d') as CanvasRenderingContext2D;
	  initSignaturePad(clientCanvas, clientCtx);
	}
  
	$: if (providerCanvas) {
	  providerCtx = providerCanvas.getContext('2d') as CanvasRenderingContext2D;
	  initSignaturePad(providerCanvas, providerCtx);
	}
  
	function validateField(field: keyof FormErrors): void {
	  errors[field] = undefined; // Use undefined to match optional properties
	  let el = document.querySelector(`[name="${field}"]`) || document.getElementById(field);
	  if (el && (el as Element).closest('canvas')) {
		el = (el as Element).closest('canvas');
	  }
	  if (el) {
		(el as Element).classList.remove('border-cyber-alert');
	  }
  
	  switch (field) {
		case 'effectiveDate':
		  if (!effectiveDate) {
			errors.effectiveDate = 'Effective date is required';
		  } else if (new Date(effectiveDate) < new Date(currentDate)) {
			errors.effectiveDate = 'Effective date must be today or in the future';
		  }
		  break;
		case 'clientName':
		  if (!clientName.trim()) {
			errors.clientName = 'Client name is required';
		  }
		  break;
		case 'clientSignature':
		  if (!clientSignature) {
			errors.clientSignature = 'Client signature is required';
		  }
		  break;
		case 'providerSignature':
		  if (!providerSignature) {
			errors.providerSignature = 'Provider signature is required';
		  }
		  break;
	  }
  
	  if (errors[field]) {
		if (el && (el as Element).closest('canvas')) {
		  ((el as Element).closest('canvas') as Element).classList.add('border-cyber-alert');
		} else if (el) {
		  (el as Element).classList.add('border-cyber-alert');
		}
	  }
	}
  
	function validateForm(): boolean {
	  // Reset errors to base state
	  const resetErrors: Partial<FormErrors> = {};
	  errors = resetErrors as FormErrors;
	  validateField('effectiveDate');
	  validateField('clientName');
	  validateField('clientSignature');
	  validateField('providerSignature');
  
	  return Object.values(errors).every((err: string | undefined) => !err);
	}
  
	async function handleSubmit(e: Event): Promise<void> {
	  e.preventDefault();
	  if (!validateForm()) {
		alert('Please fix the errors below and try again.');
		return;
	  }
	  formSubmitted = true;
	  // After successful submit, redirect or show confirmation
	  setTimeout(() => goto('/confirmation'), 2000);
	}
  
	const enhanceOptions = {
	  onError: (e: CustomEvent<SlaFormResponse>) => {
		formSubmitted = false;
		errors = e.detail.errors ?? {};
		// Re-populate fields on error
		effectiveDate = e.detail.effectiveDate ?? '';
		clientName = e.detail.clientName ?? '';
		clientSignature = e.detail.clientSignature ?? '';
		providerSignature = e.detail.providerSignature ?? '';
	  }
	};
  </script>
  
  <svelte:head>
	<title>SLA Agreement - SystemShift Technologies</title>
  </svelte:head>
  
  <style>
	/* Reuse cyber styles from global CSS */
	:global(.cyber-form) {
	  background: var(--color-cyber-charcoal);
	  border: 1px solid var(--color-cyber-blue/20);
	  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
	}
	
	.signature-pad {
	  border: 2px solid var(--color-cyber-silver/30);
	  border-radius: 0.5rem;
	  background: var(--color-cyber-black);
	  cursor: crosshair;
	  transition: border-color 0.2s ease;
	}
	
	.signature-pad:hover {
	  border-color: var(--color-cyber-neon);
	}
	
	.signature-pad.border-cyber-alert {
	  border-color: var(--color-cyber-alert);
	}
	
	.input.border-cyber-alert {
	  border-color: var(--color-cyber-alert);
	}
	
	.error-message {
	  @apply text-cyber-alert text-sm mt-1;
	}
	
	.btn-sign {
	  @apply btn btn-sm btn-outline border-cyber-neon text-cyber-neon hover:bg-cyber-neon hover:text-cyber-black;
	}
  </style>
  
  <div class="min-h-screen bg-cyber-midnight py-12">
	<div class="container mx-auto px-4 max-w-4xl">
	  <div class="card cyber-form p-8 mb-8">
		<h1 class="text-4xl font-bold mb-6 text-cyber-white text-center">Service Level Agreement (SLA)</h1>
		<p class="text-cyber-silver mb-8 text-center">Please fill out and sign the agreement below.</p>
		
		<form method="POST" use:enhance={enhanceOptions} on:submit={handleSubmit}>
		  <input type="hidden" name="clientSignature" bind:value={clientSignature} />
		  <input type="hidden" name="providerSignature" bind:value={providerSignature} />
		  
		  <div class="form-group mb-6">
			<label class="form-label">Effective Date</label>
			<input type="date" name="effectiveDate" bind:value={effectiveDate} min={currentDate} class="input input-bordered w-full {errors.effectiveDate ? 'border-cyber-alert' : ''}" required on:blur={() => validateField('effectiveDate')} on:change={() => validateField('effectiveDate')} />
			{#if errors.effectiveDate}
			  <p class="error-message">{errors.effectiveDate}</p>
			{/if}
		  </div>
		  
		  <div class="form-group mb-6">
			<label class="form-label">Client Name</label>
			<input type="text" name="clientName" bind:value={clientName} class="input input-bordered w-full {errors.clientName ? 'border-cyber-alert' : ''}" placeholder="Enter your full name" required on:blur={() => validateField('clientName')} />
			{#if errors.clientName}
			  <p class="error-message">{errors.clientName}</p>
			{/if}
		  </div>
		  
		  <div class="grid md:grid-cols-2 gap-8 mb-8">
			<div>
			  <label class="form-label">Client Signature</label>
			  <canvas bind:this={clientCanvas} id="client-signature" class="signature-pad w-full h-48 block {errors.clientSignature ? 'border-cyber-alert' : ''}" />
			  {#if clientSignature}
				<div class="text-cyber-success text-sm mt-2">Signature captured</div>
			  {/if}
			  {#if errors.clientSignature}
				<p class="error-message">{errors.clientSignature}</p>
			  {/if}
			  <button type="button" on:click={() => clearSignature('client-signature')} class="btn-sign mt-2">Clear Signature</button>
			</div>
			
			<div>
			  <label class="form-label">Provider Signature (SystemShift Technologies)</label>
			  <canvas bind:this={providerCanvas} id="provider-signature" class="signature-pad w-full h-48 block {errors.providerSignature ? 'border-cyber-alert' : ''}" />
			  {#if providerSignature}
				<div class="text-cyber-success text-sm mt-2">Signature captured</div>
			  {/if}
			  {#if errors.providerSignature}
				<p class="error-message">{errors.providerSignature}</p>
			  {/if}
			  <button type="button" on:click={() => clearSignature('provider-signature')} class="btn-sign mt-2">Clear Signature</button>
			</div>
		  </div>
		  
		  <button type="submit" class="btn btn-lg btn-primary cyber-glow w-full" disabled={formSubmitted}>
			{#if formSubmitted}
			  Submitting...
			{:else}
			  Submit Agreement
			{/if}
		  </button>
		</form>
	  </div>
	  
	  <!-- Embed the SLA text as read-only for reference -->
	  <div class="prose prose-invert max-w-none bg-cyber-charcoal p-6 rounded-lg border border-cyber-silver/20">
		<h2 class="text-cyber-neon">SLA Terms (Reference)</h2>
		<div class="text-cyber-silver text-sm leading-relaxed">
		  <!-- Paste the full SLA content here as static text -->
		  <p><strong>1. Purpose of This Agreement</strong><br>This Service Level Agreement (“SLA”) outlines the services, response times, and mutual responsibilities between <strong>SystemShift Technologies</strong> (“Provider”) and the <strong>Client</strong>. The goal is to ensure clear expectations, consistent service, and reliable support for systems migrated to Fedora Linux.</p>
		  <!-- Continue with all sections... (abbreviated for brevity) -->
		  <p><strong>2. Scope of Services</strong><br>SystemShift Technologies provides the following services under this agreement:<br>1. <strong>Linux System Migration</strong> – Full migration...<br><!-- etc. --></p>
		  <!-- Full content would be here -->
		</div>
	  </div>
	</div>
  </div>