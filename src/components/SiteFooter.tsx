import Link from "next/link";
import { ShieldMark } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(141,163,207,0.12)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <ShieldMark size={24} />
          <p className="text-sm text-ice-dim">
            KinShield — fraud defence for every Canadian family. Built in Canada,
            data resident in <span className="text-ice">ca-central-1</span>.
          </p>
        </div>
        <div className="mt-4 grid gap-2 text-xs text-ice-dim sm:grid-cols-2">
          <p>
            <span className="text-gold">Claims discipline:</span> this is a working
            reference build. The Trust Engine here uses a transparent rule corpus that
            seeds the production multilingual model. We never publish an accuracy number
            without its benchmark, date, and failure cases — see{" "}
            <Link href="/transparency" className="text-safe underline-offset-2 hover:underline">
              the calibration page
            </Link>
            .
          </p>
          <p className="sm:text-right">
            What&apos;s yours, we cannot read. What&apos;s the scammer&apos;s, we share to
            protect everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
