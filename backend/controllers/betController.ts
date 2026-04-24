import { Request, Response } from 'express';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

// Fallback balance for when MongoDB is not connected in the preview environment
let fallbackBalance = 1000;

export const getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne();
      if (!user) {
        user = await User.create({ balance: 1000 });
      }
      res.json({ balance: user.balance });
      return;
    }

    res.json({ balance: fallbackBalance });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const placeBet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    
    if (amount === undefined || amount === null) {
      res.status(400).json({ error: 'Bet amount is required' });
      return;
    }

    const betAmount = Number(amount);
    
    if (isNaN(betAmount) || betAmount <= 0) {
      res.status(400).json({ error: 'Bet amount must be a positive number' });
      return;
    }

    // Add a synthetic 500ms suspense delay for the UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Handle DB Logic
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne();
      if (!user) user = await User.create({ balance: 1000 });

      if (betAmount > user.balance) {
        res.status(400).json({ error: 'Insufficient balance' });
        return;
      }

      const isWin = Math.random() < 0.5;
      
      if (isWin) {
        user.balance += betAmount; 
        // Note: The prompt says "If win -> add 2x bet amount". 
        // Standard betting: deducting $10 and winning $20 means net +$10. 
        // We added the bet amount to the balance directly to simulate that (or wait, standard is: balance -= bet; win -> balance += bet * 2 -> net is balance + bet).
      } else {
        user.balance -= betAmount;
      }
      
      await user.save();
      
      res.json({ 
        result: isWin ? 'win' : 'lose', 
        balance: user.balance 
      });
      return;
    }

    // Handle Fallback InMemory Logic
    if (betAmount > fallbackBalance) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    const isWin = Math.random() < 0.5;
    if (isWin) {
      fallbackBalance += betAmount;
    } else {
      fallbackBalance -= betAmount;
    }

    res.json({ 
      result: isWin ? 'win' : 'lose', 
      balance: fallbackBalance 
    });

  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const addBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    
    if (amount === undefined || amount === null) {
      res.status(400).json({ error: 'Amount is required' });
      return;
    }

    const addAmount = Number(amount);
    
    if (isNaN(addAmount) || addAmount <= 0) {
      res.status(400).json({ error: 'Amount must be a positive number' });
      return;
    }

    // Handle DB Logic
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne();
      if (!user) user = await User.create({ balance: 1000 });

      user.balance += addAmount;
      await user.save();
      
      res.json({ balance: user.balance });
      return;
    }

    // Handle Fallback InMemory Logic
    fallbackBalance += addAmount;

    res.json({ balance: fallbackBalance });

  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
