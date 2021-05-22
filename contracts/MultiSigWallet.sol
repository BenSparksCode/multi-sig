//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract MultiSigWallet {
    address[] public owners;
    uint256 public numConfirmationsRequired;

    mapping(address => bool) public isOwner;
    // tx id => confirmer address => confirmed status
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        uint256 numConfirmations;
        bool executed;
    }

    Transaction[] transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex<transactions.length, "tx doesn't exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "sender already confirmed this tx");
        _;
    }

    constructor() {}
}
