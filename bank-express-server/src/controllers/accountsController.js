const { readData, writeData } = require('../utils/datastore');
const { v4: uuidv4 } = require('uuid');


// Helper
function findAccount(data, id) {
    return data.accounts.find(a => a.id === id);
}

exports.getAllAccounts = (req, res) => {
    const data = readData();
    res.json(data.accounts);
};

exports.createAccount = (req, res, next) => {
    try {
        const { name, balance } = req.body;
        if(!name) return res.status(400).json({ error: 'Name is required'});
        const data = readData();
        const account = {
            id: uuidv4(),
            name,
            balance: typeof balance === 'number' ? balance : 0,
            createdAt: new Date().toISOString()
        };
        data.accounts.push(account);
        writeData(data);
        res.status(201).json(account);
    } catch (err) { next(err); }
}

exports.getAccountById = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if(!account) return res.status(404).json({ error: 'Account not found '});
    res.json(account);
}


// PUT = full replace
exports.replaceAccount = (req, res) => {
    const data = readData();
    const idx = data.accounts.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Account not found' });
    
    const { name, balance } = req.body;
    if (!name || typeof balance !== 'number') {
        return res.status(400).json({ error: 'name and numeric balance are required for PUT' });
    }
    
    const updated = {
        id: req.params.id,
        name,
        balance,
        createdAt: data.accounts[idx].createdAt,
        updatedAt: new Date().toISOString()
    };
    data.accounts[idx] = updated;
    writeData(data);
    res.json(updated);
};


// PATCH = partial update
exports.updateAccount = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    const { name } = req.body;
    if (name) account.name = name;
    account.updatedAt = new Date().toISOString();
    writeData(data);
    res.json(account);
};
    
exports.deleteAccount = (req, res) => {
    const data = readData();
    const idx = data.accounts.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Account not found' });
    data.accounts.splice(idx, 1);
    // Also remove transactions related to this account
    data.transactions = data.transactions.filter(t => t.from !== req.params.id && t.to !== req.params.id);
    writeData(data);
    res.status(204).send();
};


// Deposit
exports.deposit = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    
    account.balance += amount;
    const tx = { id: uuidv4(), type: 'deposit', to: account.id, amount, date: new Date().toISOString() };
    data.transactions.push(tx);
    writeData(data);
    res.json({ account, tx });
};


// Withdraw
exports.withdraw = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    if (account.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
        
    account.balance -= amount;
    const tx = { id: uuidv4(), type: 'withdraw', from: account.id, amount, date: new Date().toISOString() };
    data.transactions.push(tx);
    writeData(data);
    res.json({ account, tx });
};


// Transfer from :id to targetAccountId (body: { to, amount })
exports.transfer = (req, res) => {
    const data = readData();
    const fromAccount = findAccount(data, req.params.id);
    if (!fromAccount) return res.status(404).json({ error: 'Source account not found' });
    
    const { to, amount } = req.body;
    if (!to || typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'to and positive amount required' });
    const toAccount = findAccount(data, to);
    if (!toAccount) return res.status(404).json({ error: 'Destination account not found' });
    if (fromAccount.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    
    const tx = { id: uuidv4(), type: 'transfer', from: fromAccount.id, to: toAccount.id, amount, date: new Date().toISOString() };
    data.transactions.push(tx);
    writeData(data);
    res.json({ from: fromAccount, to: toAccount, tx });
};
      
exports.getTransactionsForAccount = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    const txs = data.transactions.filter(t => t.from === account.id || t.to === account.id);
    res.json(txs);
};