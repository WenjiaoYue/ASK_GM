<script lang="ts">
	// @ts-nocheck

	import Knowledge from "$lib/assets/icons/Knowledge.svelte";
	import UploadKnowledge from "$lib/assets/icons/upoadKnowledge.svelte";
	import AdminKnowledge from "$lib/assets/icons/adminKnowledge.svelte";
	import DocCard from "$lib/components/doc_management/docCard.svelte";
	import NoFile from "$lib/assets/icons/no-file.svelte";
	import Folder from "$lib/assets/icons/Folder.svelte";
	import DownloadDirectoryIcon from "$lib/assets/icons/download-directory.svelte";
	import XMarkIcon from "$lib/assets/icons/x-mark-icon.svelte";
	import chatResponse from "$lib/modules/chat/network";
	import {
		fetchKnowledgeBaseIdByPaste,
		fetchDelete,
		fetchAllFile,
	} from "$lib/modules/doc/network";
	import {
		knowledge_base_id,
		storageFiles,
	} from "$lib/components/shared/shared.store";
	import csvIcon from "$lib/assets/icons/csv.svg";
	import {
		Progressbar,
		Modal,
		Label,
		Input,
		Helper,
		Button,
	} from "flowbite-svelte";
	import { Icon } from "flowbite-svelte-icons";

	import { Alert } from "flowbite-svelte";
	import PasteLink from "$lib/components/doc_management/pasteLink.svelte";
	import { onMount } from "svelte";
	import UploadFolder from "$lib/components/doc_management/uploadFolder.svelte";
	import UploadFiles from "$lib/components/doc_management/uploadFile.svelte";

	/**
	 * @type {string | any[]}
	 */
	let newFiles = [];
	let showAlert = false;
	let uploading = false;
	let status = false;
	let hintContent = "";

	$: files = $storageFiles ? $storageFiles : [];

	$: {
		newFiles.length ? (files = [...files, ...newFiles]) : null;
		newFiles = [];
	}

	$: {
		files && files.length && files.length !== $storageFiles.length
			? filterFiles(files)
			: null;
	}

	let uploadProgress = 0;
	let uploadHandle: number;

	onMount(async () => {
		const res = await fetchAllFile();
		console.log("res - 3.27", res);

		if (res) {
			storageFiles.set(res);
			files = $storageFiles;			
		}
		console.log('files', files);

	});

	async function deleteFile() {
		const res = await fetchDelete();
		if (res.status) {
			status = false;
			showAndAutoDismissAlert("Delete Successfully");
		}
	}

	function handleUploadBegin() {
		uploadHandle = setInterval(() => {
			if (uploadProgress < 70) uploadProgress += 5;
			else if (uploadProgress < 90) uploadProgress += 2;
			else if (uploadProgress < 99) uploadProgress += 1;
		}, 500);
	}

	function showAndAutoDismissAlert(hintContent: string) {
		hintContent = hintContent;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 2000);
	}

	function handleUploadEnd() {
		uploadProgress = 0;
		clearInterval(uploadHandle);
	}

	function flattenFiles(files) {
		const flattenedData = [];

		function traverse(item) {
			if (item instanceof File) {
				flattenedData.push(item);
			} else if (item instanceof FileList) {
				for (let i = 0; i < item.length; i++) {
					flattenedData.push(item[i]);
				}
			} else if (item instanceof Object) {
				Object.values(item).forEach((value) => traverse(value));
			}
		}

		Object.values(files).forEach((item) => traverse(item));
		return flattenedData;
	}

	async function filterFiles(files) {
		// localStorage
		storageFiles.set(files);
		let flattenedData = [];
		flattenedData = flattenFiles(files);
		console.log("flattenedData", flattenedData);
		uploading = true;
		handleUploadBegin();

		// back_end
		new Promise(async (resolve) => {
			try {
				const res = await chatResponse.getKnowledgeBaseId(flattenedData);
				if (res == "Succeed") {
					showAndAutoDismissAlert("Uploaded Successfully");
					uploading = false;
					handleUploadEnd();
					status = true;
				}
				resolve();
			} catch (error) {
				console.error("An error occurred:", error);
				resolve();
			}
		}).then(() => {
			console.log("handleUploadEnd");
			handleUploadEnd();
			showAndAutoDismissAlert("Uploaded Successfully");
		});
	}

	function uploadFolder(newDirectory) {
		if (newDirectory && newDirectory.length > 0) {
			const folderName = newDirectory[0].webkitRelativePath.split("/")[0];
			const folderObject = {
				[folderName]: newDirectory,
			};
			files.push(folderObject);
			filterFiles(files);
		}
		console.log("uploadFolder", files);

		return files;
	}
	/**
	 * @type {never[]}
	 */
	let newDirectory = [];
	$: {
		newDirectory ? (files = uploadFolder(newDirectory)) : null;
		newDirectory = [];
	}

	/**
	 * @type {any[]}
	 */
	let showButton = [];

	let Library = [{ content: "Intel ZiZhu Q&A." }];

	function addKnowledgeFiles() {
		document.getElementById("getFile")?.click();
	}

	function addKnowledgeDirectory() {
		document.getElementById("getDirectory")?.click();
	}

	/**
	 * @param {any} name
	 * @param {number} index
	 */
	function removeFile(name, index) {
		files.splice(index, 1);
		files = files;
	}
</script>

<div class="flex flex-col flex-wrap sm:flex-row">
	{#if showAlert}
		<Alert
			color="green"
			class="absolute right-0 z-[30] border-t-4 border-green-600"
			border
		>
			<span class="font-medium">{hintContent}</span>
		</Alert>
	{/if}
	<div class="relative mx-auto mb-12 max-w-screen-xl">
		<div
			class="pricing-box overflow-hiddenshadow mx-auto max-w-lg rounded-lg bg-white lg:flex lg:max-w-none lg:justify-between"
		>
			<div
				class="lg:flex-shrink-1 relative rounded-l-lg bg-white px-6 py-8 lg:p-12"
			>
				{#if uploadProgress}
					<Progressbar
						progress={uploadProgress.toString()}
						size="h-1"
						color="blue"
						divClass="absolute top-0 w-full"
					/>
				{/if}

				<h3
					class="text-2xl font-extrabold leading-8 text-gray-900 sm:text-3xl sm:leading-9"
				>
					Knowledge Base
				</h3>
				<p class="mt-6 text-base leading-6 text-gray-500">
					We can provide customized answers to your questions based on the
					content you have uploaded.
				</p>
				<div class="mt-5 flex flex-row gap-5">
					<input
						bind:files={newFiles}
						type="file"
						style="display:none"
						id="getFile"
						multiple
					/>

					<div
						class="flex cursor-pointer items-center gap-2 rounded p-2 px-2 ring-1 hover:bg-[#f3f4f6]"
					>
						<UploadFiles />
					</div>

					<div
						class="flex cursor-pointer items-center gap-2 rounded p-2 px-2 ring-1 hover:bg-[#f3f4f6]"
					>
						<UploadFolder />
					</div>
					<div
						class="flex cursor-pointer items-center gap-2 rounded p-2 px-2 ring-1 hover:bg-[#f3f4f6]"
					>
						<PasteLink />
					</div>
				</div>

				<div class="mt-8">
					<div class="mt-4 flex items-center">
						<h4
							class="flex-shrink-0 bg-white pr-4 text-sm font-semibold uppercase leading-5 tracking-wider text-blue-600"
						>
							Your Knowledge Base
						</h4>
						<div class="flex-1 border-t-2 border-gray-200" />
					</div>
					<div class="my-4 flex items-center justify-start">
						<!-- {#if status && !uploading} -->
						<!-- upload Knowledge Info -->
						{#if files.length > 0}
							<DocCard {files} />
						{:else}
							<NoFile />
							<p class="mt-2 text-sm opacity-70">No files uploaded</p>
						{/if}
						<!-- {:else if status && uploading}
								<div class="animate-spin">
									<UploadKnowledge />
								</div>
							 -->
					</div>
				</div>
				<div>
					<div class="flex items-center">
						<h4
							class="flex-shrink-0 bg-white pr-4 text-sm font-semibold uppercase leading-5 tracking-wider text-blue-600"
						>
							Knowledge Base Library
						</h4>
						<div class="flex-1 border-t-2 border-gray-200" />
					</div>
					<ul class="lg:col-gap-8 lg:row-gap-5 mt-8 lg:grid lg:grid-cols-2">
						{#each Library as { content }}
							<li class="flex items-center lg:col-span-1">
								<div class="flex-shrink-0">
									<Knowledge />
								</div>
								<p class="ml-3 text-sm leading-5 text-gray-700">
									{content}
								</p>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<p class="my-8 border border-gray-200" />
			<!-- Download csv -->

			<div
				class="flex flex-col justify-center gap-4 rounded-r-lg bg-white px-16 py-8"
			>
				<div class="flex items-center justify-center gap-2">
					<div class="rounded-lg bg-gray-200 py-1">
						<img src={csvIcon} class="h-18 w-18 p-2" alt="" />
					</div>
					<div>
						<p class="p-2 text-center text-lg font-bold text-gray-900">
							Download Feedback Files
						</p>
					</div>
				</div>
				<button on:click={() => chatResponse.downloadfile()} class="mt-3">
					<div
						class="flex cursor-pointer items-center justify-center gap-2 rounded bg-blue-600 p-2 px-2 text-white ring-1 hover:bg-blue-400"
					>
						<DownloadDirectoryIcon />
						Download Files
					</div>
				</button>
			</div>
		</div>
	</div>
</div>
