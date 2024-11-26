import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import BitsoWidgetFooter from "./bitsoWidget/bitsoWidgetFooter";
import BitsoWidgetHeader from "./bitsoWidget/bitsoWidgetHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  const { status } = useSession();
  const router = useRouter();

  // TODO: improve signout redirection logic
  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Card
        className="w-[400px] h-[720px] align-middle p-2 flex flex-col justify-between"
        radius="lg"
        isFooterBlurred
      >
        <BitsoWidgetHeader />
        <CardBody>{children}</CardBody>
        <BitsoWidgetFooter />
      </Card>
    </div>
  );
}
