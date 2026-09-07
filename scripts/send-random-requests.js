
//----------------------------------------------------------------------------------------//
//                                                                                        //
// SUPER MEGA AWESOME SCRIPT THAT SENDS A BUNCH OF RANDOM REQUESTS TO A SPECIFIC ENDPOINT //
//                                                                                        //
//----------------------------------------------------------------------------------------//

const TARGET_URL = "https://request-bin-tjic.onrender.com/rkmMBVKMXC";
const REQUEST_COUNT = 50;

const METHODS = ["GET", "POST", "PUT", "DELETE"];

const WORDS = [
	"user", "order", "payment", "invoice", "session", "event",
	"status", "amount", "email", "product", "cart", "token",
];

function randomItem(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function randomValue() {
	const kind = Math.floor(Math.random() * 4);
	if (kind === 0) return randomItem(WORDS);
	if (kind === 1) return Math.floor(Math.random() * 1000);
	if (kind === 2) return Math.random() > 0.5;
	return `${randomItem(WORDS)}_${Math.floor(Math.random() * 100)}`;
}

function randomBody() {
	const fieldCount = 1 + Math.floor(Math.random() * 3);
	const body = {};
	for (let i = 0; i < fieldCount; i++) {
		body[randomItem(WORDS)] = randomValue();
	}
	return JSON.stringify(body);
}

function randomQueryString() {
	const paramCount = Math.floor(Math.random() * 4); // 0-3 params
	const params = new URLSearchParams();
	for (let i = 0; i < paramCount; i++) {
		params.append(randomItem(WORDS), randomValue());
	}
	return params.toString();
}

async function sendRandomRequest(index) {
	const method = randomItem(METHODS);
	const hasBody = method !== "GET";
	const query = randomQueryString();
	const url = query ? `${TARGET_URL}?${query}` : TARGET_URL;

	try {
		const res = await fetch(url, {
			method,
			headers: hasBody ? { "Content-Type": "application/json" } : undefined,
			body: hasBody ? randomBody() : undefined,
		});
		console.log(`[${index + 1}/${REQUEST_COUNT}] ${method} ${url} -> ${res.status}`);
	} catch (err) {
		console.error(`[${index + 1}/${REQUEST_COUNT}] ${method} ${url} -> failed: ${err.message}`);
	}
}

async function main() {
	console.log(`Sending ${REQUEST_COUNT} random requests to ${TARGET_URL}`);
	for (let i = 0; i < REQUEST_COUNT; i++) {
		await sendRandomRequest(i);
	}
	console.log("Done.");
}

main();
