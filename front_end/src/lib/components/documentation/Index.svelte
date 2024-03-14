<script>
	let includeList = [
		{ content: "Related Question Guidance." },
		{ content: "Question and Answer History." },
		{ content: "Introduction to Hot Topics." },
		{ content: "Real-time question and answer dialogue." },
	];

	let notIncludeList = [{ content: "Multi-modal Q&A." }];

	import { createEventDispatcher } from "svelte";

	let dispatch = createEventDispatcher();
</script>

<div
	class="pricing-box mx-auto max-w-lg overflow-hidden rounded-lg lg:flex lg:max-w-none"
>
	<div class="lg:flex-shrink-1 bg-white px-6 py-8 lg:p-12">
		<h3
			class="text-2xl font-extrabold leading-8 text-gray-900 sm:text-3xl sm:leading-9"
		>
			You Ask We Answer
		</h3>
		<p class="mt-6 text-base leading-6 text-gray-500">
			Pose your questions, and we will provide answers. Once a month, let's work
			together to build a better Intel home.
		</p>
		<div class="mt-8">
			<div class="flex items-center">
				<h4
					class="flex-shrink-0 bg-white pr-4 text-sm font-semibold uppercase leading-5 tracking-wider text-sky-600"
				>
					What&#x27;s included
				</h4>
				<div class="flex-1 border-t-2 border-gray-200" />
			</div>
			<ul class="lg:col-gap-8 lg:row-gap-5 mt-8 lg:grid lg:grid-cols-2">
				{#each includeList as { content }}
					<li class="flex items-start lg:col-span-1">
						<div class="flex-shrink-0">
							<svg
								class="mr-2 h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								width="6"
								height="6"
								stroke="currentColor"
								fill="#10b981"
								viewBox="0 0 1792 1792"
							>
								<path
									d="M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
								/>
							</svg>
						</div>
						<p class="ml-3 text-sm leading-5 text-gray-700">
							{content}
						</p>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-8">
			<div class="flex items-center">
				<h4
					class="flex-shrink-0 bg-white pr-4 text-sm font-semibold uppercase leading-5 tracking-wider text-sky-600"
				>
					Upcoming Features
				</h4>
				<div class="flex-1 border-t-2 border-gray-200" />
			</div>
			<ul class="lg:col-gap-8 lg:row-gap-5 mt-8 lg:grid lg:grid-cols-2">
				{#each notIncludeList as { content }}
					<li class="flex items-start lg:col-span-1">
						<div class="flex-shrink-0">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="6"
								height="6"
								class="mr-2 h-6 w-6"
								fill="red"
								viewBox="0 0 1792 1792"
							>
								<path
									d="M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
								/>
							</svg>
						</div>
						<p class="ml-3 text-sm leading-5 text-gray-700">
							{content}
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div
		class="bg-white px-6 py-8 text-center lg:flex lg:flex-shrink-0 lg:flex-col lg:justify-center lg:p-12"
	>
		<p class="text-lg font-bold leading-6 text-gray-900">Send to</p>
		<div
			class="mt-4 flex items-center justify-center text-3xl font-extrabold leading-none text-gray-900"
		>
			<span>ask.gm.zizhu@intel.com</span>
		</div>
		<p class="mt-4 text-sm leading-5">
			<span class=" inline-block font-medium text-gray-500">
				Your questions will be answered in our monthly newsletter.
			</span>
		</p>
		<div class="mt-6">
			<div class="rounded-md shadow">
				<button
					type="button"
					on:click={() => {
						dispatch("linkToASKIntel");
					}}
					class="w-full rounded-lg bg-sky-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-200"
				>
					More Information
				</button>
			</div>
		</div>
	</div>
</div>
