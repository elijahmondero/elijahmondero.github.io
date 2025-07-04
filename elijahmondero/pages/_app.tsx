import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // @ts-ignore
      window.gtag('config', 'G-P05ETFHS5F', {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1];
                  if (theme === 'dark') {
                    document.body.className = 'dark-theme';
                  } else {
                    document.body.className = 'light-theme';
                  }
                } catch (e) {
                  document.body.className = 'light-theme';
                }
              })();
            `
          }}
        />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
