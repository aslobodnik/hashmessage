// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {SignatureChecker} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/SignatureChecker.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

//todo: decide if i need sign the reveal message -- i think yes

contract HashTruth {
    struct Record {
        uint id;
        string message; //blank until revealed
        string msgHashSha256; //store sha256 hash as this is commonly used
        address msgAuthor;
        address msgRevealor;
        bytes msgHashSignature; //signature of the sha256 hash as string without 0x prefix
    }

    event RecordAdded(
        uint indexed id,
        string msgHashSha256,
        address indexed msgAuthor,
        bytes msgHashSignature
    );
    event RevealMsg(
        uint indexed id,
        string message,
        address indexed msgRevealor
    );

    Record[] public records;
    uint public nextRecordId;

    function addRecord(
        string memory _msgHashSha256,
        bytes memory _msgHashSignature
    ) public {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                Strings.toString(bytes(_msgHashSha256).length),
                _msgHashSha256
            )
        ); //

        // Require that the signer is the same as the message sender
        require(
            SignatureChecker.isValidSignatureNow(
                msg.sender,
                digest,
                _msgHashSignature
            ),
            "Invalid signature."
        );

        records.push(
            Record(
                nextRecordId,
                "", // Initially empty message
                _msgHashSha256,
                msg.sender, //msgAuthor
                address(0), //msgRevealor
                _msgHashSignature
            )
        );
        emit RecordAdded(
            nextRecordId,
            _msgHashSha256,
            msg.sender,
            _msgHashSignature
        );
        nextRecordId++;
    }

    function revealMsg(string memory _message, uint _recordId) public {
        require(_recordId < records.length, "Record does not exist.");
        Record storage record = records[_recordId];

        // Ensure the message for this record hasn't been revealed yet
        require(
            record.msgRevealor == address(0),
            "Message has already been revealed."
        );

        // Convert string to bytes and hash the message using SHA-256
        string memory _msgHashSha256 = hashString(_message);

        if (Strings.equal(_msgHashSha256, record.msgHashSha256)) {
            record.msgRevealor = msg.sender;
            record.message = _message;
            emit RevealMsg(_recordId, _message, msg.sender);
        } else {
            revert("Hash mismatch.");
        }
    }

    function getRecordsCount() public view returns (uint) {
        return records.length;
    }

    function hashString(
        string memory _message
    ) internal pure returns (string memory) {
        return bytes32ToString(sha256(abi.encodePacked(_message)));
    }

    function bytes32ToString(
        bytes32 _bytes
    ) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64); // Length of a hex string for bytes32 is 64 characters

        for (uint256 i = 0; i < 32; i++) {
            str[i * 2] = alphabet[uint8(_bytes[i] >> 4)];
            str[1 + i * 2] = alphabet[uint8(_bytes[i] & 0x0F)];
        }

        return string(str);
    }
}
// forge create --rpc-url 127.0.0.1:8545 --private-key $private_key src/HashTruth.sol:HashTruth
// cast send $contract "addRecord(string,bytes)" "a441b15fe9a3cf56661190a0b93b9dec7d04127288cc87250967cf3b52894d11" "0xae961c134edb319a9be449988365796bb2c4916d855a1133be91c3c1220b6fcf6777e28dce7e69576fe2289bdd96581365e5dafd2d7d6868a347f01fa9e0dd9a1b"  --private-key $private_key
// cast call $contract "records(uint256)" 0
