import { NextPageWithLayout } from "./_app";
import DashboardLayout from "../components/dashboard/layout";
import SendTransactionForm from "../components/dashboard/sendTransactionForm";
import { useState } from "react";
import ConfirmTransactionForm from "../components/dashboard/confirmTransactionForm";
import { Address } from "viem";

export type TransactionDetail = {
  to: Address;
  value: string;
};

const Dashboard: NextPageWithLayout = () => {
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionDetail | undefined
  >(undefined);

  const handleSubmitTransaction = (data: TransactionDetail) => {
    setTransactionDetails(data);
  };

  const handleCancelTransaction = () => {
    setTransactionDetails(undefined);
  };

  return !transactionDetails ? (
    <SendTransactionForm onSubmit={handleSubmitTransaction} />
  ) : (
    <ConfirmTransactionForm
      onCancel={handleCancelTransaction}
      transactionDetails={transactionDetails}
    />
  );
};

Dashboard.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
