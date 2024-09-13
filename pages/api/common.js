import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
	try {
		const serviceAccountAuth = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});

		const doc = new GoogleSpreadsheet(
			process.env.GOOGLE_SHEET_ID,
			serviceAccountAuth
		);

		await doc.loadInfo();

		const sheets = doc.sheetsByIndex;

		const allData = [];

		for (let i = 3; i < sheets.length; i++) {
			const sheet = sheets[i];
			await sheet.loadCells();

			const rows = await sheet.getRows();

			const filteredData = rows
				.filter((row) => row._rawData[1] && row._rawData[6] !== "TRUE")
				.map((row) => ({
					index: row._rawData[0],
					name: row._rawData[1],
					totalAmount: row._rawData[5],
					dishName: row._rawData[7],
					sheetName: sheet.title,
					sheetUrl: `https://docs.google.com/spreadsheets/d/1-7X5eNU2eIW24578lG2oMbVwMPNHUtVQ7WjlTMfBCl4/edit?gid=${sheet.sheetId}`,
					date: sheet._headerValues[7],
				}))
				.slice(1);

			allData.push(...filteredData);
		}

		res.status(200).json(allData);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "An error occurred" });
	}
}
