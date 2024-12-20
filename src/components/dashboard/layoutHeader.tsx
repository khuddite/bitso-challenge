import { CardHeader } from "@nextui-org/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function DashboardLayoutHeader() {
  return (
    <CardHeader className="flex flex-col items-end gap-2 p-0">
      <ConnectButton showBalance={false} />
      <a
        href="https://bitso.com/"
        target="_blank"
        className="self-center block"
      >
        <Image
          src="/bitso.png"
          alt="Bitso logo"
          width={120}
          height={120}
          priority
        />
      </a>
    </CardHeader>
  );
}
