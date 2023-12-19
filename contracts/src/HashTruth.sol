// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract HashTruth {
    using ECDSA for bytes32;
    struct Record {
        uint id;
        string message;
        bytes32 msgHash;
        address msgAuthor;
        address msgRevealor;
        bytes msgSignature;
    }

    Record[] public records;
    uint public nextRecordId;

    function addRecord(bytes memory _msgSignature, bytes32 _msgHash) public {
        // Recover the signer from the signature and the message hash
        address recoveredSigner = recoverSigner(_msgHash, _msgSignature);

        // Require that the signer is the same as the message sender
        require(recoveredSigner == msg.sender, "Invalid signature");

        records.push(
            Record(
                nextRecordId,
                "", // Initially empty message
                _msgHash,
                msg.sender,
                address(0),
                _msgSignature
            )
        );
        nextRecordId++;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    function revealMsg(string memory _message, uint _recordId) public {
        require(_recordId < records.length, "Record does not exist.");
        Record storage record = records[_recordId];

        // Check if the message has already been revealed
        require(
            record.msgRevealor == address(0),
            "Message has already been revealed."
        );

        bytes32 hashedMessage = keccak256(abi.encodePacked(_message));

        if (hashedMessage == record.msgHash) {
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
