import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Plus } from 'lucide-react';

interface WalletTopUpProps {
  showWallet: boolean;
  isDepositing: boolean;
  isBetting: boolean;
  onDeposit: (amount: number) => Promise<boolean>;
  closeWallet: () => void;
}

export default function WalletTopUp({
  showWallet,
  isDepositing,
  isBetting,
  onDeposit,
  closeWallet,
}: WalletTopUpProps) {
  const [depositAmount, setDepositAmount] = useState<string>('50');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onDeposit(Number(depositAmount));
    if (success) {
      closeWallet();
    }
  };

  return (
    <AnimatePresence>
      {showWallet && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          className="overflow-hidden"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5"
          >
            <label htmlFor="depositAmount" className="mb-2 block text-xs font-medium text-indigo-300">
              Top Up Wallet
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400/70">$</span>
                <input
                  id="depositAmount"
                  type="number"
                  min="1"
                  step="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={isDepositing || isBetting}
                  className="w-full rounded-lg border border-indigo-500/30 bg-zinc-950/50 py-2.5 pl-7 pr-3 text-sm font-medium text-white placeholder-zinc-600 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <button
                type="submit"
                disabled={isDepositing || isBetting}
                className="flex items-center justify-center rounded-lg bg-indigo-500 px-4 text-sm font-medium text-white transition-all hover:bg-indigo-400 disabled:opacity-50"
              >
                {isDepositing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
