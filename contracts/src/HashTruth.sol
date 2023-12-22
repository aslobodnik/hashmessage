// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {SignatureChecker} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/SignatureChecker.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

import "forge-std/console.sol";

contract HashTruth {
    struct Record {
        uint id;
        string message;
        bytes32 msgHash; //keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))
        address msgAuthor;
        address msgRevealor;
        bytes msgHashSignature;
    }

    Record[] public records;
    uint public nextRecordId;

    function addRecord(
        bytes32 _msgHash,
        bytes memory _msgHashSignature
    ) public {
        // Require that the signer is the same as the message sender
        require(
            SignatureChecker.isValidSignatureNow(
                msg.sender,
                _msgHash,
                _msgHashSignature
            ),
            "Invalid signature"
        );

        records.push(
            Record(
                nextRecordId,
                "", // Initially empty message
                _msgHash,
                msg.sender, //msgAuthor
                address(0), //msgRevealor
                _msgHashSignature
            )
        );
        nextRecordId++;
    }

    function revealMsg(string memory _message, uint _recordId) public {
        require(_recordId < records.length, "Record does not exist.");
        Record storage record = records[_recordId];

        // Check if the message has already been revealed
        require(
            record.msgRevealor == address(0),
            "Message has already been revealed."
        );
        console.log(_message, _recordId);
        bytes32 _msgHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                Strings.toString(bytes(_message).length),
                _message
            )
        );

        if (_msgHash == record.msgHash) {
            record.msgRevealor = msg.sender;
            record.message = _message;
        } else {
            revert("Hash mismatch.");
        }
    }

    function getRecordsCount() public view returns (uint) {
        return records.length;
    }
}
