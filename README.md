# Multi-Sig Wallet
A simple multi-sig smart contract wallet

## Contract Tests
```
··········································|····························|·············|······························     
|  Methods                                                                                                         │     
···················|······················|··············|·············|·············|···············|··············     
|  Contract        ·  Method              ·  Min         ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │     
···················|······················|··············|·············|·············|···············|··············     
|  MultiSigWallet  ·  confirmTransaction  ·       58009  ·      75109  ·      64849  ·           20  ·          -  │     
···················|······················|··············|·············|·············|···············|··············     
|  MultiSigWallet  ·  executeTransaction  ·       66341  ·      74173  ·      71185  ·            3  ·          -  │     
···················|······················|··············|·············|·············|···············|··············     
|  MultiSigWallet  ·  revokeConfirmation  ·       20437  ·      25874  ·      23156  ·            2  ·          -  │     
···················|······················|··············|·············|·············|···············|··············     
|  MultiSigWallet  ·  submitTransaction   ·      108237  ·     148017  ·     128621  ·           15  ·          -  │     
···················|······················|··············|·············|·············|···············|··············     
|  TestContract    ·  callMe              ·           -  ·          -  ·      43953  ·            1  ·          -  │     
···················|······················|··············|·············|·············|···············|··············     
|  Deployments                            ·                                          ·  % of limit   ·             │     
··········································|··············|·············|·············|···············|··············     
|  MultiSigWallet                         ·           -  ·          -  ·    1905071  ·       15.3 %  ·          -  │     
··········································|··············|·············|·············|···············|··············     
|  TestContract                           ·           -  ·          -  ·     240644  ·        1.9 %  ·          -  │     
·-----------------------------------------|--------------|-------------|-------------|---------------|-------------·     

  17 passing (4s)
```

### Multi Sig Tests

✅ MultiSig deploys correctly with expected config (50ms)

✅ getOwners() returns owner addresses correctly

✅ getTransactionCount() returns transaction count correctly (94ms)

✅ getTransaction() returns a transaction correctly

✅ MultiSig can accept ETH

✅ A signer can SUBMIT a tx

✅ A non-signer cannot SUBMIT a tx (43ms)

✅ Signers can CONFIRM a submitted tx (51ms)

✅ A non-signer cannot CONFIRM a submitted tx (56ms)

✅ Signers can REVOKE a confirmation (105ms)

✅ A non-signer cannot REVOKE a confirmation

✅ A signer can EXECUTE a confirmed tx (97ms)

✅ A signer cannot EXECUTE an unconfirmed tx (62ms)

✅ A non-signer cannot EXECUTE a confirmed tx (73ms)

✅ A signer cannot EXECUTE a confirmed, then REVOKED tx (87ms)

✅ An executed tx can send ETH to an address (132ms)

✅ An executed tx can call a function on another contract (100ms)

