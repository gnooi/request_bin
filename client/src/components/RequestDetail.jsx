import { useEffect, useState } from "react";
import "./RequestDetail.css";
import { parseHeaders, formatRawRequest } from "../utils/requestFormat.js";

const METHOD_CLASS = {
	GET: "request-detail__method--get",
	POST: "request-detail__method--post",
	PUT: "request-detail__method--put",
	DELETE: "request-detail__method--delete",
};

const formatPayload = (body) => {
	try {
		return JSON.stringify(JSON.parse(body), null, 2);
	} catch {
		return body;
	}
};

const parseQueryParams = (path) => {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) return [];
	return [...new URLSearchParams(path.slice(queryIndex + 1)).entries()];
};

const RequestDetail = ({ request, loading = false, error = null }) => {
	const [activeTab, setActiveTab] = useState("headers");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setCopied(false);
	}, [activeTab, request]);

	if (loading) {
		return (
			<section className="bin-details__request-detail" aria-label="Request detail">
				<p className="request-detail__empty">Loading request details…</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className="bin-details__request-detail" aria-label="Request detail">
				<p className="request-detail__empty">{error}</p>
			</section>
		);
	}

	if (!request) {
		return (
			<section className="bin-details__request-detail" aria-label="Request detail">
				<p className="request-detail__empty">Select a request to view its details.</p>
			</section>
		);
	}

	const headers = parseHeaders(request.headers);
	const queryParams = parseQueryParams(request.path);

	const getActiveTabContent = () => {
		if (activeTab === "headers") {
			return Object.entries(headers)
				.map(([key, value]) => `${key}: ${value}`)
				.join("\n");
		}
		if (activeTab === "query") {
			return queryParams.map(([key, value]) => `${key}: ${value}`).join("\n");
		}
		if (activeTab === "payload") {
			return request.body ? formatPayload(request.body) : "";
		}
		return formatRawRequest(request, headers);
	};

	const copyActiveTab = async () => {
		try {
			await navigator.clipboard.writeText(getActiveTabContent());
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error("Failed to copy request detail:", err);
		}
	};

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
					className={`request-detail__tab${activeTab === "query" ? " request-detail__tab--active" : ""}`}
					onClick={() => setActiveTab("query")}
					type="button"
				>
					Query Params
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
				<button
					className="request-detail__copy"
					onClick={copyActiveTab}
					type="button"
				>
					{copied ? "Copied" : "Copy"}
				</button>

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

				{activeTab === "query" && (
					queryParams.length > 0
						? (
							<dl className="request-detail__headers">
								{queryParams.map(([key, value], index) => (
									<div className="request-detail__header-row" key={`${key}-${index}`}>
										<dt>{key}</dt>
										<dd>{value}</dd>
									</div>
								))}
							</dl>
						)
						: <p className="request-detail__empty">No query parameters sent with this request.</p>
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
