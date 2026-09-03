// updated
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import "./BinDetails.css";
import RequestList from "./RequestList.jsx";
import RequestDetail from "./RequestDetail.jsx";
import binService from "../services/binService.js";
import { getStoredToken } from "../auth/auth.js";
import { DOMAIN } from "../config.js";

const SOCKET_URL = "http://localhost:3000";

const BinDetails = () => {
	const { endpoint } = useParams();
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedRequestId, setSelectedRequestId] = useState(null);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError(null);

		binService.getAllRequests(endpoint)
			.then((data) => {
				setRequests(data);
				setSelectedRequestId(data.length > 0 ? data[0].id : null);
			})
			.catch(() => setError("Failed to load requests for this bin."))
			.finally(() => setLoading(false));
	}, [endpoint]);

	useEffect(() => {
		const socket = io(SOCKET_URL, { auth: { token: getStoredToken() } });

		socket.emit("join-bin", endpoint);

		socket.on("new-request", (newRequest) => {
			setRequests((prev) => [newRequest, ...prev]);
		});

		return () => {
			socket.disconnect();
		};
	}, [endpoint]);

	useEffect(() => {
		if (selectedRequestId == null) {
			setSelectedRequest(null);
			return;
		}

		let cancelled = false;
		setDetailLoading(true);
		setDetailError(null);

		binService.getRequestById(endpoint, selectedRequestId)
			.then((data) => {
				if (!cancelled) setSelectedRequest(data.request_payload);
			})
			.catch(() => {
				if (!cancelled) setDetailError("Failed to load request details.");
			})
			.finally(() => {
				if (!cancelled) setDetailLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [endpoint, selectedRequestId]);

	const copyEndpoint = async () => {
		try {
			await navigator.clipboard.writeText(`${DOMAIN}/${endpoint}`);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error("Failed to copy endpoint:", err);
		}
	};

	return (
		<div className="bin-details-page">
			<main className="bin-details">
				<div className="bin-details__card">
					<div className="bin-details__info">
						<div className="bin-details__info-left">
							<Link className="bin-details__back" to="/">← Back to bins</Link>
							<div className="bin-details__title-row">
								<h1 className="bin-details__title">{endpoint}</h1>
								<button className="bin-details__button" type="button" onClick={copyEndpoint}>
									{copied ? "Copied" : "Copy Endpoint"}
								</button>
							</div>
							<span className="bin-details__endpoint">{endpoint}</span>
						</div>
					</div>

					<div className="bin-details__body">
						{loading && <p className="bin-details__status">Loading requests…</p>}
						{!loading && error && <p className="bin-details__status">{error}</p>}
						{!loading && !error && (
							<>
								<RequestList
									requests={requests}
									selectedRequestId={selectedRequestId}
									onSelect={setSelectedRequestId}
								/>
								<RequestDetail
									request={selectedRequest}
									loading={detailLoading}
									error={detailError}
								/>
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	)
};

export default BinDetails;
