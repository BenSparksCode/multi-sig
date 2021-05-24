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

    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx doesn't exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(
            !isConfirmed[_txIndex][msg.sender],
            "sender already confirmed this tx"
        );
        _;
    }

    constructor(address[] memory _owners, uint256 _numConfirmations) {
        require(_owners.length > 0, "Need at least 1 owner");
        require(
            _numConfirmations > 0 && _numConfirmations < _owners.length,
            "Need fewer confs than owners"
        );

        for(uint i = 0; i < _owners.length; i++){
            address owner = _owners[i];
            require(owner != address(0), "Owner can't be 0 address");
            require(!isOwner[owner], "Owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmations;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction() public {}

    function confirmTransaction() public {}

    function executeTransaction() public {}

    function revokeConfirmation() public {}

    function getOwners() public view returns (uint256) {}

    function getTransactionCount() public view returns (uint256) {}

    function getTransaction()
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {}
}
