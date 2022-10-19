import { log, ethereum, BigInt } from "@graphprotocol/graph-ts";

import {
  LobsterDAO,
  Transfer as TransferEvent,
} from "../generated/LobsterDAO/LobsterDAO";
import { Token, Owner, Contract, Sale } from "../generated/schema";
import { ERC20TransferTopic, ONE_BI, ZERO_BI } from "./constants";

export function handleTransfer(event: TransferEvent): void {
  const txHash = event.transaction.hash.toHex();

  const transactionReceipt = event.receipt;

  if (!transactionReceipt) {
    log.error("No transaction receipt found for Transfer event {}", [txHash]);
    return;
  }

  log.info("Transfer detected. From: {} | To: {} | TokenID: {}", [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.tokenId.toHexString(),
  ]);

  let previousOwner = Owner.load(event.params.from.toHexString());
  let newOwner = Owner.load(event.params.to.toHexString());
  let token = Token.load(event.params.tokenId.toHexString());

  let saleId = event.transaction.hash
    .toHexString()
    .concat(":".concat(event.transactionLogIndex.toHexString()));
  let sale = Sale.load(saleId);
  let contract = Contract.load(event.address.toHexString());
  let nftInstance = LobsterDAO.bind(event.address);

  if (previousOwner === null) {
    // Mint case
    log.info("Mint case detected", []);
    previousOwner = new Owner(event.params.from.toHexString());
    previousOwner.balance = BigInt.fromI32(0);
  } else {
    // Transfer case
    let prevBalance = previousOwner.balance;
    if (prevBalance && prevBalance > ZERO_BI) {
      previousOwner.balance = prevBalance.minus(ONE_BI);
    }
  }

  if (newOwner === null) {
    newOwner = new Owner(event.params.to.toHexString());
    newOwner.balance = ONE_BI;
    log.info("Burn case detected", []);
  } else {
    log.info("Previous balance", []);

    let prevBalance = newOwner.balance;
    if (prevBalance !== null) {
      newOwner.balance = prevBalance.plus(ONE_BI);
    }
  }

  if (token == null) {
    token = new Token(event.params.tokenId.toHexString());
    token.contract = event.address.toHexString();

    let uri = nftInstance.try_tokenURI(event.params.tokenId);
    if (!uri.reverted) {
      token.uri = uri.value;
    }
  }

  token.owner = event.params.to.toHexString();

  let tokenContract = "";
  let tokenAmount: BigInt = new BigInt(0);
  let isErc20TokenTransfer = false;

  if (sale == null) {
    const logs = transactionReceipt.logs;
    for (let logIndex = 0; logIndex < logs.length; logIndex++) {
      const eventLog = logs[logIndex];
      const logAddress = eventLog.address.toHexString();
      const eventSignature = eventLog.topics[0].toHexString();

      if (eventSignature === ERC20TransferTopic) {
        isErc20TokenTransfer = true;
        tokenContract = logAddress;
        let decoded = ethereum.decode(
          "(address,address,uint256)",
          eventLog.data
        );

        if (decoded !== null) {
          let decodedArray = decoded.toArray();
          if (
            decodedArray &&
            decodedArray !== null &&
            decodedArray[0] &&
            decodedArray[0] !== null
          ) {
            log.debug("Decoded from address is: {} ", [
              decodedArray[0].toAddress().toString(),
            ]);
            log.debug("Decoded to address is: {} ", [
              decodedArray[1].toAddress().toString(),
            ]);
            log.debug("Decoded value is: {} ", [
              decodedArray[2].toBigInt().toString(),
            ]);
            tokenAmount = decodedArray[2].toBigInt();
          }
        }
      }
    }

    sale = new Sale(saleId);
    sale.token = event.params.tokenId.toHexString();
    sale.from = event.params.from.toHexString();
    sale.to = event.params.to.toHexString();
    sale.timestamp = event.block.timestamp;
    sale.block = event.block.number;
    sale.transactionHash = event.transaction.hash.toHexString();
    sale.tokenAmount = tokenAmount;
    sale.tokenContract = tokenContract;
  }

  if (contract == null) {
    contract = new Contract(event.address.toHexString());
  }

  let name = nftInstance.try_name();
  if (!name.reverted) {
    contract.name = name.value;
  }

  let symbol = nftInstance.try_symbol();
  if (!symbol.reverted) {
    contract.symbol = symbol.value;
  }

  let totalSupply = nftInstance.try_totalSupply();
  if (!totalSupply.reverted) {
    contract.totalSupply = totalSupply.value;
  }

  previousOwner.save();
  newOwner.save();
  token.save();
  contract.save();
  sale.save();
}
