"use client";

import React, { useState, useCallback } from "react";
import WatchlistButton from "@/components/WatchlistButton";
import Link from "next/link";

type Item = { symbol: string; company: string };

export default function WatchlistList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems || []);

  const handleChange = useCallback((symbol: string, isAdded: boolean) => {
    setItems((prev) => {
      if (isAdded) {
        const exists = prev.some((i) => i.symbol === symbol);
        return exists ? prev : [...prev, { symbol, company: symbol }];
      }
      return prev.filter((i) => i.symbol !== symbol);
    });
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 p-6 text-center text-sm text-gray-400 bg-[#0b0b0b]">
        Your watchlist is empty. Use the Search to add stocks or browse symbols.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800 rounded-lg border border-gray-800 overflow-hidden bg-[#0b0b0b]">
      {items.map((item) => (
        <div key={item.symbol} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href={`/stocks/${item.symbol}`} className="font-medium text-gray-200 hover:text-yellow-400">
              {item.symbol}
            </Link>
            <span className="text-sm text-gray-400">{item.company}</span>
          </div>
          <WatchlistButton
            symbol={item.symbol}
            company={item.company}
            isInWatchlist={true}
            showTrashIcon={true}
            onWatchlistChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
}
