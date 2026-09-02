import { useState } from "react";
import NewBin from "./NewBinForm";
import MyBins from "./MyBins";

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
