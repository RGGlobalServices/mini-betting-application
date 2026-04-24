import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coins, Loader2 } from 'lucide-react';
import { useBetting } from '@/hooks/useBetting';
import BalanceDisplay from './betting/BalanceDisplay';
import WalletTopUp from './betting/WalletTopUp';
import BetForm from './betting/BetForm';

export default function BettingTerminal() {
  const {
    balance,
    isLoading,
    isBetting,
    isDepositing,
    error,
    lastResult,
    amountChanged,
    handleDeposit,
    handlePlaceBet,
  } = useBetting();

  const [showWallet, setShowWallet] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 font-sans text-zinc-100">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-100">Mini Bettor</h1>
          <p className="text-sm text-zinc-400">Place your bets. 50/50 odds.</p>
        </div>

        <BalanceDisplay 
          balance={balance} 
          lastResult={lastResult} 
          amountChanged={amountChanged}
          showWallet={showWallet}
          setShowWallet={setShowWallet}
        />

        <WalletTopUp 
          showWallet={showWallet}
          isDepositing={isDepositing}
          isBetting={isBetting}
          onDeposit={handleDeposit}
          closeWallet={() => setShowWallet(false)}
        />

        <BetForm 
          balance={balance}
          isBetting={isBetting}
          error={error}
          lastResult={lastResult}
          onPlaceBet={handlePlaceBet}
        />
      </motion.div>
    </div>
  );
}
