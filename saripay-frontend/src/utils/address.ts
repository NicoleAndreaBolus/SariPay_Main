/**
 * Shortens a Stellar public key for display (e.g. GABC...XYZ)
 */
export function shortenAddress(address: string, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
