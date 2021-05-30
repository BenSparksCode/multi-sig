// import { ethers } from "hardhat";
const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Wallets 1-5 are multisig signers
// Wallet 6 is random pleb - not part of multisig
let wallet1, wallet2, wallet3, wallet4, wallet5, wallet6
let signerAddresses
let MultiSigContract
let MultiSigInstance
let TestContract
let TestInstance


describe("Multi Sig Tests", function () {
    beforeEach(async () => {
        [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6] = await ethers.getSigners();
        signerAddresses = [wallet1.address, wallet2.address, wallet3.address, wallet4.address, wallet5.address]
        MultiSigContract = await ethers.getContractFactory("MultiSigWallet");
        MultiSigInstance = await MultiSigContract.deploy(signerAddresses, 3);
        TestContract = await ethers.getContractFactory("TestContract");
        TestInstance = await TestContract.deploy();
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
        expect(await MultiSigInstance.getTransactionCount()).to.equal(0)
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("0x0"))
        expect(await MultiSigInstance.getTransactionCount()).to.equal(1)
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("0x0"))
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("0x0"))
        expect(await MultiSigInstance.getTransactionCount()).to.equal(3)
    });
    it("getTransaction() returns a transaction correctly", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 12, ethers.utils.formatBytes32String("Oi bruv"))
        let txRes = await MultiSigInstance.getTransaction(0)

        expect(txRes.to).to.equal(wallet6.address)
        expect(txRes.value).to.equal(12)
        expect(txRes.data).to.equal(ethers.utils.formatBytes32String("Oi bruv"))
        expect(txRes.executed).to.equal(false)
        expect(txRes.numConfirmations).to.equal(0)
    });
    it("MultiSig can accept ETH", async () => {
        expect(await ethers.provider.getBalance(MultiSigInstance.address)).to.equal(0)
        await wallet1.sendTransaction({
            to: MultiSigInstance.address,
            value: ethers.utils.parseEther("1.0")
        })
        expect(await ethers.provider.getBalance(MultiSigInstance.address)).to.equal(ethers.utils.parseEther("1.0"))
    });
    it("A signer can SUBMIT a tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 2, ethers.utils.formatBytes32String("submit Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)

        expect(txRes.to).to.equal(wallet6.address)
        expect(txRes.value).to.equal(2)
        expect(txRes.data).to.equal(ethers.utils.formatBytes32String("submit Tx"))
        expect(txRes.executed).to.equal(false)
        expect(txRes.numConfirmations).to.equal(0)
    });
    it("A non-signer cannot SUBMIT a tx", async () => {
        await expect(
            MultiSigInstance.connect(wallet6).submitTransaction(wallet6.address, 2, ethers.utils.formatBytes32String("submit Tx"))
        ).to.be.revertedWith("not owner")
    });
    it("Signers can CONFIRM a submitted tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("confirm Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)

        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(1))

        await MultiSigInstance.connect(wallet3).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(2))
    });
    it("A non-signer cannot CONFIRM a submitted tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("confirm Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)

        await expect(
            MultiSigInstance.connect(wallet6).confirmTransaction(0)
        ).to.be.revertedWith("not owner")
    });
    it("Signers can REVOKE a confirmation", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("confirm Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallet 2 confirms
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(1))
        // wallet 2 revokes conf
        await MultiSigInstance.connect(wallet2).revokeConfirmation(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(0))
    });
    it("A non-signer cannot REVOKE a confirmation", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("confirm Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)

        await expect(
            MultiSigInstance.connect(wallet6).revokeConfirmation(0)
        ).to.be.revertedWith("not owner")
    });
    it("A signer can EXECUTE a confirmed tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("execute Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 - 3 confirm tx
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        await MultiSigInstance.connect(wallet3).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(3))
        // wallet 4 executes tx
        await MultiSigInstance.connect(wallet4).executeTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.to).to.equal(wallet6.address)
        expect(txRes.value).to.equal(0)
        expect(txRes.data).to.equal(ethers.utils.formatBytes32String("execute Tx"))
        expect(txRes.executed).to.equal(true)
        expect(txRes.numConfirmations).to.equal(3)
    });
    it("A signer cannot EXECUTE an unconfirmed tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("execute Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 and 2 confirm tx - not enough
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(2))
        // wallet 4 executes tx
        await expect(
            MultiSigInstance.connect(wallet4).executeTransaction(0)
        ).to.be.revertedWith("Not enough confirmations")
    });
    it("A non-signer cannot EXECUTE a confirmed tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("execute Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 and 2 confirm tx - not enough
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        await MultiSigInstance.connect(wallet3).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(3))
        // wallet 4 executes tx
        await expect(
            MultiSigInstance.connect(wallet6).executeTransaction(0)
        ).to.be.revertedWith("not owner")
    });
    it("A signer cannot EXECUTE a confirmed, then REVOKED tx", async () => {
        await MultiSigInstance.connect(wallet1).submitTransaction(wallet6.address, 0, ethers.utils.formatBytes32String("execute Tx"))
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 and 2 confirm tx - not enough
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        await MultiSigInstance.connect(wallet3).confirmTransaction(0)

        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(3))
        // wallet 3 revokes confirmation
        await MultiSigInstance.connect(wallet3).revokeConfirmation(0)
        // wallet 4 executes tx
        await expect(
            MultiSigInstance.connect(wallet4).executeTransaction(0)
        ).to.be.revertedWith("Not enough confirmations")
    });
    it("An executed tx can send ETH to an address", async () => {
        let wallet6Bal = await ethers.provider.getBalance(wallet6.address)
        expect(await ethers.provider.getBalance(MultiSigInstance.address)).to.equal(0)
        await wallet1.sendTransaction({
            to: MultiSigInstance.address,
            value: ethers.utils.parseEther("1.1")
        })
        expect(await ethers.provider.getBalance(MultiSigInstance.address)).to.equal(ethers.utils.parseEther("1.1"))
        await MultiSigInstance.connect(wallet1).submitTransaction(
            wallet6.address,
            ethers.utils.parseEther("1.0"),
            ethers.utils.formatBytes32String("Enjoy the 1 ETH ser")
        )
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 - 3 confirm tx
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        await MultiSigInstance.connect(wallet3).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(3))
        // wallet 4 executes tx
        await MultiSigInstance.connect(wallet4).executeTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.to).to.equal(wallet6.address)
        expect(txRes.value).to.equal(ethers.utils.parseEther("1.0"))
        expect(txRes.data).to.equal(ethers.utils.formatBytes32String("Enjoy the 1 ETH ser"))
        expect(txRes.executed).to.equal(true)
        expect(txRes.numConfirmations).to.equal(3)
        expect(await ethers.provider.getBalance(MultiSigInstance.address)).to.equal(ethers.utils.parseEther("0.1"))
        expect(await ethers.provider.getBalance(wallet6.address)).to.equal(ethers.utils.parseEther("1.0").add(wallet6Bal))
    });
    it("An executed tx can call a function on another contract", async () => {
        // Check test contract int adding works
        expect(await TestInstance.i()).to.equal(0)
        await TestInstance.callMe(5)
        expect(await TestInstance.i()).to.equal(BigNumber.from(5))
        // Start the process of calling the Test contract from multisig
        // Goal: call callme() to add 6 to i(5) so i = 11
        await MultiSigInstance.connect(wallet1).submitTransaction(
            TestInstance.address,
            0,
            TestInstance.interface.encodeFunctionData("callMe",[6])
        )
        let txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(0)
        // wallets 1 - 3 confirm tx
        await MultiSigInstance.connect(wallet1).confirmTransaction(0)
        await MultiSigInstance.connect(wallet2).confirmTransaction(0)
        await MultiSigInstance.connect(wallet3).confirmTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.numConfirmations).to.equal(BigNumber.from(3))
        // wallet 4 executes tx
        await MultiSigInstance.connect(wallet4).executeTransaction(0)
        txRes = await MultiSigInstance.getTransaction(0)
        expect(txRes.to).to.equal(TestInstance.address)
        expect(txRes.value).to.equal(0)
        expect(txRes.data).to.equal(await TestInstance.getData(6))
        expect(txRes.executed).to.equal(true)
        expect(txRes.numConfirmations).to.equal(3)
        expect(await TestInstance.i()).to.equal(BigNumber.from(11))
    });
});
