import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, AlertCircle, Loader2, Wallet, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BettingTerminal() {
  const [balance, setBalance] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<string>('10');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBetting, setIsBetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [lastResult, setLastResult] = useState<'win' | 'lose' | null>(null);
  const [amountChanged, setAmountChanged] = useState<string | null>(null);

  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Fetch initial balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data } = await axios.get('/api/balance');
        setBalance(data.balance);
      } catch (err) {
        console.error('Failed to load balance', err);
        setError('Failed to connect to the server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = Number(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Enter a valid deposit amount.');
      return;
    }
    
    setIsDepositing(true);
    try {
      const { data } = await axios.post('/api/add-balance', { amount });
      setBalance(data.balance);
      setAmountChanged(`+$${amount}`);
      setTimeout(() => setAmountChanged(null), 2000);
      setShowWallet(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to deposit funds.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLastResult(null);
    
    const amount = Number(betAmount);
    
    // Frontend Validation
    if (isNaN(amount) || amount <= 0) {
      setError('Enter a valid positive amount.');
      return;
    }
    if (amount > balance) {
      setError('Insufficient balance.');
      return;
    }
    
    setIsBetting(true);
    
    try {
      const { data } = await axios.post('/api/place-bet', { amount });
      
      setLastResult(data.result);
      setBalance(data.balance);
      setAmountChanged(data.result === 'win' ? `+$${amount}` : `-$${amount}`);
      
      // Clear changing label after animation
      setTimeout(() => setAmountChanged(null), 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while placing bet.');
    } finally {
      setIsBetting(false);
    }
  };

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

        {/* Balance Display */}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Balance</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-zinc-400">$</span>
            <motion.span 
              key={balance}
              initial={{ scale: 1.2, color: lastResult === 'win' ? '#34d399' : lastResult === 'lose' ? '#f87171' : '#f4f4f5' }}
              animate={{ scale: 1, color: '#f4f4f5' }}
              className="text-5xl font-bold tracking-tight text-zinc-100"
            >
              {balance.toLocaleString()}
            </motion.span>
          </div>

          {/* Floating win/loss indicator */}
          <AnimatePresence>
            {amountChanged && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -30, scale: 1 }}
                exit={{ opacity: 0, y: -50 }}
                className={cn(
                  "absolute right-4 top-4 text-sm font-semibold",
                  lastResult === 'win' ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {amountChanged}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Deposit/Wallet Form */}
        <AnimatePresence>
          {showWallet && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleDeposit} className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
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

        {/* Betting Form */}
        <form onSubmit={handlePlaceBet} className="space-y-4">
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
                  "rounded-lg p-3 text-center text-sm font-medium",
                  lastResult === 'win' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                )}
              >
                {lastResult === 'win' ? "Winner! You doubled your bet." : "Tough luck. You lost the bet."}
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
              <span className="relative z-10 flex items-center gap-2">
                Place Bet
              </span>
            )}
          </button>
        </form>
      </motion.div>

    </div>
  );
}
