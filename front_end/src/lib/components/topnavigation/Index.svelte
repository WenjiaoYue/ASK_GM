<script>
	import { onMount } from "svelte";
	import { open } from "$lib/components/shared/store";
	import {
		Button,
		Modal,
		Label,
		Input,
		Dropdown,
		DropdownItem,
		Avatar,
		DropdownDivider,
	} from "flowbite-svelte";
	import { admin$ } from "$lib/components/shared/shared.store";
	import { userLogin } from "$lib/modules/chat/network";
	import { getNotificationsContext } from "svelte-notifications";
	import { Icon } from "flowbite-svelte-icons";
	import Documentation from "$lib/components/documentation/Index.svelte";
	import Question from "$lib/assets/icons/Question.svelte";
	import { goto } from "$app/navigation";

	let formModal = false;
	let deleteModal = false;
	let helpModal = false;
	let email = "";
	let password = "";
	let username = "";
	let userInfo = {};
	let address = "";

	const { addNotification } = getNotificationsContext();

	function isEmptyObject(obj) {
		return Object.keys(obj).length === 0;
	}

	function handleLinkTo() {
		window.open('https://askintel.intel.com/', '_blank');
	}

	onMount(() => {
		console.log('getItem("userInfo")', sessionStorage.getItem("userInfo"));

		if (sessionStorage.getItem("userInfo")) {
			let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

			console.log("userInfo", userInfo);

			if (!isEmptyObject(userInfo)) {
				username = userInfo.given_name;
				address = userInfo.email_address;
				admin$.set(username);
			} else {
				address = "";
			}
		} else {
			formModal = true;
		}
	});

	const toggle = () => {
		$open = !$open;
	};

	function storeInSession() {
		sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
	}

	async function setLogin() {
		if (email === "admin" && password === "admin") {
			admin$.set("admin");
			username = "admin";
			userInfo = {
				given_name: "admin",
				email_address: "admin",
			};
			storeInSession();
			formModal = false;
		} else {
			const res = await userLogin(email, password);

			if (res.msg == "Login successful") {
				addNotification({
					text: "login succeed",
					position: "top-right",
					type: "succeed",
					removeAfter: 1000,
				});
				username = res.user_info.given_name;
				address = res.user_info.email_address;
				userInfo = res.user_info;
				console.log("userInfo", userInfo);
				formModal = false;
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
		sessionStorage.removeItem("userInfo");
		formModal = true;
		goto("/");
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
				<p class="mt-2 text-xl font-bold text-white">
					<a href="/">Intel ASK GM</a></p>
			</div>
			<Button
				on:click={() => (helpModal = true)}
				class="mr-1  px-4 py-2 text-center text-base font-semibold text-white transition duration-200 ease-in hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-200"
			>
				<Question />
				<p class="pl-1">Help</p>
			</Button>
			{#if username}
				<!-- logout and login info -->
				<Button pill color="light" id="avatar_with_name" class="px-4 py-0">
					<Avatar src="/src/lib/assets/images/person.svg" class="me-2" />
					{username}
				</Button>
				<Dropdown inline triggeredBy="#avatar_with_name" class="w-50">
					{#if username !== "admin"}
						<div class="px-4 py-2">
							<span class="block text-sm text-gray-900"
								>{username}</span
							>
							<span class="block truncate text-sm font-medium">{address}</span>
						</div>
					{:else}
						<DropdownItem href="/">Index</DropdownItem>
						<DropdownDivider />
						<DropdownItem href="/knowledge">Database Management</DropdownItem>
					{/if}
					<DropdownItem slot="footer" on:click={() => (deleteModal = true)}
						>Sign out</DropdownItem
					>
				</Dropdown>
			{:else}
				<Button
					on:click={() => (formModal = true)}
					class="bg-[#00469f] px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
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

{#if formModal}
	<div
		id="popup-modal"
		tabindex="-1"
		class="fixed left-0 right-0 top-0 z-50 flex h-screen items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-30"
	>
		<div class="relative max-h-full w-full max-w-md p-4">
			<div class="relative rounded-lg bg-white shadow">
				<form class="flex flex-col space-y-6 p-10" action="#">
					<h3 class="mb-4 text-xl font-medium text-black">
						Sign in to Intel ASK GM
					</h3>
					<Label class="space-y-2">
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
						class="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
						>Login to your account</Button
					>
				</form>
			</div>
		</div>
	</div>
{/if}

<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<Icon
			name="exclamation-circle-outline"
			class="mx-auto mb-4 h-12 w-12 text-gray-400"
		/>
		<h3 class="mb-5 text-lg font-normal text-gray-500">
			Confirm Sign Out?
		</h3>
		<Button
			color="red"
			class="mr-2"
			on:click={() => {
				logout();
			}}>Yes, I'm sure</Button
		>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>

<Modal bind:open={helpModal} size="xl" autoclose={true} outsideclose>
	<Documentation on:linkToASKIntel={() => handleLinkTo()}/>
</Modal>
