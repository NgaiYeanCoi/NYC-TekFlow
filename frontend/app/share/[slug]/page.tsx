import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ShareGate } from "@/components/public/share-gate";
import { getShareMeta } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: token } = await params;
  const meta = await getShareMeta(token).catch(() => null);
  if (!meta) {
    notFound();
  }
  return (
    <PublicShell>
      <ShareGate token={token} meta={meta} />
    </PublicShell>
  );
}
