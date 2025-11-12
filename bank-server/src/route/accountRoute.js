const express = require('express');
const accountController = require('../controller/accountController');

const router = express.Router();
// Account
router.get('/', accountController.getAllAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccountById);
router.put('/:id', accountController.replaceAccount);

// Transaction


module.exports = router;