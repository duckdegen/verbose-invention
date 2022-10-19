export class StableCoinConfig {
  static stableCoins: Set<string>;

  static config(): Set<string> {
    if (this.stableCoins == null) {
      this.stableCoins = new Set();
      this.stableCoins.add("0x6b175474e89094c44da98b954eedeac495271d0f"); // DAI
      this.stableCoins.add("0xe9e7cea3dedca5984780bafc599bd69add087d56"); // BUSD
      this.stableCoins.add("0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"); // USDC
      this.stableCoins.add("0x55d398326f99059ff775485246999027b3197955"); // USDT
    }

    return this.stableCoins;
  }
}

export class Erc20TokenConfig {
  static erc20Tokens: Set<string>;

  static config(): Set<string> {
    if (this.erc20Tokens == null) {
      this.erc20Tokens = new Set();
      this.erc20Tokens.add("0x2170ed0880ac9a755fd29b2688956bd959f933f8"); // WETH
    }

    return this.erc20Tokens;
  }
}
