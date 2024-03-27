<script lang="ts">
	import UploadFiles from "$lib/components/doc_management/uploadFile.svelte";

	import { parentIdx, parentPath } from "../shared/shared.store";

	parentPath.set("");
	parentIdx.set(-1);
</script>

<UploadFiles />
