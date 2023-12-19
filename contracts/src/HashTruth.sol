// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract HashTruth {
    struct Record {
        uint id;
        string message;
        bytes32 msgHash;
        address msgAuthor;
        address msgRevealor;
        string msgSignature;
    }

    Record[] public records;
    uint public nextRecordId;

    function addRecord(string memory _msgSignature, bytes32 _msgHash) public {
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
        bytes32 _hash,
        string memory _signature
    ) internal pure returns (address) {
        bytes memory signature = bytes(_signature);
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Split the signature into r, s and v variables
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature version");

        // The message hash that was signed is the keccak256 hash of the message
        return ecrecover(_hash, v, r, s);
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
