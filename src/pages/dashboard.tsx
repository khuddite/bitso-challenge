import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";
import Image from "next/image";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../constants/abi";
import { KHUDDITE_TOKEN_ADDRESS } from "../constants/token";
import { formatUnits } from "viem";
import { Button } from "@nextui-org/button";
import { SendIcon } from "../icons/SendIcon";
import BitsoWidget from "../components/dashboard/BitsoWidget";
const Dashboard: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div>
      <main className={styles.main}>
        <BitsoWidget />
      </main>
    </div>
  );
};

export default Dashboard;
