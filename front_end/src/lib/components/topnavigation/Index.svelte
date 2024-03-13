<script>
	import { onMount } from "svelte";
	import { Button, Modal, Label, Input } from "flowbite-svelte";
	import { admin$ } from "$lib/components/shared/shared.store";
	import Help from "$lib/components/sidenavigation/icons/oldHelp.svelte";
	import Documentation from "$lib/components/documentation/Index.svelte";
	import Question from "$lib/components/sidenavigation/icons/Question.svelte";

	let formModal = false;
	let helpModal = false;

	let email = "";
	let password = "";

	onMount(() => {
		console.log("admin$", $admin$);
	});
	function setLogin() {
		if (email === "admin" && password === "admin") {
			admin$.set("admin");
		} else {
			admin$.set("");
		}
	}
</script>

<header class="relative z-10 h-16 w-full bg-[#00285a]">
	<div
		class="flex-center relative mx-auto flex h-full flex-col justify-center px-3"
	>
		<div
			class="lg:max-w-68 relative flex w-full items-center pl-1 sm:ml-0 sm:pr-2"
		>
			<div class="relative left-0 flex w-full items-center">
				<p class="text-xl font-bold text-white">Intel ASK GM</p>
			</div>
			{#if $admin$ !== "admin"}
				<Button
					on:click={() => (helpModal = true)}
					class="rounded-lg mr-1 px-4 py-2 text-center text-base font-semibold text-white transition duration-200 ease-in hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-200"
				>
					<Question />
					<p class="pl-1">Help</p>
				</Button>

				<Button
					on:click={() => (formModal = true)}
					class="rounded-lg bg-[#0071c5] px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-200"
				>
					<svg
						class="h-6 w-6 p-1 text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 14 18"
					>
						<path
							d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
						/>
					</svg>
					<p class="pl-1">Login</p>
				</Button>
			{/if}
		</div>
	</div>
</header>

<Modal
	bind:open={formModal}
	size="xs"
	autoclose={true}
	class="z-50 w-full p-10"
	outsideclose
>
	<form class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-black">Sign in to Intel ASK GM</h3>
		<Label class="space-y-2">
			<!-- <span class="text-white">Email</span>
			<Input
				class="p-2"
				type="email"
				id="email"
				placeholder="your@email.com"
				required
				bind:value={email}
			/> -->
			<span>Username</span>
			<Input
				class="p-2"
				type="text"
				placeholder="username"
				required
				bind:value={email}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input
				class="p-2"
				type="password"
				id="password"
				placeholder="•••••"
				required
				bind:value={password}
			/>
		</Label>
		<Button
			on:click={() => setLogin()}
			type="submit"
			class="w-full rounded-lg bg-sky-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-200"
			>Login to your account</Button
		>
		<!-- <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/"
				class="text-sky-700 hover:underline dark:text-sky-300"
			>
				Create account
			</a>
		</div> -->
	</form>
</Modal>

<Modal bind:open={helpModal} size="xl" autoclose={true} outsideclose>
	<Documentation />
</Modal>
