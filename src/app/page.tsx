import type { AppProps } from 'next/app';
import Dashboard from './dashboard/page';
import Login from './login/page';


function MyApp({ Component, pageProps }: AppProps) {
  return <Login />
}

export default MyApp;