import { useState } from "react";
import "./RequestList.css";
import RequestCard from "./RequestCard.jsx";
import { parseHeaders, formatRawRequest } from "../utils/requestFormat.js";

const matchesSearch = (request, query) => {
	if (!query) return true;

	try {
		const headers = parseHeaders(request.headers);
		const raw = formatRawRequest(request, headers);
		return raw.toLowerCase().includes(query);
	} catch {
		return false;
	}
};

const RequestList = ({ requests, selectedRequestId, onSelect }) => {
	const [search, setSearch] = useState("");
	const [methodFilter, setMethodFilter] = useState("ALL");
	const query = search.trim().toLowerCase();
	const activeClass = (method) => methodFilter === method ? " method-badge--active" : "";
	const visibleRequests = requests
		.filter((request) => methodFilter === "ALL" || request.method === methodFilter)
		.filter((request) => matchesSearch(request, query));

	return (
		<section className="bin-details__requests" aria-label="Requests">
			<input
				className="bin-details__search"
				type="text"
				placeholder="Search requests..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div className="bin-details__methods" role="group" aria-label="Filter by method">
				<button className={`method-badge${activeClass("ALL")}`} type="button" onClick={() => setMethodFilter("ALL")}>All</button>
				<button className={`method-badge method-badge--get${activeClass("GET")}`} type="button" onClick={() => setMethodFilter("GET")}>GET</button>
				<button className={`method-badge method-badge--post${activeClass("POST")}`} type="button" onClick={() => setMethodFilter("POST")}>POST</button>
				<button className={`method-badge method-badge--put${activeClass("PUT")}`} type="button" onClick={() => setMethodFilter("PUT")}>PUT</button>
				<button className={`method-badge method-badge--delete${activeClass("DELETE")}`} type="button" onClick={() => setMethodFilter("DELETE")}>DELETE</button>
			</div>
			{visibleRequests.length > 0
				? visibleRequests.map((request) => (
					<RequestCard
						key={request.id}
						request={request}
						selected={request.id === selectedRequestId}
						onClick={() => onSelect(request.id)}
					/>
				))
				: <p className="bin-details__search-empty">No requests match your filters.</p>
			}
		</section>
	)
};

export default RequestList;
