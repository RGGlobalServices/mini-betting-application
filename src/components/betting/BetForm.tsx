import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BetFormProps {
  balance: number;
  isBetting: boolean;
  error: string | null;
  lastResult: 'win' | 'lose' | null;
  onPlaceBet: (amount: number) => Promise<void>;
}

export default function BetForm({
  balance,
  isBetting,
  error,
  lastResult,
  onPlaceBet,
}: BetFormProps) {
  const [betAmount, setBetAmount] = useState<string>('10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBet(Number(betAmount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="betAmount" className="text-xs font-medium text-zinc-400">
          Bet Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <input
            id="betAmount"
            type="number"
            min="1"
            step="1"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={isBetting}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-8 pr-4 text-lg font-medium text-white placeholder-zinc-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="0.00"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            <button
              type="button"
              onClick={() => setBetAmount((balance / 2).toString())}
              className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              Half
            </button>
            <button
              type="button"
              onClick={() => setBetAmount(balance.toString())}
              className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-rose-400"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}

        {lastResult && !error && !isBetting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'rounded-lg p-3 text-center text-sm font-medium',
              lastResult === 'win' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            )}
          >
            {lastResult === 'win' ? 'Winner! You doubled your bet.' : 'Tough luck. You lost the bet.'}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isBetting || balance <= 0 || !betAmount}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-600 py-3.5 font-medium text-white transition-all hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
      >
        {isBetting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-2">Place Bet</span>
        )}
      </button>
    </form>
  );
}
