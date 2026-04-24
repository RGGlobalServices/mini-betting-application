import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceDisplayProps {
  balance: number;
  lastResult: 'win' | 'lose' | null;
  amountChanged: string | null;
  showWallet: boolean;
  setShowWallet: (show: boolean) => void;
}

export default function BalanceDisplay({
  balance,
  lastResult,
  amountChanged,
  showWallet,
  setShowWallet,
}: BalanceDisplayProps) {
  return (
    <div className="relative mb-8 rounded-2xl border border-zinc-800/50 bg-zinc-800/20 p-6 text-center">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={() => setShowWallet(!showWallet)}
          className="flex items-center justify-center rounded-full bg-zinc-800 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <Wallet className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Current Balance
      </p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-zinc-400">$</span>
        <motion.span
          key={balance}
          initial={{
            scale: 1.2,
            color: lastResult === 'win' ? '#34d399' : lastResult === 'lose' ? '#f87171' : '#f4f4f5',
          }}
          animate={{ scale: 1, color: '#f4f4f5' }}
          className="text-5xl font-bold tracking-tight text-zinc-100"
        >
          {balance.toLocaleString()}
        </motion.span>
      </div>

      <AnimatePresence>
        {amountChanged && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              'absolute right-4 top-4 text-sm font-semibold',
              lastResult === 'win' ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {amountChanged}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
