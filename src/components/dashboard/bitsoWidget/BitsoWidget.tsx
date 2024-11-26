import { Card } from "@nextui-org/react";
import DashboardLayoutFooter from "../layoutFooter";
import DashboardLayoutHeader from "../layoutHeader";
import SendTransactionForm from "../sendTransactionForm";

export default function BitsoWidget() {
  return (
    <Card
      className="w-[400px] h-[720px] align-middle p-2 flex flex-col justify-between"
      radius="lg"
      isFooterBlurred
    >
      <DashboardLayoutHeader />
      <SendTransactionForm />
      <DashboardLayoutFooter />
    </Card>
  );
}
