import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useBetting() {
  const [balance, setBalance] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBetting, setIsBetting] = useState<boolean>(false);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | null>(null);
  const [amountChanged, setAmountChanged] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await api.getBalance();
      setBalance(data.balance);
    } catch (err) {
      console.error('Failed to load balance', err);
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (amount: number) => {
    setError(null);
    if (isNaN(amount) || amount <= 0) {
      setError('Enter a valid deposit amount.');
      return false;
    }
    
    setIsDepositing(true);
    try {
      const data = await api.addBalance(amount);
      setBalance(data.balance);
      setAmountChanged(`+$${amount}`);
      setTimeout(() => setAmountChanged(null), 2000);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to deposit funds.');
      return false;
    } finally {
      setIsDepositing(false);
    }
  };

  const handlePlaceBet = async (amount: number) => {
    setError(null);
    setLastResult(null);
    
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
      const data = await api.placeBet(amount);
      setLastResult(data.result);
      setBalance(data.balance);
      setAmountChanged(data.result === 'win' ? `+$${amount}` : `-$${amount}`);
      setTimeout(() => setAmountChanged(null), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while placing bet.');
    } finally {
      setIsBetting(false);
    }
  };

  return {
    balance,
    isLoading,
    isBetting,
    isDepositing,
    error,
    lastResult,
    amountChanged,
    handleDeposit,
    handlePlaceBet,
    setBalance,
  };
}
