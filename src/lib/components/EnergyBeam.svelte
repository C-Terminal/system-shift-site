<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    export let isBeamAnimating: boolean = false;
    export let orbSize: 'sm' | 'md' | 'lg' = 'md';
    export let duration: number = 1500;

    const orbSizes = {
        sm: { container: 'w-48 h-48', orb: 'w-12 h-12' },
        md: { container: 'w-64 h-64 sm:w-80 sm:h-80', orb: 'w-16 h-16 sm:w-20 sm:h-20' },
        lg: { container: 'w-80 h-80 sm:w-96 sm:h-96', orb: 'w-20 h-20 sm:w-24 sm:h-24' }
    };

    $: sizes = orbSizes[orbSize] || orbSizes.md;
</script>

<div class="relative {sizes.container}">
    <!-- Central Orb -->
    <div class="absolute  inset-0 flex items-center justify-center">
        <div class="{sizes.orb} bg-cyber-neon rounded-full shadow-lg shadow-cyber-neon/50 animate-pulse"></div>
    </div>
    
    <!-- Energy Beams - Multiple rotating beams -->
    {#if isBeamAnimating}
        <div class="absolute inset-0 flex items-center justify-center">
            {#each Array(8) as _, i}
                <div 
                    class="beam-line" 
                    style="--rotation: {i * 45}deg; --delay: {i * 0.1}s; --duration: {duration}ms;"
                    in:fade={{ duration: 200, delay: i * 100 }}
                ></div>
            {/each}
        </div>
        
        <!-- Circular energy rings expanding outward -->
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="energy-ring ring-1" style="--duration: {duration}ms;"></div>
            <div class="energy-ring ring-2" style="--duration: {duration}ms;"></div>
            <div class="energy-ring ring-3" style="--duration: {duration}ms;"></div>
        </div>
    {/if}
</div>

<style>
    .beam-line {
        position: absolute;
        width: 4px;
        height: 50%;
        background: linear-gradient(to bottom, 
            var(--color-cyber-neon) 0%, 
            var(--color-cyber-electric) 50%,
            transparent 100%
        );
        transform-origin: center center;
        transform: rotate(var(--rotation));
        top: 50%;
        left: 50%;
        margin-left: -2px;
        margin-top: 0;
        animation: beam-shoot var(--duration) ease-out forwards;
        animation-delay: var(--delay);
        opacity: 0;
        box-shadow: 0 0 10px var(--color-cyber-neon);
    }

    @keyframes beam-shoot {
        0% {
            height: 0%;
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            height: 100%;
            opacity: 0;
        }
    }

    .energy-ring {
        position: absolute;
        border-radius: 50%;
        border: 2px solid var(--color-cyber-neon);
        animation: ring-expand var(--duration) ease-out forwards;
        opacity: 0;
    }

    .ring-1 {
        width: 40px;
        height: 40px;
        animation-delay: 0s;
    }

    .ring-2 {
        width: 40px;
        height: 40px;
        animation-delay: 0.3s;
    }

    .ring-3 {
        width: 40px;
        height: 40px;
        animation-delay: 0.6s;
    }

    @keyframes ring-expand {
        0% {
            width: 40px;
            height: 40px;
            opacity: 1;
            border-width: 3px;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
            border-width: 1px;
        }
    }

    @media (min-width: 640px) {
        @keyframes ring-expand {
            0% {
                width: 40px;
                height: 40px;
                opacity: 1;
                border-width: 3px;
            }
            100% {
                width: 400px;
                height: 400px;
                opacity: 0;
                border-width: 1px;
            }
        }
    }
</style>