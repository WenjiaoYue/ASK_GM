
<script lang="ts">
    import TreeBranch from "./tree-branch.svelte";

    type IData = {
        name: string;
        id: string;
        type: string;
        children: never[];
    }

    export let 
        collapse = false,
        data: IData[] = [],
        onClick = ''
</script>

{#if data && data.length > 0}
    <ul>
        <TreeBranch 
            data={data} 
            collapse={collapse} 
            onClick={onClick} 
        ></TreeBranch>
    </ul>
{:else}
    <p>An error occured during rendering!</p>
{/if}
