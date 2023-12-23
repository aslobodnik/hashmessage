// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/Vm.sol";
import {HashTruth} from "../src/HashTruth.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

contract HashTruthTest is Test {
    HashTruth hashTruth;

    function setUp() public {
        hashTruth = new HashTruth();
    }
}
