import { useState, useEffect } from "react";
import DataTable, {
	createTheme,
	defaultThemes,
} from "react-data-table-component";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import { formatNumber } from "../utils/formatNumber";

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
		<div className="flex justify-center items-center">
			<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
		</div>
	);
};

const IndexPage = () => {
	const [commonData, setCommonData] = useState(null);
	const [financeData, setFinanceData] = useState(null);
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

	const financeColumns = [
		{
			name: <p className="font-bold uppercase">Ngày</p>,
			selector: (row) => row.date,
			sortable: true,
		},
		{
			name: <p className="font-bold uppercase">Tổng tiền</p>,
			selector: (row) => <p>{formatNumber(row.totalAmount)} đ</p>,
			sortable: true,
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commonResponse, financeResponse] = await Promise.all([
					fetch("/api/common"),
					fetch("/api/sum"),
				]);

				if (!commonResponse.ok || !financeResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const commonData = await commonResponse.json();
				const financeData = await financeResponse.json();

				const formattedFinanceData = Object.keys(financeData).map((key) => ({
					date: key,
					totalAmount: financeData[key],
				}));

				setCommonData(commonData);
				setFinanceData(formattedFinanceData);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const aggregateByMonth = (data) => {
		const aggregatedData = {};

		data.forEach((item) => {
			const month = moment(item.date, "DD/MM/YYYY").format("MM/YYYY");
			if (!aggregatedData[month]) {
				aggregatedData[month] = 0;
			}
			aggregatedData[month] += item.totalAmount;
		});

		return Object.keys(aggregatedData).map((key) => ({
			date: key,
			totalAmount: aggregatedData[key],
		}));
	};

	const aggregatedFinanceData = financeData
		? aggregateByMonth(financeData)
		: [];

	if (loading) {
		return (
			<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center">
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

	const financeChartData = {
		labels: aggregatedFinanceData.map((d) => d.date),
		datasets: [
			{
				label: "Total Amount",
				data: aggregatedFinanceData.map((d) => d.totalAmount),
				backgroundColor: "rgba(15, 164, 175, 0.8)",
				datalabels: {
					anchor: "end",
					align: "top",
					formatter: function (value) {
						return new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(value);
					},
				},
			},
		],
	};

	const options = {
		plugins: {
			datalabels: {
				display: true,
				color: "black",
				anchor: "end",
				align: "top",
				offset: -5,
				formatter: function (value) {
					return new Intl.NumberFormat("vi-VN", {
						style: "currency",
						currency: "VND",
					}).format(value);
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value) {
						return new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(value);
					},
				},
			},
		},
	};

	return (
		<div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex justify-center p-2 lg:p-10">
			<div className="min-w-[90%] grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="space-y-4">
					<div className="p-5 bg-white">
						<h2 className="text-center font-bold text-lg mb-5">
							HOW MUCH BITA SPENT EACH MONTH FOR LUNCH
						</h2>
						<Bar
							data={financeChartData}
							options={options}
							plugins={[ChartDataLabels]}
						/>
					</div>
					<div className="mb-5">
						<DataTable
							title="SPENDING HISTORY"
							columns={financeColumns}
							data={financeData}
							highlightOnHover
							pointerOnHover
							pagination
							customStyles={customStyles}
							theme="custom"
						/>
					</div>
				</div>
				<div className="mb-5">
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
		</div>
	);
};

export default IndexPage;
