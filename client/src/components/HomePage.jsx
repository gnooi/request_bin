import NewBin from "./NewBinForm";

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
	return (
		<div>
			<NewBin />
		</div>
	)
};

export default HomePage;
