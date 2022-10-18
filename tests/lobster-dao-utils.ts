import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  SetBaseURI,
  SetChainlinkConfig,
  SetDefaultURI,
  SetMinter,
  SetRandomSeed,
  Transfer
} from "../generated/LobsterDAO/LobsterDAO"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSetBaseURIEvent(baseURI: string): SetBaseURI {
  let setBaseUriEvent = changetype<SetBaseURI>(newMockEvent())

  setBaseUriEvent.parameters = new Array()

  setBaseUriEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )

  return setBaseUriEvent
}

export function createSetChainlinkConfigEvent(
  chainlinkFee: BigInt,
  chainlinkHash: Bytes
): SetChainlinkConfig {
  let setChainlinkConfigEvent = changetype<SetChainlinkConfig>(newMockEvent())

  setChainlinkConfigEvent.parameters = new Array()

  setChainlinkConfigEvent.parameters.push(
    new ethereum.EventParam(
      "chainlinkFee",
      ethereum.Value.fromUnsignedBigInt(chainlinkFee)
    )
  )
  setChainlinkConfigEvent.parameters.push(
    new ethereum.EventParam(
      "chainlinkHash",
      ethereum.Value.fromFixedBytes(chainlinkHash)
    )
  )

  return setChainlinkConfigEvent
}

export function createSetDefaultURIEvent(defaultURI: string): SetDefaultURI {
  let setDefaultUriEvent = changetype<SetDefaultURI>(newMockEvent())

  setDefaultUriEvent.parameters = new Array()

  setDefaultUriEvent.parameters.push(
    new ethereum.EventParam("defaultURI", ethereum.Value.fromString(defaultURI))
  )

  return setDefaultUriEvent
}

export function createSetMinterEvent(minter: Address): SetMinter {
  let setMinterEvent = changetype<SetMinter>(newMockEvent())

  setMinterEvent.parameters = new Array()

  setMinterEvent.parameters.push(
    new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter))
  )

  return setMinterEvent
}

export function createSetRandomSeedEvent(
  seed: BigInt,
  requestId: Bytes
): SetRandomSeed {
  let setRandomSeedEvent = changetype<SetRandomSeed>(newMockEvent())

  setRandomSeedEvent.parameters = new Array()

  setRandomSeedEvent.parameters.push(
    new ethereum.EventParam("seed", ethereum.Value.fromUnsignedBigInt(seed))
  )
  setRandomSeedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )

  return setRandomSeedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
