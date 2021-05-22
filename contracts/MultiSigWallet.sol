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
        bool exectued;
    }

    Transaction[] transactions;

    constructor() {}
}
