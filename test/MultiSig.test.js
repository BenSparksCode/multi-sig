const { expect } = require("chai");

// Wallets 1-5 are multisig signers
// Wallet 6 is random pleb - not part of multisig
let wallet1, wallet2, wallet3, wallet4, wallet5, wallet6
let signerAddresses
let MultiSigContract
let MultiSigInstance

describe("Multi Sig Tests", function () {
    beforeEach(async () => {
        [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6] = await ethers.getSigners();
        signerAddresses = [wallet1.address, wallet2.address, wallet3.address, wallet4.address, wallet5.address]
        MultiSigContract = await ethers.getContractFactory("MultiSigWallet");
        MultiSigInstance = await MultiSigContract.deploy(signerAddresses, 3);
    })
    it("MultiSig deploys correctly with expected config", async () => {
        let wallets = await MultiSigInstance.getOwners()
        // check getOwners returns the 5 signer wallets
        expect(wallets.length).to.equal(signerAddresses.length)
        expect(wallets.toString()).to.equal(signerAddresses.toString())
        // check numConfs needed = 3
        expect(await MultiSigInstance.numConfirmationsRequired()).to.equal(3)
        // check txCount = 0
        expect(await MultiSigInstance.getTransactionCount()).to.equal(0)
        // check each signer isOwner()
        expect(await MultiSigInstance.isOwner(wallet1.address)).to.equal(true)
        expect(await MultiSigInstance.isOwner(wallet2.address)).to.equal(true)
        expect(await MultiSigInstance.isOwner(wallet3.address)).to.equal(true)
        expect(await MultiSigInstance.isOwner(wallet4.address)).to.equal(true)
        expect(await MultiSigInstance.isOwner(wallet5.address)).to.equal(true)
        // check pleb wallet 6 is not owner
        expect(await MultiSigInstance.isOwner(wallet6.address)).to.equal(false)
    });
    it("getOwners() returns owner addresses correctly", async () => {
        let wallets = await MultiSigInstance.getOwners()
        expect(wallets.length).to.equal(signerAddresses.length)
        expect(wallets.toString()).to.equal(signerAddresses.toString())
    });
    it("getTransactionCount() returns transaction count correctly", async () => {
        expect(false).to.equal(true)
    });
    it("getTransaction() returns a transaction correctly", async () => {
        expect(false).to.equal(true)
    });
    it("MultiSig can accept ETH", async () => {
        expect(false).to.equal(true)
    });
    it("A signer can SUBMIT a tx", async () => {
        expect(false).to.equal(true)
    });
    it("A non-signer CANNOT SUBMIT a tx", async () => {
        expect(false).to.equal(true)
    });
    it("Signers can CONFIRM a submitted tx", async () => {
        expect(false).to.equal(true)
    });
    it("A non-signer CANNOT CONFIRM a submitted tx", async () => {
        expect(false).to.equal(true)
    });
    it("Signers can REVOKE a confirmation", async () => {
        expect(false).to.equal(true)
    });
    it("A non-signer CANNOT REVOKE a confirmation", async () => {
        expect(false).to.equal(true)
    });
    it("A signer can EXECUTE a confirmed tx", async () => {
        expect(false).to.equal(true)
    });
    it("A signer CANNOT EXECUTE an unconfirmed tx", async () => {
        expect(false).to.equal(true)
    });
    it("A non-signer CANNOT EXECUTE an confirmed tx", async () => {
        expect(false).to.equal(true)
    });
    it("A signer CANNOT EXECUTE a confirmed, then unconfirmed tx", async () => {
        expect(false).to.equal(true)
    });
});