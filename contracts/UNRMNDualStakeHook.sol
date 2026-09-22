// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title UNRMNDualStakeHook
/// @notice Spec, not a live vault. Do not point a UI enable-flag at this file
///         until it is deployed, verified, and mapped in appConfig.
///
/// Intended v4 permissions (vanity-mined hook address bits):
///   beforeSwap | afterSwap | afterAddLiquidity | beforeRemoveLiquidity
///
/// Pair: $uNRMN + any Robinhood ERC-20 resolved at pool initialize.
/// Graduation: once cumulative ETH-equivalent reserve >= 9.99 ether,
/// beforeRemoveLiquidity reverts so LP cannot be pulled.
///
/// Desk inspection (src/services/hookInspection.ts) requires:
///   - bytecode present and not a known system address
///   - unrmn() returns the live $uNRMN token
///   - optional partner(), graduated(), graduationTargetWei()
///   - VITE_ENABLE_STAKING=true before any write path
interface IUNRMNDualStakeHook {
    function unrmn() external view returns (address);
    function partner() external view returns (address);
    function graduationTargetWei() external view returns (uint256);
    function raisedWei() external view returns (uint256);
    function graduated() external view returns (bool);
}

/// Placeholder so the repo carries the intended surface.
/// Replace body with a real IHooks implementation before any mainnet enable.
contract UNRMNDualStakeHook {
    address public immutable unrmn;
    address public partner;
    uint256 public constant graduationTargetWei = 9.99 ether;
    bool public graduated;

    error NotEnabled();
    error PartnerUnset();

    constructor(address unrmn_) {
        unrmn = unrmn_;
    }

    function setPartner(address partner_) external {
        if (partner != address(0)) revert NotEnabled();
        partner = partner_;
    }

    function stake(uint256, uint256) external payable {
        revert NotEnabled();
    }

    function raisedWei() external pure returns (uint256) {
        return 0;
    }
}
