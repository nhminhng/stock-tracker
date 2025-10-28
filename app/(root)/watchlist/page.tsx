import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import WatchlistList from "@/components/WatchlistList";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  await connectToDatabase();

  let items: { symbol: string; company: string }[] = [];
  if (userId) {
    const docs = await Watchlist.find({ userId }, { _id: 0, symbol: 1, company: 1 }).lean();
    items = (docs || []).map((d: any) => ({ symbol: String(d.symbol), company: String(d.company) }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-100">Your Watchlist</h1>
      </div>
      <WatchlistList initialItems={items} />
    </div>
  );
}
