import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
	try {
		const {
			GOOGLE_SERVICE_ACCOUNT_EMAIL,
			GOOGLE_PRIVATE_KEY,
			GOOGLE_SHEET_ID,
		} = process.env;

		if (
			!GOOGLE_SERVICE_ACCOUNT_EMAIL ||
			!GOOGLE_PRIVATE_KEY ||
			!GOOGLE_SHEET_ID
		) {
			throw new Error("Missing required environment variables");
		}

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
		const groupedSums = {};

		for (let i = 1; i < sheets.length; i++) {
			const sheet = sheets[i];
			await sheet.loadCells("F23:H1");

			const cellF23 = sheet.getCellByA1("F23");
			const cellH1 = sheet.getCellByA1("H1");
			let valueF23 = cellF23.value;
			const valueH1 = cellH1.formattedValue;

			// Ensure valueF23 is a string before using replace
			if (typeof valueF23 === "string") {
				valueF23 = parseFloat(valueF23.replace(/[^\d.-]/g, "")); // Removing any non-numeric characters for parsing
			} else if (typeof valueF23 === "number") {
				valueF23 = parseFloat(valueF23);
			} else {
				valueF23 = NaN;
			}

			if (!isNaN(valueF23) && valueH1) {
				if (!groupedSums[valueH1]) {
					groupedSums[valueH1] = 0;
				}
				groupedSums[valueH1] += valueF23;
			}
		}

		res.status(200).json(groupedSums);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: error.message });
	}
}
