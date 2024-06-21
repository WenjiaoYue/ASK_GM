import { SSE } from "sse.js";
import { env } from "$env/dynamic/public";
import sjcl from "sjcl";

const secretKey = "ASK_GM_PASSWORD";

const KNOWLEDGE_URL = env.KNOWLEDGE_URL;
const TRANSLATE_URL = env.TRANSLATE_URL;
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
			max_new_tokens: 1024,
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

function userLogin(username, password) {
	const encryptedPassword = sjcl.encrypt(secretKey, password);
	console.log("encryptedPassword", encryptedPassword);

	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ account: username, password: encryptedPassword }),
	};

	// return {msg: "Login successful", user_info: {
	// 	given_name: 1
	// }}
	return fetchFunc(LOGIN_URL, init);
}

async function translateFunc(msg: string) {
	console.log('msg', msg);

	if (msg === "Opps, it looks like your question just went on a broader ride beyond the ASK GM ranch where we only focus on Intel Zizhu site questions. Please refine your question, or change to another.") {
		return { tranlated_content: "问题超纲了哦，请理解ASK GM 小助手的业务范围是仅限于紫竹site的运营，请换个问题吧！" };
	}

	if (msg.includes("Great curiosity! While we're scratching our heads for an answer, you could shoot your question over to ASKGM.zizhu.@intel.com? They've got the magic inbox to help you out!")) {
		return { tranlated_content: "这是个好问题，但是目前ASK GM 小助手没有针对该问题的库存哦，请您手动发送邮件到ASKGM.zizhu.@intel.com 去寻求解答吧！" };
	}

	if (msg === "问题超纲了哦，请理解ASK GM 小助手的业务范围是仅限于紫竹site的运营，请换个问题吧！") {
		return { tranlated_content: "Opps, it looks like your question just went on a broader ride beyond the ASK GM ranch where we only focus on Intel Zizhu site questions. Please refine your question, or change to another." };
	}

	if (msg === "这是个好问题，但是目前ASK GM 小助手没有针对该问题的库存哦，请您手动发送邮件到ASKGM.zizhu.@intel.com 去寻求解答吧！") {
		return { tranlated_content: "Great curiosity! While we're scratching our heads for an answer, you could shoot your question over to ASKGM.zizhu.@intel.com? They've got the magic inbox to help you out!" };
	}		

	const translateObject = {
		content: msg,
	};
	const init: RequestInit = {
		method: "POST",
		body: JSON.stringify(translateObject),
		headers: {
			'Content-Type': 'application/json'
		}
	};

	return await fetchFunc(TRANSLATE_URL, init);
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
	chatMessage,
	regFunc,
	translateFunc,
	downloadfile,
};

export { userLogin };
