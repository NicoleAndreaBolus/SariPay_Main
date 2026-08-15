import { 
  TransactionBuilder, 
  Horizon, 
  Networks, 
  Keypair, 
  Transaction,
  FeeBumpTransaction 
} from '@stellar/stellar-sdk';

export interface FeeSponsorshipConfig {
  sponsorPublicKey?: string;
  isGaslessEnabled: boolean;
  maxBaseFee: string; // in stroops, e.g. "200"
}

export const DEFAULT_FEE_SPONSOR_CONFIG: FeeSponsorshipConfig = {
  isGaslessEnabled: true,
  maxBaseFee: "500",
};

/**
 * Builds a Stellar Fee Bump Transaction (Fee Sponsorship).
 * Wraps an inner transaction signed by the merchant/distributor,
 * allowing the platform fee sponsor account to pay all gas fees.
 */
export function buildSponsoredFeeBumpTx(
  innerTx: Transaction,
  sponsorKeypair: Keypair,
  networkPassphrase: string = Networks.TESTNET
): FeeBumpTransaction {
  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    DEFAULT_FEE_SPONSOR_CONFIG.maxBaseFee,
    innerTx,
    networkPassphrase
  );

  feeBumpTx.sign(sponsorKeypair);
  return feeBumpTx;
}

/**
 * Helper to submit a sponsored transaction to Stellar Horizon/RPC
 */
export async function submitSponsoredTransaction(
  feeBumpTx: FeeBumpTransaction,
  horizonUrl: string = "https://horizon-testnet.stellar.org"
): Promise<Horizon.HorizonApi.SubmitTransactionResponse> {
  const server = new Horizon.Server(horizonUrl);
  return await server.submitTransaction(feeBumpTx);
}
