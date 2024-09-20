import { useState, useEffect } from "react";
import DataTable, { createTheme, defaultThemes } from "react-data-table-component";
import Link from "next/link";

createTheme(
	"custom",
	{
		text: {
			primary: "#003135",
			secondary: "#f0f0f0",
		},
		background: {
			default: "#f5f5f5",
		},
		context: {
			background: "#964734",
			text: "#ffffff",
		},
		divider: {
			default: "#e0e0e0",
		},
		button: {
			default: "#0fa4af",
			hover: "rgba(15, 164, 175, 0.8)",
			focus: "rgba(15, 164, 175, 0.5)",
			disabled: "rgba(0, 0, 0, 0.26)",
		},
		sortFocus: {
			default: "#afdde5",
		},
	},
	"light"
);

const customStyles = {
	header: {
		style: {
			minHeight: "56px",
		},
	},
	headRow: {
		style: {
			borderTopStyle: "solid",
			borderTopWidth: "1px",
			borderTopColor: defaultThemes.default.divider.default,
		},
	},
	headCells: {
		style: {
			"&:not(:last-of-type)": {
				borderRightStyle: "solid",
				borderRightWidth: "1px",
				borderRightColor: defaultThemes.default.divider.default,
			},
		},
	},
	cells: {
		style: {
			"&:not(:last-of-type)": {
				borderRightStyle: "solid",
				borderRightWidth: "1px",
				borderRightColor: defaultThemes.default.divider.default,
			},
		},
	},
};

const LoadingSpinner = () => {
	return (
		<img
			src="/images/racoon-pedro.gif"
			alt="Loading Spinner"
			className="w-20 h-20"
		/>
	);
};

const IndexPage = () => {
	const [commonData, setCommonData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const commonColumns = [
		{
			name: <p className="font-bold uppercase">STT</p>,
			cell: (row, index) => index + 1,
			grow: 0,
		},
		{
			name: <p className="font-bold uppercase">Tên</p>,
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Thành tiền</p>,
			selector: (row) => <p>{row.totalAmount}</p>,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Tên món</p>,
			selector: (row) => row.dishName,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Sheet</p>,
			selector: (row) => (
				<Link href={row.sheetUrl} target="_blank">
					<p className="text-[#964734] underline">{row.sheetName}</p>
				</Link>
			),
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Ngày</p>,
			selector: (row) => row.date,
			sortable: true,
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const commonResponse = await fetch("/api/common");

				if (!commonResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const commonData = await commonResponse.json();
				setCommonData(commonData.filter((data) => data.name && data.value !== "TRUE"));
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="bg-black h-screen flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center">
				<p className="text-[#f5f5f5]">Error: {error.message}</p>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex justify-center p-2 lg:p-10">
			<div className="mx-auto">
					<img className="max-h-64 mb-6 mx-auto" src="images/banner.jpg" alt="banner"/>
					<DataTable
						title="LEADERBOARD"
						columns={commonColumns}
						data={commonData}
						highlightOnHover
						pointerOnHover
						pagination
						customStyles={customStyles}
						theme="custom"
					/>
			</div>
		</div>
	);
};

export default IndexPage;
