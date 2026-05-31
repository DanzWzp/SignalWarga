import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center"
      aria-label="SignalWarga"
    >
      <Image
        src="/signalwarga-horizontal.png"
        alt="SignalWarga"
        width={802}
        height={208}
        className="h-10 w-auto object-contain"
        priority
      />
      <span className="sr-only">SignalWarga</span>
    </Link>
  );
}
