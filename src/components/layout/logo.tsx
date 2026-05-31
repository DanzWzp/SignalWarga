import Link from "next/link";
import { RadioTower } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
      <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-white">
        <RadioTower className="size-5" />
      </span>
      <span>SignalWarga</span>
    </Link>
  );
}
