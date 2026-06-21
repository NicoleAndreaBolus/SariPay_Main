import { isConnected, getAddress, setAllowed } from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

/**
 * Polls for the presence of the Freighter extension to handle delayed injection.
 */
export async function awaitFreighterInjected(retries = 6, delayMs = 150): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const connected = await isConnected();
      const hasInjectedAPI = typeof window !== 'undefined' && (
        'stellarKeystore' in window || 
        'freighter' in window
      );
      if (connected || hasInjectedAPI) {
        return true;
      }
    } catch {
      // Ignore errors during check
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return false;
}

/**
 * Connects using the official Freighter API methods with explicit error management
 */
export async function connectFreighterWallet(): Promise<string> {
  // Wait for the script injection to complete
  const hasExtension = await awaitFreighterInjected();
  
  if (!hasExtension) {
    throw new Error(
      "Freighter wallet was not detected. Please ensure the extension is installed, enabled on this page, and unlocked."
    );
  }

  try {
    // 1. Request permission/authorization if not already allowed
    const isAllowedResult = await setAllowed();
    if (!isAllowedResult || !isAllowedResult.isAllowed) {
      throw new Error("User denied access to Freighter wallet.");
    }

    // 2. Fetch the address
    const result = await getAddress();
    if (!result || !result.address) {
      throw new Error(result?.error || "No address returned from Freighter wallet.");
    }
    
    return result.address;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errMessage || "Connection refused by the wallet extension.");
  }
}

export async function getLiveBalance(publicKey: string): Promise<string> {
  if (!publicKey) return "0.00";
  try {
    const accountDetails = await server.loadAccount(publicKey);
    const nativeAsset = accountDetails.balances.find(b => b.asset_type === 'native');
    return nativeAsset ? parseFloat(nativeAsset.balance).toFixed(2) : "0.00";
  } catch (error) {
    console.warn("Account balance fetch error:", error);
    return "0.00 (Unfunded)";
  }
}