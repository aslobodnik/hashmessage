// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";
import {Testifi} from "../src/Testifi.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

contract TestifiTest is Test {
    Testifi testifi;

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
        bytes msgHashSignature,
        uint indexed bounty
    );
    event RevealAndClaimBounty(
        uint indexed id,
        string message,
        address indexed msgRevealor,
        uint indexed bounty
    );

    function setUp() public {
        testifi = new Testifi();
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
        testifi.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
    }

    function testFailDupeHashRecord() public {
        vm.prank(user1);
        testifi.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        testifi.addRecord(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();
    }

    function testValidateAddRecord() public {
        vm.prank(user1);
        testifi.addRecord(
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
            bytes memory msgHashSignature,
            uint bounty
        ) = testifi.records(0);

        assertEq(id, 0);
        assertEq(message, ""); //message is blank until revealed
        assertEq(
            msgHashSha256,
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        ); //sha256("test")
        assertEq(msgAuthor, user1); // msgAuthor is the user1
        assertEq(msgRevealor, address(0)); // msgRevealor is blank until revealed
        assertEq(msgHashSignature, signature);
        assertEq(bounty, 0); // Bounty should be 0
    }

    function testRevealAndClaimBounty() public {
        // Initial Ether balances
        uint initialUser2Balance = user2.balance;

        // Adding a record with a bounty
        vm.prank(user1);
        vm.deal(user1, 1 ether);
        testifi.addRecord{value: 1 ether}(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            signature
        );
        vm.stopPrank();

        // Revealing and claiming the bounty
        string memory testMessage = "test";
        string memory testHash = hashString(testMessage);
        vm.prank(user2);
        testifi.revealAndClaimBounty(testMessage, 0);
        vm.stopPrank();

        // Deconstruct the struct fields from the getter
        (
            uint id,
            string memory message,
            string memory msgHashSha256,
            address msgAuthor,
            address msgRevealor,
            bytes memory msgHashSignature,
            uint bounty
        ) = testifi.records(0);

        // Assertions
        assertEq(id, 0);
        assertEq(message, testMessage);
        assertEq(msgHashSha256, testHash);
        assertEq(msgAuthor, user1); // msgAuthor is user1
        assertEq(msgRevealor, user2); // msgRevealor is user2
        assertEq(msgHashSignature, signature); // msgHashSignature is the same
        assertEq(bounty, 0); // Bounty should be 0 after claimed
        assertEq(user2.balance, initialUser2Balance + 1 ether); // Check if user2 received the bounty
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
// with 3 events to index not sure how to test this with foundry
//     function testEmitRecordAdded() public {
//         vm.expectEmit(true, false, true, false, true);
//         emit RecordAdded(
//             0,
//             "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
//             user1,
//             signature,
//             0
//         );
//         vm.prank(user1);
//         testifi.addRecord(
//             "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
//             signature
//         );
//         vm.stopPrank();
//     }

//     function testEmitRevealAndClaimBounty() public {
//         vm.prank(user1);
//         testifi.addRecord(
//             "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
//             signature
//         );
//         vm.stopPrank();
//         vm.prank(user2);
//         vm.expectEmit(true, false, true, true);
//         emit RevealAndClaimBounty(0, "test", user2);

//         testifi.revealAndClaimBounty("test", 0);
//         vm.stopPrank();
//     }
// }
