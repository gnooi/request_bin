import { useState, useEffect } from "react";
import binService from "../services/binService.js";
import { DOMAIN } from "../config.js";
import { dummyBins } from "./dummyBins.js";

// get all bins for a particular use (by token)
// if new user or no bin, My Bins: You have no bins yet

// front end req to server
// async function getAllBins(token) {
//   try {
//     const { data } = await axios.get(baseURL, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
// 
//     return data;
//   } catch (err) {
//     console.error("Failed to fetch bins:", err.message);
//     throw err;
//   }
// }

// backend controller:
// async function getBins(req, res) {
//   const userId = req.userId
// 
//   const rows = await findBinsByUserId(userId)
// 
//   const bins = rows.map(
//     ({ id, bin_name, request_count, created_at }) => ({
//       id,
//       bin_name,
//       request_count,
//       created_at
//     })
//   )
// 
//   return res.status(200).json(bins)
// }

const formatRelativeTime = (timestamp) => {
	if (!timestamp) return "Never";
	const isoLike = timestamp.includes("T") ? timestamp : `${timestamp.replace(" ", "T")}Z`;
	const diffSec = Math.floor((Date.now() - new Date(isoLike).getTime()) / 1000);
	if (diffSec < 60) return `${diffSec}s ago`;
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	return `${Math.floor(diffHr / 24)}d ago`;
};

const MyBins = () => {
	const [myBins, setMyBins] = useState([]);
	const [copiedId, setCopiedId] = useState(null);
	const token = '';

	useEffect(() => {
		setMyBins(dummyBins);
		//		binService
		//			.getAllBins(token)
		//			.then(data => setMyBins(data));
	}, []);

	const copyEndpoint = async (id, binName) => {
		try {
			await navigator.clipboard.writeText(`${DOMAIN}/${binName}`);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 1500);
		} catch (err) {
			console.error("Failed to copy endpoint:", err);
		}
	};

	return (
		<div className="card my-bins-card">
			<h2>My Bins:</h2>
			<ul className="my-bins">
				{myBins.length > 0
					? myBins.map(({ id, bin_name, request_count, created_at }) => {
						return (
							<li key={id} className="bin-row">
								<a href={`${DOMAIN}/bins/${bin_name}/requests`} className="bin-row-main">
									<div className="bin-row-name">
										<span className="bin-name">{bin_name}</span>
										<span className="bin-endpoint">{DOMAIN}/{bin_name}</span>
									</div>
									<div className="bin-row-stat">
										<span className="stat-value">{request_count}</span>
										<span className="stat-label">Requests</span>
									</div>
									<div className="bin-row-stat">
										<span className="stat-value">{formatRelativeTime(created_at)}</span>
										<span className="stat-label">Created</span>
									</div>
								</a>
								<button
									type="button"
									className="copy-button"
									onClick={() => copyEndpoint(id, bin_name)}
								>
									{copiedId === id ? "Copied" : "Copy"}
								</button>
								<a
									href={`/bins/${bin_name}/requests`}
									className="chevron"
									aria-label={`View ${bin_name}`}
								>
									<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</a>
							</li>
						);
					})
					: <li className="empty">You have no bins yet.</li>
				}
			</ul>
		</div>
	);
};

export default MyBins;
