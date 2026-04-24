import { Router } from 'express';
import { getBalance, placeBet, addBalance } from '../controllers/betController.js';

const router = Router();

router.get('/balance', getBalance);
router.post('/place-bet', placeBet);
router.post('/add-balance', addBalance);

export default router;
