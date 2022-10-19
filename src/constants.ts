import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const ZERO_BI = BigInt.fromI32(0);
export const ZERO_BD = BigDecimal.fromString("0");

export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1");

// The format of an ERC20 transfer log is Transfer(address from, address to, uint256 value). When you take the keccak hash for Transfer(address,address,uint256), you get 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef for the topic
export const ERC20TransferTopic =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
