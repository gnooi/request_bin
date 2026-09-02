import { useState, useEffect } from "react";
import binService from "../services/binService.js";

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

const MyBins = () => {
	const [myBins, setMyBins] = useState([]);
	const token = '';


	useEffect(() => {
		binService
			.getAllBins(token)
			.then(data => setMyBins(data));
	}, []);

	return (
		<div>
			<ul className="my-bins">
				{myBins.length > 0
					? myBins.map(({ id, bin_name, request_count, created_at }) => {
						return (
							<li id={id}>
								<a href={`https://ngrok.com/${bin_name}`}>
									{bin_name}
								</a>
							</li>
						);
					})
					: <li>You have no bins yet.</li>
				}
			</ul>
		</div>
	);
};

export default MyBins;
