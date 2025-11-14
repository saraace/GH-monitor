import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "../src/apollo-client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ViewerProvider, ThemeToggleProvider, useThemeToggle } from "../src/context";
import { AppLayout } from "../src/layout/AppLayout";

// Tell Font Awesome to skip auto-inserting CSS since we're importing it above
config.autoAddCss = false;

function AppContent(props: AppProps) {
  const { Component, pageProps } = props;
  const { theme } = useThemeToggle();

  return (
    <ThemeProvider theme={theme}>
      <ViewerProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ViewerProvider>
    </ThemeProvider>
  );
}

export default function MyApp(props: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AppCacheProvider {...props}>
        <Head>
          <title>PRs</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeToggleProvider>
          <AppContent {...props} />
        </ThemeToggleProvider>
      </AppCacheProvider>
    </ApolloProvider>
  );
}
