pragma solidity 0.8.4;

contract MultiSigWallet {

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        uint256 numConfirmations;
        bool exectued;
    }

    Transaction[] transactions;


    constructor() {
        
    }
    
}
