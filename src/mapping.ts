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

  let saleId = event.transaction.hash
    .toHexString()
    .concat(":".concat(event.transactionLogIndex.toHexString()));

  // Load all entities

  let previousOwner = Owner.load(event.params.from.toHexString());
  let newOwner = Owner.load(event.params.to.toHexString());
  let token = Token.load(event.params.tokenId.toHexString());
  let sale = Sale.load(saleId);
  let contract = Contract.load(event.address.toHexString());
  let nftInstance = LobsterDAO.bind(event.address);

  if (!previousOwner) {
    log.info("Previous owner didnt exist as entity ", []);
    previousOwner = new Owner(event.params.from.toHexString());
    previousOwner.balance = BigInt.fromI32(0);
  } else {
    log.info("Previous owner existed as entity ", []);
    let prevBalance = previousOwner.balance;
    if (prevBalance && prevBalance > ZERO_BI) {
      previousOwner.balance = prevBalance.minus(ONE_BI);
    }
  }

  if (!newOwner) {
    log.info("New owner didnt exist as entity ", []);
    newOwner = new Owner(event.params.to.toHexString());
    newOwner.balance = ONE_BI;
  } else {
    log.info("New owner existed as entity ", []);
    let prevBalance = newOwner.balance;
    if (prevBalance !== null) {
      newOwner.balance = prevBalance.plus(ONE_BI);
    }
  }

  if (!token) {
    log.info("Token didnt exist as entity ", []);
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

  log.info("Lets find a sale... ", []);
  if (!sale) {
    log.info("Sale didnt exist as entity ", []);
    const logs = transactionReceipt.logs;
    log.info("Found {} log entries to process for tx #{}", [
      logs.length.toString(),
      event.transaction.hash.toHexString(),
    ]);
    logs.forEach((eventLog) => {});
    for (let logIndex = 0; logIndex < logs.length; logIndex++) {
      log.info("Processing index {} for tx #{}", [
        logIndex.toString(),
        event.transaction.hash.toHexString(),
      ]);
      const eventLog = logs[logIndex];
      const logAddress = eventLog.address.toHexString();
      const eventSignature = eventLog.topics[0].toHexString();

      // const receipt = event.receipt;
      // if (receipt) {
      //   const data = receipt.logs[logIndex].data;
      //   const decoded = ethereum.decode("(address,address,uint256)", data);
      //   const tuple = decoded!.toTuple();
      // }

      // for (
      //   let topicsIndex = 0;
      //   topicsIndex < eventLog.topics.length;
      //   topicsIndex++
      // ) {
      //   log.info("Topic iterated over : {}, for tx # {} ", [
      //     eventLog.topics[topicsIndex].toHexString(),
      //     event.transaction.hash.toHexString(),
      //   ]);
      // }

      // log.info("Topic being processed : {}, of type {} ", [
      //   eventSignature,
      //   typeof eventSignature,
      // ]);
      // log.info("ERC20 topic to match : {}, of type {} ", [
      //   ERC20TransferTopic,
      //   typeof ERC20TransferTopic,
      // ]);
      if (eventSignature == ERC20TransferTopic) {
        log.info("Found Transaction Event Topic", []);
        isErc20TokenTransfer = true;
        tokenContract = logAddress;

        let data = eventLog.topics;
        log.info(
          "Receipt data is available: {} for event signature {} for TX #{}",
          [
            data.toString(),
            eventSignature,
            event.transaction.hash.toHexString(),
          ]
        );
        let decoded = ethereum.decode("(address,address,uint256)", data[0]);
        if (decoded) {
          log.info("Decoded data in string form {}", [decoded.toString()]);
        }
        if (decoded) {
          let decodedTuple = decoded.toTuple();
          log.info("Decoded from address is: {} ", [
            decodedTuple[0].toAddress().toString(),
          ]);
          log.info("Decoded to address is: {} ", [
            decodedTuple[1].toAddress().toString(),
          ]);
          log.info("Decoded value is: {} ", [
            decodedTuple[2].toBigInt().toString(),
          ]);
          tokenAmount = decodedTuple[2].toBigInt();
        }
      } else {
        log.info("Didnt match any transaction. wtf? {}, {}, {} in tx# {}", [
          (eventSignature == ERC20TransferTopic).toString(),
          eventSignature,
          ERC20TransferTopic,
          event.transaction.hash.toHexString(),
        ]);
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
