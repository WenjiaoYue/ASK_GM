<script lang="ts">
	import UploadFilesIcon from "$lib/assets/icons/upload-files.svelte";
	import { getKnowledgeBaseId } from "$lib/modules/doc/network";
	import {
		hintEnd,
		hintStart,
		needRecreate,
		netError,
		parentIdx,
		parentPath,
		storageFiles,
	} from "../shared/shared.store";

	async function handleFilesUpload(e: HTMLInputElement) {
		hintStart.set(true);
		needRecreate.set(true);

		let file = e.target.files;
		console.log("parentPath", $parentPath, $parentIdx);

		let path = [$parentPath + file[0].name];

		const res = await getKnowledgeBaseId(file, path);
		if (res === "Succeed") {
			console.log('succeed');
			
			const newFile = {
				name: file[0].name,
				id: $parentPath + file[0].name,
				type: "File",
				parent: "",
			};

			console.log("storageFiles", typeof $storageFiles, $storageFiles);

			if ($parentIdx === -1) {
				storageFiles.update((files) => [...files, newFile]);
			} else {
				let files = $storageFiles;
				files[$parentIdx].children.push(newFile);
				$storageFiles = files;
			}
			hintStart.set(false);
			hintEnd.set({ status: true, hintContent: "Uploaded Successfully" });
		} else {
			netError.set(true);
			setTimeout(() => {
				netError.set(false);
			}, 3000);
			hintStart.set(false);
			hintEnd.set({ status: true, hintContent: "" });
		}
	}

	function addKnowledgeFiles() {
		document.getElementById("getFile")?.click();
	}
</script>

<input
	on:change={(e) => handleFilesUpload(e)}
	type="file"
	class="hidden"
	id="getFile"
	multiple
/>
<button
	on:click={() => addKnowledgeFiles()}
	id="getFile"
	class="flex items-center gap-2"
>
	<UploadFilesIcon />
	Upload Files
</button>
