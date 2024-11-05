<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LoadingAnimation from "./chat/loadingAnimation.svelte";
	import NewAI from "$lib/assets/Agent/newAI.svelte";


	export let goals: string[] = [];
	export let agentDescripe: string;

	let editIndex: number | null = null; // Record the index currently being edited
	let newContent = ""; // Used to save the new content being input
	export let agentName = "New AI Agent";
	let editContent = "";

	const dispatch = createEventDispatcher();

	function startEdit(index) {
		editIndex = index; // Set the index being edited
		editContent = goals[index]; // Assign the current content to newContent
	}

	function saveEdit(index) {
		goals[index] = editContent; // Update the table content
		editIndex = null; // End editing
	}

	function cancelEdit() {
		editIndex = null; // Cancel editing
		dispatch('cancelCreate');

	}

	function addGoal() {
		if (newContent.trim() && goals.length < 5) {
			goals.push(newContent); // Add the new input content to goals
			newContent = ""; // Clear the input box
		} else {
			alert('超出最大任务数')
		}
	}

	function save() {		
		// Pass the values of goals, agentName, and agentDescripe to the parent component
		dispatch('execute', { goals, agentName, agentDescripe });
	}
</script>

<div class="h-full space-y-2 rounded-2xl bg-white p-6">
	<h2 class="flex gap-4 border-b border-gray-900/10 py-6 text-4xl font-semibold text-gray-900">
		<NewAI />
		创建Agent
	</h2>

	<div class="border-b border-gray-900/10 pb-4">
		<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			<div class="sm:col-span-4">
				<label for="username" class="block text-base font-medium text-gray-900">名称</label>
				<div class="mt-2">
					<div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							bind:value={agentName}
							type="text"
							name="username"
							id="username"
							autocomplete="username"
							class="px-2 block flex-1 border-0 bg-transparent px-4 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
							placeholder="一个新的AI项目..."
						/>
					</div>
				</div>
			</div>

			<div class="col-span-full">
				<label for="about" class="block text-base font-medium text-gray-900">详细描述</label>
				<div class="mt-2">
					<textarea
						bind:value={agentDescripe}
						id="about"
						name="about"
						rows="3"
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="border-b border-gray-900/10 pb-4 w-full">
		<h2 class="text-base/7 font-semibold text-gray-900">输入不超过5个的子任务</h2>

		<div data-style="clean" class="mb-3 gap-3 flex w-full">
			<div class="seva-fields formkit-fields mb-3 flex w-full items-center">
				<div class="formkit-field relative mr-3 flex-grow">
					<input
						bind:value={newContent}
						class="w-full formkit-input block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						placeholder="输入目标..."
						required
						type="text"
					/>
				</div>
				<button type="button" on:click={addGoal} class="formkit-submit">
					<span class="cursor-pointer rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-800">
						添加
					</span>
				</button>
			</div>
		</div>
		
		

		<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table id="dynamicTable" class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">编号</th>
						<th scope="col" class="px-6 py-3">内容</th>
						<th scope="col" class="px-6 py-3"><span class="sr-only">编辑</span></th>
					</tr>
				</thead>
				<tbody>
					{#each goals as data, index}
						<tr>
							<td class="px-6 py-4">{index + 1}</td>
							<td class="px-6 py-4">
								{#if editIndex === index}
									<input
										type="text"
										bind:value={editContent}
										class="rounded border p-1 border-gray-300"
									/>
								{:else}
									{data}
								{/if}
							</td>
							<td class="px-6 py-4">
								{#if editIndex === index}
									<button on:click={() => saveEdit(index)} class="bg-gray-100 px-4 mx-2 py-1 rounded text-green-500 hover:text-green-700">保存</button>
									<button on:click={cancelEdit} class="text-red-500 hover:text-red-700">取消</button>
								{:else}
									<button on:click={() => startEdit(index)} class="text-blue-500 hover:text-blue-700">编辑</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="mt-6 flex items-center justify-end gap-x-6">
		<button type="button" class="text-sm/6 font-semibold text-gray-900">取消</button>
		<button type="button" class="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		on:click={() => save()}

		>创建</button>
	</div>

	{#if goals.length === 0}
		<LoadingAnimation />
	{/if}
</div>