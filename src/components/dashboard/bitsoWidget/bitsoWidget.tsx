import { Card } from "@nextui-org/react";
import React from "react";
import BitsoWidgetHeader from "./bitsoWidgetHeader";
import BitsoWidgetBody from "./bitsoWidgetBody";
import BitsoWidgetFooter from "./bitsoWidgetFooter";

export default function BitsoWidget() {
  return (
    <Card
      className="w-[400px] h-[720px] align-middle p-2 flex flex-col justify-between"
      radius="lg"
      isFooterBlurred
    >
      <BitsoWidgetHeader />
      <BitsoWidgetBody />
      <BitsoWidgetFooter />
    </Card>
  );
}
