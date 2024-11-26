import { CardHeader } from "@nextui-org/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React from "react";

export default function BitsoWidgetHeader() {
  return (
    <CardHeader className="flex flex-col items-end p-0 gap-2">
      <ConnectButton showBalance={false} />
      <a
        href="https://bitso.com/"
        target="_blank"
        className="block self-center"
      >
        <Image
          src="/bitso.png"
          alt="Next.js logo"
          width={100}
          height={100}
          priority
        />
      </a>
    </CardHeader>
  );
}
