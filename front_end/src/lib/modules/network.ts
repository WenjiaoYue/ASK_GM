import { env } from "$env/dynamic/public";
import { SSE } from "sse.js";

const AGENT_URL = env.AGENT_URL;

async function fetchFunc(url: string, init: RequestInit) {
	try {
		const response = await fetch(url, init);
		if (!response.ok) throw response.status;

		return await response.json();
	} catch (error) {
		console.error("network error: ", error);

		return undefined;
	}
}

export async function fectchAgentGoal(query: string) {
	const fectchAgentGoal_URL = AGENT_URL + "/agent/start";
	const data = {
		query: query,
	};

	const init: RequestInit = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};

	return fetchFunc(fectchAgentGoal_URL, init);
}

export async function fetchAgentExecute(query: string) {
	const fetchAgentExecute_URL = AGENT_URL + "/agent/execute";
	const payload = {
		query: query,
	};

	return new SSE(fetchAgentExecute_URL, {
		headers: { "Content-Type": "application/json" },
		payload: JSON.stringify(payload),
	});
}

export async function fetchAgentSummary(query: string, results: any) {
	const fetchAgentSummary_URL = AGENT_URL + "/agent/summarize";
	const payload = {
		goal: query,
		language: "Chinese",
		results: results,
		max_tokens: 128,
		temperature: 0.5,
		repetition_penalty: 1.3,
	};

	return new SSE(fetchAgentSummary_URL, {
		headers: { "Content-Type": "application/json" },
		payload: JSON.stringify(payload),
	});
}
