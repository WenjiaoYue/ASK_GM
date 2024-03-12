<script>
	import { onMount } from "svelte";
	import { open } from "$lib/components/shared/store";
	import { Button, Modal, Label, Input } from "flowbite-svelte";
	import { admin$ } from "$lib/components/shared/shared.store";
	import { userLogin } from "$lib/modules/chat/network";
	import { getNotificationsContext } from "svelte-notifications";

	let formModal = false;
	let email = "";
	let password = "";
	let username = "";

	const { addNotification } = getNotificationsContext();

	onMount(() => {
		if (sessionStorage.getItem("userInfo")) {
			console.log(
				'sessionStorage.getItem("userInfo")',
				sessionStorage.getItem("userInfo")
			);
			let userName = sessionStorage.getItem("userInfo");
			if (userName) {
				admin$.set(userName);
				username = userName;
			}

		}
	});

	const toggle = () => {
		$open = !$open;
	};

	function storeInSession() {
		sessionStorage.setItem("userInfo", username);
	}

	async function setLogin() {
		if (email === "admin" && password === "admin") {
			admin$.set("admin");
			username = "admin";
			storeInSession();
		} else {
			const res = await userLogin(email, password);
			if (res.msg == "Login successful") {
				username = res.user_info.given_name;
				admin$.set(username);
				storeInSession();
			} else {
				addNotification({
					text: "login fail",
					position: "top-right",
					type: "error",
					removeAfter: 1000,
				});
			}
		}
	}

	async function logout() {
		username = "";
		admin$.set("");
		storeInSession();
	}
</script>

<header class="relative z-10 h-16 w-full items-center bg-white shadow md:h-20">
	<div
		class="flex-center relative mx-auto flex h-full flex-col justify-center px-3"
	>
		<div
			class="lg:max-w-68 relative flex w-full items-center pl-1 sm:ml-0 sm:pr-2"
		>
			<div class="relative left-0 flex w-full items-center">
				<div class="group relative flex h-full w-12 items-center">
					<button
						type="button"
						aria-expanded="false"
						aria-label="Toggle sidenav"
						on:click={toggle}
						class="text-4xl text-black focus:outline-none"
					>
						&#8801;
					</button>
				</div>
				<p class="mt-2 text-xl font-bold">Neuralchat User Trial Demo</p>
			</div>

			{#if username}
				<p class="group relative whitespace-nowrap text-lg">
					Hello, <span class="font-semibold">{username}</span>

					<Button
						on:click={logout}
						class="absolute right-0 top-full hidden rounded-lg bg-indigo-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 group-hover:flex"
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
						<p class="pl-1">Logout</p>
					</Button>
				</p>
			{:else}
				<Button
					on:click={() => (formModal = true)}
					class="rounded-lg bg-indigo-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
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
		<h3 class="mb-4 text-xl font-medium text-black">Sign trial demo</h3>
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
			class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
			>Login to your account</Button
		>
		<!-- <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/"
				class="text-indigo-700 hover:underline dark:text-indigo-300"
			>
				Create account
			</a>
		</div> -->
	</form>
</Modal>
