// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {HashTruth} from "../src/HashTruth.sol";

contract HashTruthTest is Test {
    HashTruth hashTruth;

    function setUp() public {
        hashTruth = new HashTruth();
    }

    function testRevealMsg() public {
        // Add a record first
        bytes32 testHash = keccak256(abi.encodePacked("Test Message"));
        hashTruth.addRecord("signature1", testHash);

        // Reveal the message
        hashTruth.revealMsg("Test Message", 0);

        // Check if msgRevealor is set correctly
        (, , , , address msgRevealor, ) = hashTruth.records(0);
        assertEq(
            msgRevealor,
            address(this),
            "Revealor should be set correctly"
        );
    }
}
