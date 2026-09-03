import { useState } from "react";
import NewBin from "./NewBinForm";
import MyBins from "./MyBins";

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

	const handleBinCreated = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="page">
			<NewBin onBinCreated={handleBinCreated} />
			<MyBins refreshKey={refreshKey} />
		</div>
	)
};

export default HomePage;
