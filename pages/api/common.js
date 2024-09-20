import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
	try {
		const serviceAccountAuth = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});

		const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
		
		// Load document and sheets info
		await doc.loadInfo();

		const sheets = doc.sheetsByIndex;

		const allData = [];

		// Iterate through sheets starting from index 3
		for (let i = 3; i < sheets.length; i++) {
			const sheet = sheets[i];

			// Load all cells of the sheet
			await sheet.loadCells();

			// Fetch rows efficiently by filtering directly in the API call
			const rows = await sheet.getRows({
				offset: 1, // Skip header row
			});

			const filteredData = rows.map((row) => ({
				index: row._rawData[0],
				name: row._rawData[1],
				totalAmount: row._rawData[5],
				dishName: row._rawData[7],
				sheetName: sheet.title,
				sheetUrl: `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit?gid=${sheet.sheetId}`,
				date: sheet.headerValues[7], // Assuming date is in header row
			})).filter((data) => data.name && row._rawData[6] !== "TRUE");

			allData.push(...filteredData);
		}

		res.status(200).json(allData);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "An error occurred" });
	}
}
