const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { readData, writeData } = require('../utils/datastore');
const { v4: uuidv4 } = require('uuid');

// Helper
function findAccount(data, id) {
    return data.accounts.find(a => a.id === id);
}

exports.getAllAccounts = async (req, res) => {
    // const data = readData();
    // res.json(data.accounts);
    const accounts = await Account.find();
    res.json(accounts);
};

exports.createAccount = async (req, res, next) => {
    try {
        const { name, balance } = req.body;
        if(!name) return res.status(400).json({ error: 'Name is required'});
        // const data = readData();
        // const account = {
        //     id: uuidv4(),
        //     name,
        //     balance: typeof balance === 'number' ? balance : 0,
        //     createdAt: new Date().toISOString()
        // };
        // data.accounts.push(account);
        // writeData(data);  

        const account = await Account.create({
            name,
            balance: typeof balance === "number" ? balance : 0
        });
        res.status(201).json(account);
    } catch (err) { next(err); }
}

exports.getAccountById = async (req, res) => {
    // const data = readData();
    // const account = findAccount(data, req.params.id);
    const account = await Account.findById(req.params.id);
    if(!account) return res.status(404).json({ error: 'Account not found '});
    res.json(account);
}


// PUT = full replace
exports.replaceAccount = async (req, res) => {
    // const data = readData();
    // const idx = data.accounts.findIndex(a => a.id === req.params.id);
    // if (idx === -1) return res.status(404).json({ error: 'Account not found' });
    
    const { name, balance } = req.body;
    if (!name || typeof balance !== 'number') {
        return res.status(400).json({ error: 'name and numeric balance are required for PUT' });
    }
    
    // const updated = {
    //     id: req.params.id,
    //     name,
    //     balance,
    //     createdAt: data.accounts[idx].createdAt,
    //     updatedAt: new Date().toISOString()
    // };
    // data.accounts[idx] = updated;
    // writeData(data);
    // res.json(updated);

    const updated = await Account.findByIdAndUpdate(
        req.params.id,
        {
            name,
            balance,
            updatedAt: new Date()
        },
        { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Account not found" });

    res.json(updated);
};


// PATCH = partial update
exports.updateAccount = async (req, res) => {
    // const data = readData();
    // const account = findAccount(data, req.params.id);
    // if (!account) return res.status(404).json({ error: 'Account not found' });
    
    // const { name } = req.body;
    // if (name) account.name = name;
    // account.updatedAt = new Date().toISOString();
    // writeData(data);
    // res.json(account);

    const updated = await Account.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Account not found" });

    res.json(updated);
};
    
exports.deleteAccount = async (req, res) => {
    // const data = readData();
    // const idx = data.accounts.findIndex(a => a.id === req.params.id);
    // if (idx === -1) return res.status(404).json({ error: 'Account not found' });
    // data.accounts.splice(idx, 1);
    // // Also remove transactions related to this account
    // data.transactions = data.transactions.filter(t => t.from !== req.params.id && t.to !== req.params.id);
    // writeData(data);
    // res.status(204).send();

    const acc = await Account.findByIdAndDelete(req.params.id);
    if (!acc) return res.status(404).json({ error: "Account not found" });

    await Transaction.deleteMany({
        $or: [{ from: acc._id }, { to: acc._id }]
    });

    res.status(204).send();
};


// Deposit
exports.deposit = async (req, res) => {
    // const data = readData();
    // const account = findAccount(data, req.params.id);
    // if (!account) return res.status(404).json({ error: 'Account not found' });
    
    // const { amount } = req.body;
    // if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    
    // account.balance += amount;
    // const tx = { id: uuidv4(), type: 'deposit', to: account.id, amount, date: new Date().toISOString() };
    // data.transactions.push(tx);
    // writeData(data);
    // res.json({ account, tx });


    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0)
        return res.status(400).json({ error: "Invalid amount" });

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    account.balance += amount;
    await account.save();

    const tx = await Transaction.create({
        type: "deposit",
        to: account._id,
        amount
    });

    res.json({ account, tx });
};


// Withdraw
exports.withdraw = async (req, res) => {
    // const data = readData();
    // const account = findAccount(data, req.params.id);
    // if (!account) return res.status(404).json({ error: 'Account not found' });
    
    // const { amount } = req.body;
    // if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    // if (account.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
        
    // account.balance -= amount;
    // const tx = { id: uuidv4(), type: 'withdraw', from: account.id, amount, date: new Date().toISOString() };
    // data.transactions.push(tx);
    // writeData(data);
    // res.json({ account, tx });


    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0)
        return res.status(400).json({ error: "Invalid amount" });

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    if (account.balance < amount)
        return res.status(400).json({ error: "Insufficient funds" });

    account.balance -= amount;
    await account.save();

    const tx = await Transaction.create({
        type: "withdraw",
        from: account._id,
        amount
    });

    res.json({ account, tx });
};


// Transfer from :id to targetAccountId (body: { to, amount })
exports.transfer = async (req, res) => {
    // const data = readData();
    // const fromAccount = findAccount(data, req.params.id);
    // if (!fromAccount) return res.status(404).json({ error: 'Source account not found' });
    
    // const { to, amount } = req.body;
    // if (!to || typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'to and positive amount required' });
    // const toAccount = findAccount(data, to);
    // if (!toAccount) return res.status(404).json({ error: 'Destination account not found' });
    // if (fromAccount.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    
    // fromAccount.balance -= amount;
    // toAccount.balance += amount;
    
    // const tx = { id: uuidv4(), type: 'transfer', from: fromAccount.id, to: toAccount.id, amount, date: new Date().toISOString() };
    // data.transactions.push(tx);
    // writeData(data);
    // res.json({ from: fromAccount, to: toAccount, tx });


    const { to, amount } = req.body;

    if (!to || typeof amount !== "number" || amount <= 0)
        return res.status(400).json({ error: "Invalid input" });

    const fromAccount = await Account.findById(req.params.id);
    const toAccount = await Account.findById(to);

    if (!fromAccount) return res.status(404).json({ error: "Sender not found" });
    if (!toAccount) return res.status(404).json({ error: "Receiver not found" });

    if (fromAccount.balance < amount)
        return res.status(400).json({ error: "Insufficient funds" });

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    const tx = await Transaction.create({
        type: "transfer",
        from: fromAccount._id,
        to: toAccount._id,
        amount
    });

    res.json({ from: fromAccount, to: toAccount, tx });
};
      
exports.getTransactionsForAccount = async (req, res) => {
    // const data = readData();
    // const account = findAccount(data, req.params.id);
    // if (!account) return res.status(404).json({ error: 'Account not found' });
    
    // const txs = data.transactions.filter(t => t.from === account.id || t.to === account.id);
    // res.json(txs);


    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    const txs = await Transaction.find({
        $or: [
            { from: account._id },
            { to: account._id }
        ]
    });

    res.json(txs);
};