// dummyBins.js
export const dummyBins = [
	{
		id: 1,
		bin_name: "8fk2x",
		request_count: 143,
		created_at: new Date(Date.now() - 23 * 1000).toISOString(), // 23s ago
	},
	{
		id: 2,
		bin_name: "my_github_webhook",
		request_count: 87,
		created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
	},
	{
		id: 3,
		bin_name: "payment-callbacks",
		request_count: 12,
		created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
	},
	{
		id: 4,
		bin_name: "test_endpoint",
		request_count: 0,
		created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2d ago
	},
	{
		id: 5,
		bin_name: "vunz2xg.g",
		request_count: 4,
		created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30d ago
	},
];
