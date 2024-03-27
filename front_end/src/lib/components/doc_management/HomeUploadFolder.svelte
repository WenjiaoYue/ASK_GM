<script lang="ts">
	import UploadFolder from "$lib/components/doc_management/uploadFolder.svelte";
	import { parentIdx, parentPath } from "../shared/shared.store";

	parentPath.set("");
	parentIdx.set(-1);
</script>

<UploadFolder />
