export const parseHeaders = (headers) => {
	return typeof headers === "string" ? JSON.parse(headers) : headers;
};

export const formatRawRequest = (request, parsedHeaders) => {
	const requestLine = `${request.method} ${request.path} HTTP/1.1`;
	const headerLines = Object.entries(parsedHeaders)
		.map(([key, value]) => `${key}: ${value}`)
		.join("\n");

	return request.body
		? `${requestLine}\n${headerLines}\n\n${request.body}`
		: `${requestLine}\n${headerLines}`;
};
