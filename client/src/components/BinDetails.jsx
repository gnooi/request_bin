import "./BinDetails.css";
import RequestList from "./RequestList.jsx";
import RequestDetail from "./RequestDetail.jsx";

// Example requests shaped like rows from the Postgres `requests` table, for layout preview only.
const EXAMPLE_REQUESTS = [
	{
		id: 1,
		bin_id: 12,
		method: "POST",
		path: "/api/v1/webhooks/stripe",
		headers: '{"content-type":"application/json"}',
		body: '{"event":"payment_success"}',
		received_at: new Date(Date.now() - 23 * 1000).toISOString(),
	},
	{
		id: 2,
		bin_id: 12,
		method: "GET",
		path: "/v1/charges",
		headers: '{"accept":"*/*"}',
		body: null,
		received_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
	},
	{
		id: 3,
		bin_id: 12,
		method: "PUT",
		path: "/v1/customers/42",
		headers: '{"content-type":"application/json"}',
		body: '{"name":"Jane Doe"}',
		received_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
	},
];

const BinDetails = () => {
	const selectedRequest = EXAMPLE_REQUESTS[0];

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
								<h1 className="bin-details__title">Bin name</h1>
								<button className="bin-details__button" type="button">Copy endpoint</button>
							</div>
							<span className="bin-details__endpoint">rbn.dev/b/xxxxx</span>
						</div>
						<div className="bin-details__info-right">
							<button className="bin-details__button bin-details__button--icon" type="button" aria-label="More options">
								⋯
							</button>
						</div>
					</div>

					<div className="bin-details__body">
						<RequestList requests={EXAMPLE_REQUESTS} selectedRequestId={selectedRequest.id} />
						<RequestDetail request={selectedRequest} />
					</div>
				</div>
			</main>
		</div>
	)
};

export default BinDetails;
