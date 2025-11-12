const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountsController');

// Accounts
router.get('/', controller.getAllAccounts);
router.post('/', controller.createAccount);
router.get('/:id', controller.getAccountById);
router.put('/:id', controller.replaceAccount);
router.patch('/:id', controller.updateAccount);
router.delete('/:id', controller.deleteAccount);

// Transaction
router.post('/:id/deposit', controller.deposit);
router.post('/:id/withdraw', controller.withdraw);
router.post('/:id/transfer', controller.transfer);
router.get('/:id/transactions', controller.getTransactionsForAccount);

module.exports = router;