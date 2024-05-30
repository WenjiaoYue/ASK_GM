<!--
  Copyright (c) 2024 Intel Corporation
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<script lang="ts">
	export let data;
	import { knowledge1, latencyWritable } from "$lib/shared/stores/common/Store";
	import { onMount } from "svelte";
	import {
		LOCAL_STORAGE_KEY,
		MessageRole,
		MessageType,
		type Message,
	} from "$lib/shared/constant/Interface";
	import {
		getCurrentTimeStamp,
		scrollToBottom,
		scrollToTop,
	} from "$lib/shared/Utils";
	import { fetchTextStream } from "$lib/network/chat/Network";
	import LoadingAnimation from "$lib/shared/components/loading/Loading.svelte";
	import "driver.js/dist/driver.css";
	import "$lib/assets/layout/css/driver.css";
	import PaperAirplane from "$lib/assets/chat/svelte/PaperAirplane.svelte";
	import Clear from "$lib/assets/chat/svelte/ChatBot_Latency_Clear_button.svg";
	import Scrollbar from "$lib/shared/components/scrollbar/Scrollbar.svelte";
	import ChatMessage from "$lib/modules/chat/ChatMessage.svelte";
	import Output from "$lib/modules/chat/Output.svelte";
	import LantencyHint from "$lib/modules/lantencyHint/LantencyHint.svelte";
	import { Circle3, Jumper, RingLoader } from "svelte-loading-spinners";
	import { navigating } from "$app/stores";
	import tr from "date-fns/locale/tr";
	import { ini } from "svelte-highlight/languages/index.js";

	let code_output: string = "";
	let ut_output: string = "";
	let doc_output: string = "";
	let comments_output: string = "";
	let ut_languages: string = "";
	let code_languages: string = "";
	let init: boolean = true;

	let test_code = `import unittest

class TestAddNumbersFunction(unittest.TestCase):

    def test_add_numbers_positive(self):
        self.assertEqual(add_numbers(1, 2), 3)
        self.assertEqual(add_numbers(10, 20), 30)
        self.assertEqual(add_numbers(50, 100), 150)

    def test_add_numbers_negative(self):
        self.assertEqual(add_numbers(-1, 2), 1)
        self.assertEqual(add_numbers(-10, 20), 10)
        self.assertEqual(add_numbers(-50, 100), 50)

    def test_add_numbers_zero(self):
        self.assertEqual(add_numbers(0, 0), 0)
        self.assertEqual(add_numbers(0, 10), 10)
        self.assertEqual(add_numbers(10, 0), 10)

if __name__ == '__main__':
    unittest.main()`;

	let test_markdown =
		"**Function Documentation: `add_numbers`**<br />=====================================<br /><br />**Summary**<br />-----------<br /><br />The `add_numbers` function takes two numerical arguments, `a` and `b`, and returns their sum.<br /><br />**Function Signature**<br />---------------------<br /><br />`def add_numbers(a, b):`<br /><br />**Parameters**<br />--------------<br /><br />* `a`: The first numerical value to be added.<br />* `b`: The second numerical value to be added.<br /><br />**Return Value**<br />----------------<br /><br />The sum of `a` and `b`.<br /><br />**";

	let query: string = "";
	let loading: boolean = false;
	let scrollToDiv: HTMLDivElement;

	onMount(async () => {
		scrollToDiv = document
			.querySelector(".chat-scrollbar")
			?.querySelector(".svlr-viewport")!;
	});

	function handleTop() {
		console.log("top");

		scrollToTop(scrollToDiv);
	}

	function extractContent(data) {
		if (data.startsWith("b'") || data.startsWith('b"')) {
			data = data.slice(2);
		}
		if (data.endsWith("'") || data.endsWith('"')) {
			data = data.slice(0, -1);
		}

		if (data.includes("\\n")) {
			if (data === "\\n") {
				data = "";
			} else {
				data = data.replace(/\\n/g, "<br />");
			}
		}
		return data;
	}

	function initOutput() {
		doc_output = "";
		comments_output = "";
		ut_output = "";
		code_output = "";
	}
	const callTextStream = async (query: string) => {
		loading = true;
		initOutput();
		const eventSource = await fetchTextStream(query);
		console.log("eventSource", eventSource);

		eventSource.addEventListener("message", (e: any) => {
			let response = extractContent(e.data);

			console.log("response", response);

			if (response == "[DONE]") {
				loading = false;
			} else {
				let language = "";
				let content = "";

				// const pattern = /```<br\s*\/>(.*?)```/s;
				// const pattern = /```(\w+)<br\s*\/>(.*?)```/s;
				// const match = response.match(pattern);
				// if (match) {
				// 	language = match[1];

				// }
				content = response.replace(/<br\s*\/>/g, "\n");

				if (code_output === "") {
					code_output = content;
					code_languages = language;
					init = false;

					console.log("code_output", code_output);
				} else if (ut_output === "") {
					ut_output = content;
					ut_languages = language;
					console.log("ut_output", ut_output);
				} else if (doc_output === "") {
					doc_output = content;
				}
			}
		});
		eventSource.stream();
	};

	const handleTextSubmit = async () => {
		await callTextStream(query);

		scrollToBottom(scrollToDiv);
	};
</script>

<div class="font-intel-light flex grow flex-col text-white {code_output === '' ? 'mt-20' : ''}">
	<div class="relative h-full items-center gap-5 bg-fixed sm:flex">
		<div
			class="relative mx-auto flex h-full w-full flex-col items-center sm:mt-0 sm:w-[80%]"
		>
			<div
				class="fixed relative flex h-full w-full flex-col items-center justify-center px-2"
			>
			<span class="my-8 text-4xl uppercase">Computex Agent</span>

				<div
					class="relative my-2 flex w-full flex-row justify-center sm:w-[70%]"
				>
					<div class="relative w-full focus:border-none">
						<input
							class="text-md block w-full rounded-md border-2 border-gray-800 bg-black px-6 py-4
							text-white opacity-30 focus:border-gray-300 focus:ring-0"
							type="text"
							placeholder="Enter prompt here"
							disabled={loading}
							maxlength="1200"
							bind:value={query}
							on:keydown={(event) => {
								if (event.key === "Enter" && !event.shiftKey && query) {
									event.preventDefault();
									handleTextSubmit();
								}
							}}
						/>
						<button
							on:click={() => {
								if (query) {
									handleTextSubmit();
								}
							}}
							type="submit"
							class="absolute bottom-2.5 end-2.5 bg-[#003EC7] px-10 py-2 text-sm font-medium uppercase text-white"
							>Generate</button
						>
					</div>
				</div>
			</div>

			<div class="flex h-full w-full flex-col items-center mb-4">
				<div class="grid grid-cols-4 items-center gap-4 text-center">
					{#if code_output  !== ""}
						<Output
							label="WRITE CODE"
							output={code_output}
							languages={code_languages}
						/>
					{/if}
					{#if ut_output !== ""}
						<Output
							label="write test"
							output={ut_output}
							languages={ut_languages}
						/>
					{/if}

					{#if doc_output !== ""}
						<Output
							label="comments/ document"
							output={doc_output}
							hint="markdown"
						/>
					{/if}

					{#if comments_output !== ""}
						<Output label="review/provide comments" output={comments_output} />
					{/if}

					{#if loading && !init}
						<RingLoader size="6" color="#00c7fd" unit="rem" duration="1s" />
					{/if}
				</div>
				{#if loading && init}
					<RingLoader size="6" color="#00c7fd" unit="rem" duration="1s" />
				{/if}
			</div>
		</div>

	</div>
</div>
