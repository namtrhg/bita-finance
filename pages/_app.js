import Head from "next/head";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

const App = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="BitA Excel Bill" />
				<title>BITA BILL</title>
			</Head>
			<body>
				<main className="">
					<Component {...pageProps} />
				</main>
				<Analytics />
			</body>
		</>
	);
};

export default App;
