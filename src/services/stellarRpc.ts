import { Horizon } from '@stellar/stellar-sdk';

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

export const horizonServer = new Horizon.Server(HORIZON_URL);

/**
 * Direct connection pool for Stellar Horizon and Soroban RPC endpoints
 */
export const stellarRpcPool = {
  getHorizonServer() {
    return horizonServer;
  },
  
  getSorobanRpcUrl() {
    return SOROBAN_RPC_URL;
  },

  async queryAccountDetails(publicKey: string) {
    try {
      return await horizonServer.loadAccount(publicKey);
    } catch (error) {
      console.error("Horizon network account query failed:", error);
      throw error;
    }
  }
};
