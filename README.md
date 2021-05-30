# Multi-Sig Wallet
A simple multi-sig smart contract wallet

## Contract Tests

17 / 17 Passing

Multi Sig Tests
- MultiSig deploys correctly with expected config (50ms)
- getOwners() returns owner addresses correctly
- getTransactionCount() returns transaction count correctly (94ms)
- getTransaction() returns a transaction correctly
- MultiSig can accept ETH
- A signer can SUBMIT a tx
- A non-signer cannot SUBMIT a tx (43ms)Signers can CONFIRM a submitted tx (51ms)
- A non-signer cannot CONFIRM a submitted tx (56ms)
- Signers can REVOKE a confirmation (105ms)
- A non-signer cannot REVOKE a confirmation
- A signer can EXECUTE a confirmed tx (97ms)
- A signer cannot EXECUTE an unconfirmed tx (62ms)
- A non-signer cannot EXECUTE a confirmed tx (73ms)
- A signer cannot EXECUTE a confirmed, then REVOKED tx (87ms)
- An executed tx can send ETH to an address (132ms)
- An executed tx can call a function on another contract (100ms)
