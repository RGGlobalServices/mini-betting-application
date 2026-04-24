import axios from 'axios';

export const api = {
  getBalance: async () => {
    const { data } = await axios.get('/api/balance');
    return data;
  },
  placeBet: async (amount: number) => {
    const { data } = await axios.post('/api/place-bet', { amount });
    return data;
  },
  addBalance: async (amount: number) => {
    const { data } = await axios.post('/api/add-balance', { amount });
    return data;
  }
};
