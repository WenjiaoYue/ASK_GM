import { env } from "$env/dynamic/public";

const KNOWLEDGE_URL = env.KNOWLEDGE_URL;

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
