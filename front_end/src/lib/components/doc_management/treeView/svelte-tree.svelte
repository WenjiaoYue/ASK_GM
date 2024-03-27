<script lang="ts">
	import AddNew from "./add-new.svelte";
	import TreeBranch from "./tree-branch.svelte";

	type IData = {
		name: string;
		id: string;
		type: string;
		children: never[];
	};

	export let collapse = false,
		data: IData[] = [],
		onClick = "";
</script>

<div>
	{#if data && data.length > 0}
		<ul>
			<TreeBranch {data} {collapse} {onClick} />
		</ul>
	{:else}
		<p>An error occured during rendering!</p>
	{/if}
</div>
