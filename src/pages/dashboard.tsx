import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";

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
