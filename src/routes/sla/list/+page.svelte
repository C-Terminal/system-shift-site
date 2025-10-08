<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    const { rows } = data;
    let showImages: Record<number, boolean> = {};
  </script>
  
  <h1 class="text-2xl font-bold mb-4">Saved SLAs</h1>
  
  {#if rows.length === 0}
    <p>No SLAs found.</p>
  {:else}
    <div class="overflow-x-auto rounded-lg border border-slate-700">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800/50">
          <tr>
            <th class="px-3 py-2 text-left">ID</th>
            <th class="px-3 py-2 text-left">Client</th>
            <th class="px-3 py-2 text-left">Effective Date</th>
            <th class="px-3 py-2 text-left">Created</th>
            <th class="px-3 py-2 text-left">Signatures</th>
          </tr>
        </thead>
        <tbody>
          {#each rows as r (r.id)}
            <tr class="border-t border-slate-700/50">
              <td class="px-3 py-2">{r.id}</td>
              <td class="px-3 py-2">{r.clientName}</td>
              <td class="px-3 py-2">{r.effectiveDate}</td>
              <td class="px-3 py-2">{r.createdAt && new Date(r.createdAt).toLocaleString()}</td>
              <td class="px-3 py-2">
                <button class="btn btn-xs btn-outline"
                  on:click={() => (showImages[r.id] = !showImages[r.id])}>
                  {showImages[r.id] ? 'Hide' : 'Show'} images
                </button>
  
                {#if showImages[r.id]}
                  <div class="mt-2 flex gap-4">
                    <div>
                      <div class="text-xs opacity-70 mb-1">Client Signature</div>
                      <img src={r.clientSignature} alt="client signature" class="h-24 max-w-xs rounded border border-slate-700" />
                    </div>
                    <div>
                      <div class="text-xs opacity-70 mb-1">Provider Signature</div>
                      <img src={r.providerSignature} alt="provider signature" class="h-24 max-w-xs rounded border border-slate-700" />
                    </div>
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  