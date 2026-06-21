/**
 * Utility functions for formatting amounts and decimals.
 */

/**
 * Formats a raw contract integer value (e.g. i128 representing stroops) to a decimal string
 */
export function fromStroops(stroops: string | number | bigint, decimals = 7): string {
  const value = BigInt(stroops);
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  // Pad the fractional part with leading zeros if necessary
  let fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  // Trim trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, '');
  
  return `${integerPart}.${fractionalStr}`;
}

/**
 * Converts a decimal string representation to raw contract integer (stroops)
 */
export function toStroops(amount: string | number, decimals = 7): bigint {
  const parts = amount.toString().split('.');
  const integerPart = parts[0] || '0';
  let fractionalPart = parts[1] || '';
  
  if (fractionalPart.length > decimals) {
    fractionalPart = fractionalPart.substring(0, decimals);
  } else {
    fractionalPart = fractionalPart.padEnd(decimals, '0');
  }
  
  return BigInt(integerPart) * BigInt(10 ** decimals) + BigInt(fractionalPart);
}

/**
 * Formats standard currency presentation (e.g. 10.00 XLM)
 */
export function formatCurrency(amount: string | number, decimals = 2): string {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return '0.00';
  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
