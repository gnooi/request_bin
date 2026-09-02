import "./RequestList.css";
import RequestCard from "./RequestCard.jsx";

const RequestList = ({ requests, selectedRequestId }) => {
	return (
		<section className="bin-details__requests" aria-label="Requests">
			<input
				className="bin-details__search"
				type="text"
				placeholder="Search requests..."
			/>
			<div className="bin-details__methods" role="group" aria-label="Filter by method">
				<button className="method-badge method-badge--active" type="button">All</button>
				<button className="method-badge method-badge--get" type="button">GET</button>
				<button className="method-badge method-badge--post" type="button">POST</button>
				<button className="method-badge method-badge--put" type="button">PUT</button>
				<button className="method-badge method-badge--delete" type="button">DELETE</button>
			</div>
			{requests.map((request) => (
				<RequestCard key={request.id} request={request} selected={request.id === selectedRequestId} />
			))}
		</section>
	)
};

export default RequestList;
