<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { open } from '$lib/components/shared/store';
	import Overlay from '$lib/components/shared/overlay.svelte';
	import TopNavigation from '$lib/components/topnavigation/Index.svelte';
	import Notifications from "svelte-notifications";

	const style = {
		container: `bg-gray-100 h-screen overflow-hidden relative`,
		main: `h-screen overflow-auto pb-36 pt-4 px-2 md:pb-8 lg:px-4`,
		mainContainer: `flex flex-col h-screen pl-0 w-full`
	};

	onMount(() => {
		document.getElementsByTagName('body').item(0).removeAttribute('tabindex');
	});

	if (browser) {
		page.subscribe(() => {
			// close side navigation when route changes
			$open = false;
		});
	}
</script>


<Notifications>
<div class={style.container}>
	<div class="flex items-start">
		<Overlay />
		<div class={style.mainContainer}>
			<TopNavigation />
			<main class={style.main}>
				<slot />
			</main>
		</div>
	</div>
</div>

</Notifications>
