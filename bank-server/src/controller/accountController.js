const { readData, writeData } = require('../util/dataStore');
const { v4: uuidv4 } = require('uuid');

// Hepler
function findAccount(data, id) {
    return data.accounts.find(a => a.id === id);
}

exports.getAllAccounts = (req, res) => {
    const data = readData();
    res.json(data.accounts);
}

exports.createAccount = (req, res, next) => {
    try {
        const { name, balance } = req.body;
        if(!name) return res.status(400).json({error: 'Name is Required!'});
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
    } catch(err) { next(err); }
}

exports.getAccountById = (req, res) => {
    const data = readData();
    const account = findAccount(data, req.params.id);
    if(!account) return res.status(404).json({ error: 'Account Not Found!'});
    res.json(account);
}

exports.replaceAccount = (req, res) => {
    const data = readData();
    const idx = data.accounts.findIndex(a => a.id === req.params.id);
    if(idx === -1) return res.status(404).json({ error: 'Account Not Found!'});

    const { name, balance } = req.body;
    if(!name || typeof balance !== 'number') {
        return res.status(400).json({ error: 'name and numeric balance are required for PUT' });
    }; 

    const updated = {
        id: req.params.id,
        name,
        balance,
        createdAt: data.accounts[idx].createdAt,
        updatedAt: new Date().toISOString
    };
    data.accounts[idx] = updated;
    writeData(data);
    res.json(updated);
}