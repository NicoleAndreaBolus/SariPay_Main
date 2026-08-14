import { Networks } from '@stellar/stellar-sdk';

export type StellarNetworkType = 'testnet' | 'mainnet';

export interface NetworkConfig {
  network: StellarNetworkType;
  networkPassphrase: string;
  horizonUrl: string;
  sorobanRpcUrl: string;
  contractId: string;
  explorerBaseUrl: string;
}

export const STELLAR_NETWORKS: Record<StellarNetworkType, NetworkConfig> = {
  testnet: {
    network: 'testnet',
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
    contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || 'CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU',
    explorerBaseUrl: 'https://stellar.expert/explorer/testnet',
  },
  mainnet: {
    network: 'mainnet',
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanRpcUrl: 'https://mainnet.sorobanrpc.com',
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || 'CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU',
    explorerBaseUrl: 'https://stellar.expert/explorer/public',
  },
};

export function getCurrentNetworkConfig(): NetworkConfig {
  const isMainnet = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet';
  return isMainnet ? STELLAR_NETWORKS.mainnet : STELLAR_NETWORKS.testnet;
}
