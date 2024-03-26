<script lang="ts">
	import UploadDirectoryIcon from "$lib/assets/icons/upload-directory.svelte";
	import { Button, Helper, Input, Label, Modal } from "flowbite-svelte";

	let formModal = false;
	let urlValue = "";

	async function handelPasteURL() {
		// const pasteUrlList = urlValue.split(";").map((url) => url.trim());
		// uploading = true;
		// formModal = false;
		// handleUploadBegin();
		// const res = await fetchKnowledgeBaseIdByPaste(pasteUrlList);
		// console.log("res", res);
		// // succeed
		// if (res.status) {
		// 	showAndAutoDismissAlert("Uploaded Successfully");
		// 	uploading = false;
		// 	handleUploadEnd();
		// 	status = true;
		// }
	}
</script>

<!-- bind:files={newDirectory}
	type="file"
	id="getDirectory"
	directory
	multiple
	class="hidden" -->
<!-- <input /> -->
<!-- on:click={() => addKnowledgeDirectory()} -->
<button class="flex" >
	<UploadDirectoryIcon />
	Upload Folder
</button>
