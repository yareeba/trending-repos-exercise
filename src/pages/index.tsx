import Head from "next/head";
import { Suspense } from "react";
import HomeLayout from "../layout/Home";

export default function Home() {
  return (
    <>
      <Head>
        <title>Github Trending Repositories</title>
        <meta
          name="description"
          content="app for discovering trending repositories on GitHub"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomeLayout />
      </main>
    </>
  );
}
