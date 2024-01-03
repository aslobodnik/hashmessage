// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";
import {HashTruth} from "../src/HashTruth.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

contract HashTruthTest is Test {
    HashTruth hashTruth;

    uint256 internal privateKey1;
    uint256 internal privateKey2;
    address internal user1;
    address internal user2;
    bytes internal signature;
    string internal msgSha256;

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

    function setUp() public {
        hashTruth = new HashTruth();
        privateKey1 = 0xabc;
        privateKey2 = 0x123;
        user1 = vm.addr(privateKey1);
        user2 = vm.addr(privateKey2);
        msgSha256 = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; //sha256("test")

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                Strings.toString(bytes(msgSha256).length),
                msgSha256
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey1, digest);

        signature = abi.encodePacked(r, s, v);
    }

    function testAddRecord() public {
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
    }

    function testFailDupeHashRecord() public {
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
    }

    function testValidateAddRecord() public {
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();

        // Deconstruct the struct fields from the getter
        (
            uint id,
            string memory message,
            string memory msgHashSha256,
            address msgAuthor,
            address msgRevealor,
            bytes memory msgHashSignature
        ) = hashTruth.records(0);

        assertEq(id, 0);
        assertEq(message, ""); //message is blank until revealed
        assertEq(
            msgHashSha256,
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        ); //sha256("test")
        assertEq(msgAuthor, user1); // msgAuthor is the user1
        assertEq(msgRevealor, address(0)); // msgRevealor is blank until revealed
        assertEq(msgHashSignature, signature);
    }

    function testRevealMsg() public {
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
        vm.prank(user2);
        hashTruth.revealMsg("test", 0);
        vm.stopPrank();

        // Deconstruct the struct fields from the getter
        (
            uint id2,
            string memory message2,
            string memory msgHashSha2562,
            address msgAuthor2,
            address msgRevealor2,
            bytes memory msgHashSignature2
        ) = hashTruth.records(0);
        console.log("revealor", msgRevealor2);
        console.log("sender", msg.sender);

        assertEq(id2, 0);
        assertEq(message2, "test");
        assertEq(
            msgHashSha2562,
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        );
        assertEq(msgAuthor2, user1); // msgAuthor is the user1
        assertEq(msgRevealor2, user2); // msgRevealor is user2
        assertEq(msgHashSignature2, signature); // msgHashSignature is the same
    }

    function testEmitRecordAdded() public {
        vm.expectEmit(true, false, true, true);
        emit RecordAdded(
            0,
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            user1,
            signature
        );
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
    }

    function testEmitRevealMsg() public {
        vm.prank(user1);
        hashTruth.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
        vm.prank(user2);
        vm.expectEmit(true, false, true, true);
        emit RevealMsg(0, "test", user2);

        hashTruth.revealMsg("test", 0);
        vm.stopPrank();
    }
}
