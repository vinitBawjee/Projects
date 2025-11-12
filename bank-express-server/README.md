# Bank API - Quick Postman Examples


Base URL: `http://localhost:3000/api/accounts`


1. Create account (POST)
- POST /api/accounts
- Body (JSON): { "name": "Vinit", "balance": 1000 }


2. Get all accounts (GET)
- GET /api/accounts


3. Get account by id (GET)
- GET /api/accounts/:id


4. Deposit (POST)
- POST /api/accounts/:id/deposit
- Body: { "amount": 500 }


5. Withdraw (POST)
- POST /api/accounts/:id/withdraw
- Body: { "amount": 200 }


6. Transfer (POST)
- POST /api/accounts/:id/transfer
- Body: { "to": "<target-account-id>", "amount": 100 }


7. Get transactions (GET)
- GET /api/accounts/:id/transactions


8. Update account (PUT / PATCH)
- PUT requires full replacement: { "name": "New", "balance": 50 }
- PATCH partial: { "name": "NewName" }