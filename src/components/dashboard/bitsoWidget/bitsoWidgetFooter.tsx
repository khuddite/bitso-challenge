import { CardFooter } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import React from "react";

export default function BitsoWidgetFooter() {
  return (
    <CardFooter className="bottom-1 justify-center border-1 rounded-full shadow-sm py-1">
      <p className="text-tiny">
        Made with ❤️ by{" "}
        <Link
          className="text-tiny text-blue-500"
          href="https://github.com/khuddite"
          target="_blank"
          underline="hover"
        >
          Jason Stroud
        </Link>
      </p>
    </CardFooter>
  );
}
