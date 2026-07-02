export const metadata = { title: "VraiShield — Offline" };

export default function OfflinePage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-5xl">🛡️</p>
        <h1 className="mt-3 text-2xl font-bold text-ice">You&apos;re offline</h1>
        <p className="mt-2 text-ice-dim">
          VraiShield&apos;s on-device checks still work, but live community intel and the map need a
          connection. Reconnect and try again.
        </p>
      </div>
    </div>
  );
}
