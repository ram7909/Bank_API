import express from 'express'
import { deposit, userStatement, withdraw } from '../controller/transaction.js';
import { authenticate } from '../Middleware/auth.js';

const router = express.Router();

// Deposite
router.post('/deposit',authenticate,deposit)

// Withdraw
router.post('/withdraw',authenticate,withdraw)

// User Statement By Id
router.get('/statement/get/:id',authenticate,userStatement)


export default router