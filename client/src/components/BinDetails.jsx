import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BinDetails.css";
import RequestList from "./RequestList.jsx";
import RequestDetail from "./RequestDetail.jsx";
import binService from "../services/binService.js";

const BinDetails = () => {
	const { endpoint } = useParams();
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		binService.getAllRequests(endpoint)
			.then(setRequests)
			.catch(() => setError("Failed to load requests for this bin."))
			.finally(() => setLoading(false));
	}, [endpoint]);

	return (
		<div className="bin-details-page">
			<header className="app-header">
				<div className="app-header__brand">
					<span className="app-header__logo" aria-hidden="true" />
					<span className="app-header__wordmark">RequestBin</span>
				</div>
				<nav className="app-header__nav">
					<a className="app-header__nav-link app-header__nav-link--active" href="/">Bins</a>
					<a className="app-header__nav-link" href="#">Settings</a>
				</nav>
				<div className="app-header__actions">
					<button className="app-header__icon-button" type="button" aria-label="Help">?</button>
				</div>
			</header>

			<main className="bin-details">
				<div className="bin-details__card">
					<div className="bin-details__info">
						<div className="bin-details__info-left">
							<a className="bin-details__back" href="/">← Back to bins</a>
							<div className="bin-details__title-row">
								<h1 className="bin-details__title">{endpoint}</h1>
								<button className="bin-details__button" type="button">Copy endpoint</button>
							</div>
							<span className="bin-details__endpoint">{endpoint}</span>
						</div>
						<div className="bin-details__info-right">
							<button className="bin-details__button bin-details__button--icon" type="button" aria-label="More options">
								⋯
							</button>
						</div>
					</div>

					<div className="bin-details__body">
						{loading && <p className="bin-details__status">Loading requests…</p>}
						{!loading && error && <p className="bin-details__status">{error}</p>}
						{!loading && !error && (
							<>
								<RequestList requests={requests} selectedRequestId={null} />
								<RequestDetail request={null} />
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	)
};

export default BinDetails;
