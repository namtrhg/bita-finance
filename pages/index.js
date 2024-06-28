import { useState, useEffect } from "react";
import DataTable, {
	createTheme,
	defaultThemes,
} from "react-data-table-component";
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

const IndexPage = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const columns = [
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
			name: <p className="font-bold uppercase">Thành tiền/ ship</p>,
			selector: (row) => <p>{row.totalAmount}</p>,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Tên món</p>,
			selector: (row) => row.dishName,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Tên sheet</p>,
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
		fetch("/api/common")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setData(data);
				setLoading(false);
			})
			.catch((error) => {
				setError(error);
				setLoading(false);
			});
	}, []);

	console.log(data);

	if (loading) {
		return (
			<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center">
				<p className="text-[#f5f5f5]">Loading...</p>
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
		<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex justify-center p-10">
			<div className="w-[90%]">
				<img
					className="max-h-[320px] w-auto mx-auto mb-5"
					src="/images/banner.jpg"
					alt="company-banner"
				/>
				<h1 className="uppercase text-white text-lg mb-5 text-center font-bold">
					BITA VIỆT NAM
					<br />
					LEADERBOARD
				</h1>
				<div className="border-2 border-[#964734] border-solid shadow-lg">
					<DataTable
						columns={columns}
						data={data}
						highlightOnHover
						pointerOnHover
						pagination
						customStyles={customStyles}
						theme="custom"
					/>
				</div>
			</div>
		</div>
	);
};
export default IndexPage;
