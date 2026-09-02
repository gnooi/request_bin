import { useState } from "react";
import "./RequestDetail.css";

const METHOD_CLASS = {
	GET: "request-detail__method--get",
	POST: "request-detail__method--post",
	PUT: "request-detail__method--put",
	DELETE: "request-detail__method--delete",
};

const parseHeaders = (headersJson) => {
	return JSON.parse(headersJson);
};

const formatPayload = (body) => {
	try {
		return JSON.stringify(JSON.parse(body), null, 2);
	} catch {
		return body;
	}
};

const formatRawRequest = (request, parsedHeaders) => {
	const requestLine = `${request.method} ${request.path} HTTP/1.1`;
	const headerLines = Object.entries(parsedHeaders)
		.map(([key, value]) => `${key}: ${value}`)
		.join("\n");

	return request.body
		? `${requestLine}\n${headerLines}\n\n${request.body}`
		: `${requestLine}\n${headerLines}`;
};

const RequestDetail = ({ request }) => {
	const [activeTab, setActiveTab] = useState("headers");

	if (!request) {
		return (
			<section className="bin-details__request-detail" aria-label="Request detail">
				<p className="request-detail__empty">Select a request to view its details.</p>
			</section>
		);
	}

	const headers = parseHeaders(request.headers);

	return (
		<section className="bin-details__request-detail" aria-label="Request detail">
			<div className="request-detail__summary">
				<span className={`request-detail__method ${METHOD_CLASS[request.method] ?? ""}`}>
					{request.method}
				</span>
				<span className="request-detail__path">{request.path}</span>
			</div>

			<div className="request-detail__tabs" role="tablist" aria-label="Request data">
				<button
					className={`request-detail__tab${activeTab === "headers" ? " request-detail__tab--active" : ""}`}
					onClick={() => setActiveTab("headers")}
					type="button"
				>
					Headers
				</button>
				<button
					className={`request-detail__tab${activeTab === "payload" ? " request-detail__tab--active" : ""}`}
					onClick={() => setActiveTab("payload")}
					type="button"
				>
					Payload
				</button>
				<button
					className={`request-detail__tab${activeTab === "raw" ? " request-detail__tab--active" : ""}`}
					onClick={() => setActiveTab("raw")}
					type="button"
				>
					Raw Data
				</button>
			</div>

			<div className="request-detail__panel">
				{activeTab === "headers" && (
					<dl className="request-detail__headers">
						{Object.entries(headers).map(([key, value]) => (
							<div className="request-detail__header-row" key={key}>
								<dt>{key}</dt>
								<dd>{value}</dd>
							</div>
						))}
					</dl>
				)}

				{activeTab === "payload" && (
					request.body
						? <pre className="request-detail__payload">{formatPayload(request.body)}</pre>
						: <p className="request-detail__empty">No payload sent with this request.</p>
				)}

				{activeTab === "raw" && (
					<pre className="request-detail__payload">{formatRawRequest(request, headers)}</pre>
				)}
			</div>
		</section>
	)
};

export default RequestDetail;
