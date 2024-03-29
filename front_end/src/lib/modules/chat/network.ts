import { chatServer } from "$lib/modules/chat/chat-server";
import { SSE } from "sse.js";
import { env } from "$env/dynamic/public";
import { knowledge_base_id } from "$lib/components/shared/shared.store";
import { language_map } from "$lib/common/constant";
import sjcl from "sjcl";

const secretKey = "ASK_GM_PASSWORD";

const KNOWLEDGE_URL = env.KNOWLEDGE_URL;
const TRANSLATE_URL = env.TRANSLATE_URL;
const DETECT_URL = env.DETECT_URL;
const DOWNLOAD_FEEDBACK_URL = env.DOWNLOAD_FEEDBACK_URL;
const LOGIN_URL = env.LOGIN_URL;

function regFunc(currentMsg) {
	let text = currentMsg.slice(2, -1);
	const regex = /.*Assistant:((?:(?!",).)*)",/;
	const match = text.match(regex);
	let content = match ? match[1].trim() : "";
	content = content
		.replace(/\\\\n/g, "")
		.replace(/\\n/g, "")
		.replace(/\n/g, "")
		.replace(/\\'/g, "'");

	return content;
}

async function translatedQuery(knowledgeContent: string) {
	const detectLang = await detectFunc(knowledgeContent);
	let sourceLanguage = "";
	let translateResult = "";
	let queryMessage = knowledgeContent;
	console.log(detectLang);

	if (detectLang) {
		sourceLanguage = detectLang.data.detections[0][0].language;
	}

	if (sourceLanguage === "zh-CN") {
		translateResult = await translateFunc(knowledgeContent, "en");
		queryMessage = translateResult.data.translations[0].translatedText;
	}

	return queryMessage;
}

function chatMessage(
	chatMessages: ChatMessage[],
	type: any,
	blob?: any,
	filename?: any,
	question?: string
): SSE {
	// chatMessage
	const initWord =
		"A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human questions.\n";
	let result = chatMessages.reduce((prev, cur) => {
		return prev + `${cur.role}: ${cur.content}\n`;
	}, initWord);
	result += "Assistant:";
	console.log("chatMessage");

	const linkDict: { [key: string]: string } = {
		knowledge: KNOWLEDGE_URL + "/chat",
	};

	const msgDataDict: { [key: string]: any } = {
		knowledge: {
			query: question,
			knowledge_base_id: "default",
			stream: true,
			max_new_tokens: 128,
			return_link: true,
		},
	};

	// request
	const eventSource = new SSE(linkDict[type.model], {
		headers: { "Content-Type": "application/json" },
		payload: JSON.stringify(msgDataDict[type.model]),
	});

	return eventSource;
}

function chatGPT(msgs: ChatMessage[], api_key: string): SSE {
	return new SSE("https://api.openai.com/v1/chat/completions", {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + api_key,
		},
		payload: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: msgs,
			stream: true,
		}),
	});
}

function userLogin(username, password) {
	const encryptedPassword = sjcl.encrypt(secretKey, password);
	console.log("encryptedPassword", encryptedPassword);

	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ account: username, password: encryptedPassword }),
	};

	return fetchFunc(LOGIN_URL, init);
}

function translateFunc(msg: string) {
	// let translateObject = {
	// 	key: "AIzaSyD4m9izGcZnv55l27ZvlymdmNsGK7ri_Gg",
	// 	q: msg,
	// 	target: target,
	// };

	const translateObject = {
		content: msg,
	};
	const init: RequestInit = {
		method: "POST",
		body: JSON.stringify(translateObject),
	};

	return fetchFunc(TRANSLATE_URL, init);
}
async function detectFunc(msg: string) {
	let translateObject = {
		key: "AIzaSyD4m9izGcZnv55l27ZvlymdmNsGK7ri_Gg",
		q: msg,
	};
	const init: RequestInit = {
		method: "POST",
		body: JSON.stringify(translateObject),
	};

	return await fetchFunc(DETECT_URL, init);
}

async function fetchFunc(url, init) {
	try {
		let response = await fetch(url, init);
		if (!response.ok) throw response.status;

		return await response.json();
	} catch (error) {
		console.error("network error: ", error);

		return undefined;
	}
}

async function getKnowledgeBaseId(files) {
	
	const UploadKnowledge_URL = KNOWLEDGE_URL + "/append";
	const formData = new FormData();

	for (const file of files) {
		formData.append("files", file);
	}

	formData.append("knowledge_base_id", "default");

	const init: RequestInit = {
		method: "POST",
		body: formData,
	};

	return fetchFunc(UploadKnowledge_URL, init);
}

async function downloadfile() {
	const res = await fetch(DOWNLOAD_FEEDBACK_URL, {
		method: "GET",
	});

	const blob = await res.blob();
	const url = window.URL || window.webkitURL;
	const link = url.createObjectURL(blob);
	const a = document.createElement("a");
	// a.setAttribute("download", `test.csv`);
	a.setAttribute("href", link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export default {
	modelList: chatServer.modelList,
	chatMessage,
	chatGPT,
	regFunc,
	translateFunc,
	detectFunc,
	getKnowledgeBaseId,
	translatedQuery,
	downloadfile,
};

export { userLogin };
