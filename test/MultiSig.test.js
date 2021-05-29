const { expect } = require("chai");

let wallet1, wallet2, wallet3, wallet4, wallet5
let signerAddresses
let MultiSigContract
let MultiSigInstance

describe("Multi Sig Tests", function () {
    beforeEach(async () => {
        [wallet1, wallet2, wallet3, wallet4, wallet5] = await ethers.getSigners();
        signerAddresses = [wallet1.address, wallet2.address, wallet3.address, wallet4.address, wallet5.address]
        MultiSigContract = await ethers.getContractFactory("MultiSigWallet");
        MultiSigInstance = await MultiSigContract.deploy(signerAddresses, 3);
    })
    it("MultiSig deploys correctly with expected config", async () => {
        let wallets = await MultiSigInstance.getOwners()
        console.log(wallets, signerAddresses);
    });
    it("MultiSig can accept ETH", async () => {

    });
    it("getOwners() returns owner addresses correctly", async () => {

    });
    it("getTransactionCount() returns transaction count correctly", async () => {
        
    });
    it("getTransaction() returns a transaction correctly", async () => {
        
    });
    it("A signer can SUBMIT a tx", async () => {

    });
    it("A non-signer CANNOT SUBMIT a tx", async () => {

    });
    it("Signers can CONFIRM a submitted tx", async () => {

    });
    it("A non-signer CANNOT CONFIRM a submitted tx", async () => {

    });
    it("Signers can REVOKE a confirmation", async () => {

    });
    it("A non-signer CANNOT REVOKE a confirmation", async () => {

    });
    it("A signer can EXECUTE a confirmed tx", async () => {

    });
    it("A signer CANNOT EXECUTE an unconfirmed tx", async () => {

    });
    it("A non-signer CANNOT EXECUTE an confirmed tx", async () => {

    });
    it("A signer CANNOT EXECUTE a confirmed, then unconfirmed tx", async () => {

    });
});
