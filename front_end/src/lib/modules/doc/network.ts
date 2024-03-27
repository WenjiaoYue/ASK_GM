import { env } from "$env/dynamic/public";

const KNOWLEDGE_URL = env.KNOWLEDGE_URL;

async function fetchFunc(url, init) {
	try {
		const response = await fetch(url, init);
		if (!response.ok) throw response.status;

		return await response.json();
	} catch (error) {
		console.error("network error: ", error);

		return undefined;
	}
}

export async function deleteAll() {
	const UploadKnowledge_URL = KNOWLEDGE_URL + "/delete_all";

	const init: RequestInit = {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	};

	return fetchFunc(UploadKnowledge_URL, init);
}


export async function fetchReCreateKB() {
	const UploadKnowledge_URL = KNOWLEDGE_URL + "/recreate_kb";
	const data = {
		"knowledge_base_id": "default"
	};

	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};

	return fetchFunc(UploadKnowledge_URL, init);
}


export async function deleteFiles(path) {
	const UploadKnowledge_URL = KNOWLEDGE_URL + "/delete_file";

	const data = {
		del_path: path,
		knowledge_base_id: "default",
	};

	const init: RequestInit = {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};

	return fetchFunc(UploadKnowledge_URL, init);
}

export async function getKnowledgeBaseId(files, pathList) {
	console.log("getKnowledgeBaseId", pathList);

	const UploadKnowledge_URL = KNOWLEDGE_URL + "/upload_files";
	const formData = new FormData();
	for (const file of files) {
		formData.append("files", file);
	}

	for (const path of pathList) {
		console.log("path", path);
		formData.append("file_paths", path);
	}

	formData.append("knowledge_base_id", "default");

	const init: RequestInit = {
		method: "POST",
		body: formData,
	};

	return fetchFunc(UploadKnowledge_URL, init);
}

export async function fetchKnowledgeBaseIdByPaste(pasteUrlList: any) {
	const url = `${KNOWLEDGE_URL}/upload_link`;
	const data = {
		link_list: pasteUrlList,
		knowledge_base_id: "default",
	};
	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};

	try {
		const response = await fetch(url, init);
		if (!response.ok) throw response.status;
		return await response.json();
	} catch (error) {
		console.error("network error: ", error);
		return undefined;
	}
}

export async function fetchDelete() {
	const url = `${KNOWLEDGE_URL}/delete_all`;
	const init: RequestInit = {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	};

	try {
		const response = await fetch(url, init);
		if (!response.ok) throw response.status;
		return await response.json();
	} catch (error) {
		console.error("network error: ", error);
		return undefined;
	}
}

export async function fetchAllFile() {
	const data = {
		knowledge_base_id: "default",
	};
	const url = `${KNOWLEDGE_URL}/get_file_structure`;
	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};

	try {
		const response = await fetch(url, init);
		if (!response.ok) throw response.status;
		return await response.json();
	} catch (error) {
		console.error("network error: ", error);
		return undefined;
	}
}
