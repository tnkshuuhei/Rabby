import { CHAINS_ENUM } from '@debank/common';
import { createPersistStore } from 'background/utils';
import { isSameAddress } from 'background/utils';

interface IToken {
  symbol: string;
  decimals: number;
  id: string;
  chain: CHAINS_ENUM;
}

interface TokenServiceStore {
  tokens: IToken[];
}

class TokenService {
  store: TokenServiceStore = {
    tokens: [],
  };

  init = async () => {
    const storage = await createPersistStore<TokenServiceStore>({
      name: 'tokens',
      template: {
        tokens: [],
      },
    });
    this.store = storage || this.store;
  };

  addToken = (token: IToken) => {
    if (
      this.store.tokens.find(
        (t) => isSameAddress(t.id, token.id) && t.chain === token.chain
      )
    ) {
      throw 'Token exist';
    }
    this.store.tokens = [...this.store.tokens, token];
  };

  removeToken = (token: IToken) => {
    this.store.tokens = this.store.tokens.filter(
      (t) => !(isSameAddress(t.id, token.id) && token.chain === t.chain)
    );
  };

  getTokensByChain = (chain: CHAINS_ENUM) => {
    return this.store.tokens.filter((token) => token.chain === chain);
  };
}

export default new TokenService();
