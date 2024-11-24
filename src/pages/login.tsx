import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const router = useRouter();

  const { status } = useSession();

  if (status === "authenticated") {
    router.replace("/dashboard");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Bitso Token Manager</title>
        <meta content="Generated by Khuddite" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <Image
          className="self-center dark:invert"
          src="/bitso.png"
          alt="Next.js logo"
          width={180}
          height={180}
          priority
        />
        <h1 className={styles.title}>Welcome to Bitso Token Manager!</h1>

        <p className={styles.description}>
          Get started by connecting your wallet
        </p>

        <ConnectButton />
      </main>
    </div>
  );
};

export default Home;
