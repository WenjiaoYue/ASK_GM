<script lang="ts">
	import DeleteIcon from "$lib/assets/DocManagement/deleteIcon.svelte";
	import TreeNode from "./tree-node.svelte";
	import { createEventDispatcher } from "svelte";

	let dispatch = createEventDispatcher();
	type IData = {
		name: string;
		id: string;
		type: string;
		children: never[];
	};
	export let data: IData[] = [],
		collapse = false,
		onClick = "";

	export let currentIdx;

	console.log(data);
</script>

{#if data && data.length > 0}
	{#each data as item}
		<TreeNode
			bind:node={item}
			{collapse}
			{onClick}
			{currentIdx}

			on:deleteToTree={(event) => {
                const { node, currentIdx } = event.detail;
                dispatch('deleteToSvelte', { node, currentIdx });
			}}
		/>
	{/each}
{:else}
	<p>Folder is empty. Please upload a file.</p>
{/if}
