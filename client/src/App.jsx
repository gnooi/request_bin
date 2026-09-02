import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import BinDetails from "./components/BinDetails.jsx";

function App() {

	return (
		<div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/bins/:endpoint" element={<BinDetails />} />
			</Routes>
		</div>
	)
}

export default App;
