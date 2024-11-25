import { ConnectButton } from "@rainbow-me/rainbowkit";
import { stat } from "fs";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div>
      <ConnectButton />
      Bitso Token Manager Dashboard
    </div>
  );
};

export default Dashboard;
