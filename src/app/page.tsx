import type { AppProps } from 'next/app';
import Dashboard from './dashboard/page';


function MyApp({ Component, pageProps }: AppProps) {
  return <Dashboard />
}

export default MyApp;