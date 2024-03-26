<script lang="ts">
	import UploadFilesIcon from "$lib/assets/icons/upload-files.svelte";
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

<!-- <button
						on:click={() => addKnowledgeFiles()}
						id="getFile"
						class="mt-6"
					> -->
<button
	class="flex"
    on:click={() => (formModal = true)}
>
<UploadFilesIcon />
Upload Files
</button>


