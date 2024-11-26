import { useState } from "react";
import { Address } from "viem";
import ConfirmTransactionForm from "../components/dashboard/forms/confirmTransactionForm";
import SendTransactionForm from "../components/dashboard/forms/sendTransactionForm";
import DashboardLayout from "../components/dashboard/layout";
import { NextPageWithLayout } from "./_app";

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
