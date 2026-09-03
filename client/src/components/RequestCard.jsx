import "./RequestCard.css";

const METHOD_CLASS = {
	GET: "request-card__method--get",
	POST: "request-card__method--post",
	PUT: "request-card__method--put",
	DELETE: "request-card__method--delete",
};

const formatRelativeTime = (receivedAt) => {
	const seconds = Math.floor((Date.now() - new Date(receivedAt).getTime()) / 1000);

	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
};

const RequestCard = ({ request, selected = false, onClick }) => {
	const { method, path, received_at } = request;
	const methodClass = METHOD_CLASS[method] ?? "";

	return (
		<button
			className={`request-card${selected ? " request-card--selected" : ""}`}
			onClick={onClick}
			type="button"
		>
			<span className={`request-card__method ${methodClass}`}>{method}</span>
			<span className="request-card__path">{path}</span>
			<span className="request-card__time">{formatRelativeTime(received_at)}</span>
		</button>
	)
};

export default RequestCard;
