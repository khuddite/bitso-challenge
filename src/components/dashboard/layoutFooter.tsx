import { CardFooter } from "@nextui-org/card";
import { Link } from "@nextui-org/link";

export default function DashboardLayoutFooter() {
  return (
    <CardFooter className="justify-center py-1 rounded-full shadow-sm bottom-1 border-1">
      <p className="text-tiny">
        Made with ❤️ by{" "}
        <Link
          className="text-blue-500 text-tiny"
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
