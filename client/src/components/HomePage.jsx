import { useState } from "react";
import NewBin from "./NewBinForm";
import MyBins from "./MyBins";
import { getStoredToken, setStoredToken, validateToken } from "../auth/auth.js";

/*

// Shape of a Request row from PostgreSQL
const request = {
  id: 1,                         // integer, NOT NULL, auto-generated
  bin_id: 12,                    // integer, NOT NULL
  method: "POST",                // string | null, max 10 chars
  path: "/webhook/stripe",       // string, NOT NULL
  headers: '{"content-type":"application/json"}', // string, NOT NULL
  body: '{"event":"payment_success"}',            // string | null
  received_at: "2026-09-02T10:15:00"              //

*/

const HomePage = () => {
	const [refreshKey, setRefreshKey] = useState(0);
	const [copiedToken, setCopiedToken] = useState(false);

	const handleBinCreated = () => {
		setRefreshKey((prev) => prev + 1);
	};

	const copyCurrentToken = async () => {
		try {
			await navigator.clipboard.writeText(getStoredToken() ?? "");
			setCopiedToken(true);
			setTimeout(() => setCopiedToken(false), 1500);
		} catch (err) {
			console.error("Failed to copy token:", err);
		}
	};

	const enterExistingToken = async () => {
		const token = window.prompt("Enter your token:");
		if (!token) return;

		const trimmedToken = token.trim();
		const isValid = await validateToken(trimmedToken);
		if (!isValid) {
			alert("Invalid token");
			return;
		}

		setStoredToken(trimmedToken);
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="page">
			<NewBin onBinCreated={handleBinCreated} />
			<MyBins refreshKey={refreshKey} />
			<div className="token-actions">
				<button className="token-actions__button" type="button" onClick={copyCurrentToken}>
					{copiedToken ? "Copied" : "Copy Current Token"}
				</button>
				<button className="token-actions__button" type="button" onClick={enterExistingToken}>
					Enter Existing Token
				</button>
			</div>
		</div>
	)
};

export default HomePage;
