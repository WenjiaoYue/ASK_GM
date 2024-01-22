<script lang="ts">
    import TreeNode from './tree-node.svelte';
    type IData = {
        name: string;
        id: string;
        type: string;
        children: never[];
    }
    export let 
        data: IData[] = [], 
        collapse = false, 
        onClick = ''
    
    console.log(data)
</script>

{#if data && data.length > 0}
    {#each data as item}
        <TreeNode 
            bind:node={item} 
            collapse={collapse} 
            onClick={onClick} 
        ></TreeNode>
    {/each}
{:else}
    <p>An error occured during rendering!</p>
{/if}
