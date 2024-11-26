import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import BitsoWidget from "../components/dashboard/bitsoWidget/bitsoWidget";
const Dashboard: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div className="h-screen flex justify-center items-center w-full">
      <BitsoWidget />
    </div>
  );
};

export default Dashboard;
