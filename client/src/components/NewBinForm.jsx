import { useState } from "react";
import binService from "../services/binService.js";

const BIN_NAME_LENGTH = 7;
const DOMAIN = "https://ngrokPointingToLocalHost:3000/"
const VALID_BIN_NAME = /^[\w\d\-_\.]{1,50}$/;

const generateRandomName = () => {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-_.";
	let result = "";

	while (result.length < BIN_NAME_LENGTH) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		result += chars[randomIndex];
	}

	return result;
};

const isValidBinName = (binName) => {
	return VALID_BIN_NAME.test(binName);
}

const NewBin = () => {
	const [binName, setBinName] = useState(generateRandomName);

	const submitBinName = async (event) => {
		event.preventDefault();

		if (!isValidBinName(binName)) {
			alert("Bin name must only contain alphanumeric characters.");
			setBinName(generateRandomName());
			return;
		}

		try {
			const result = await binService.postBin(binName);
			// if successful, update my bins sidebar
		} catch (err) {
			console.error(err);
			alert(`Failed to create bin: ${binName} - bin already exists`);
			setBinName(generateRandomName());

			// May want to be more specific with error handling.
			//	* if name already exists, use above alert
			//	* otherwise, specify a network error, etc.
		}
	};

	return (
		<div>
			<h1>New Bin</h1>
			<p>Create a bin to collect and inspect HTTP reqests.</p>
			<form id="create_bin" onSubmit={submitBinName}>
				<label htmlFor="bin_name">
					<span id="base_uri">
						{DOMAIN}
					</span>
					<input
						id="bin_name"
						value={binName}
						onChange={(event) => setBinName(event.target.value)}
						type="text"
						placeholder="type a name"
					/>
				</label>
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default NewBin;
