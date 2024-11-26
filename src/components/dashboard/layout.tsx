import { Card, CardBody } from "@nextui-org/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import DashboardLayoutFooter from "./layoutFooter";
import DashboardLayoutHeader from "./layoutHeader";

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
        className="w-[360px] h-[680px] p-2 flex flex-col justify-between"
        radius="lg"
        isFooterBlurred
      >
        <DashboardLayoutHeader />
        <CardBody>{children}</CardBody>
        <DashboardLayoutFooter />
      </Card>
    </div>
  );
}
