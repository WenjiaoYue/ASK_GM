<script lang="ts">
	import { storageFiles } from "$lib/components/shared/shared.store";
	import TreeBranch from "./tree-branch.svelte";
	import { createEventDispatcher } from "svelte";

	let dispatch = createEventDispatcher();
	type IData = {
		name: string;
		id: string;
		type: string;
		children: never[];
	};

	export let currentIdx;

	export let collapse = false,
		data: IData[] = [],
		onClick = "";

	
	
</script>

<div>
	{#if data && data.length > 0}
		<ul>
			<TreeBranch {data} {collapse} {onClick} {currentIdx}
			
			/>
			<!-- on:deleteToSvelte={(event) => {
                const { node, currentIdx } = event.detail;
                dispatch('deleteToSvelteCard', { node, currentIdx });
			}} -->
		</ul>
	{:else}
		<p>Folder is empty. Please upload a file.</p>
	{/if}
</div>
