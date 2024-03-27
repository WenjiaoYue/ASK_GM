<script lang="ts">
	import PasteLink from "$lib/assets/icons/paste-link.svelte";
	import { fetchKnowledgeBaseIdByPaste } from "$lib/modules/doc/network";
	import { Button, Helper, Input, Label, Modal } from "flowbite-svelte";
	import { storageFiles } from "../shared/shared.store";

	let formModal = false;
	let urlValue = "";

	async function handelPasteURL() {
		// path
		const pasteUrlList = urlValue.split(";").map((url) => url.trim());
		formModal = false;

		const res = await fetchKnowledgeBaseIdByPaste(pasteUrlList);
		console.log("fetchKnowledgeBaseIdByPaste", res);
		// succeed
		if (res.status) {
			//
			storageFiles.set(res);
			// notification
		}
	}
</script>

<button class="flex" on:click={() => (formModal = true)}>
	<PasteLink />
	Paste Link
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<Label class="space-y-2">
		<span>Paste URL</span>
		<Input type="text" name="text" placeholder="URL" bind:value={urlValue} />
		<Helper>Use semicolons (;) to separate multiple URLs.</Helper>
	</Label>

	<Button
		type="submit"
		class="w-full bg-blue-600"
		on:click={() => handelPasteURL()}>Confirm</Button
	>
</Modal>
