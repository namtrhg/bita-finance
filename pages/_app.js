import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    <main className="">
      <Component {...pageProps} />
    </main>
  );
};

export default App;
