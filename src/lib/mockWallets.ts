import type { RouteResult } from '@/lib/api';

// ---------------------------------------------------------------------------
// Mock wallet definitions
// One sender (company HQ, holds USDC) + one recipient wallet per vendor region.
// Swap these addresses for real Crossmint wallet IDs when the integration is live.
// ---------------------------------------------------------------------------

export interface MockWallet {
  id: string;          // crossmint wallet identifier
  label: string;
  address: string;     // on-chain address (Base)
  currency: string;    // local fiat currency held
  countryCode: string;
  countryName: string;
  balance: number;     // in local currency units
}

export const SENDER_WALLET: MockWallet = {
  id: 'crossmint:company-hq-wallet',
  label: 'Company HQ (USDC)',
  address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  currency: 'USDC',
  countryCode: 'US',
  countryName: 'United States',
  balance: 500_000,
};

export const RECIPIENT_WALLETS: Record<string, MockWallet> = {
  AR: {
    id: 'crossmint:vendor-wallet-ar',
    label: 'DevCo Buenos Aires',
    address: '0xaa1122334455667788990011aabbccddeeff0011',
    currency: 'ARS',
    countryCode: 'AR',
    countryName: 'Argentina',
    balance: 1_200_000,
  },
  DE: {
    id: 'crossmint:vendor-wallet-de',
    label: 'Design Studio Berlin',
    address: '0xbb2233445566778899001122bbccddeeff001122',
    currency: 'EUR',
    countryCode: 'DE',
    countryName: 'Germany',
    balance: 18_500,
  },
  NG: {
    id: 'crossmint:vendor-wallet-ng',
    label: 'CloudOps Lagos',
    address: '0xcc3344556677889900112233ccddeeff00112233',
    currency: 'NGN',
    countryCode: 'NG',
    countryName: 'Nigeria',
    balance: 4_500_000,
  },
  GB: {
    id: 'crossmint:vendor-wallet-gb',
    label: 'Legal Counsel London',
    address: '0xdd4455667788990011223344ddeeff0011223344',
    currency: 'GBP',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    balance: 12_000,
  },
  JP: {
    id: 'crossmint:vendor-wallet-jp',
    label: 'Consulting Tokyo',
    address: '0xee5566778899001122334455eeff001122334455',
    currency: 'JPY',
    countryCode: 'JP',
    countryName: 'Japan',
    balance: 850_000,
  },
};

// FX rates matching invoices.ts
const FX_RATES: Record<string, number> = {
  ARS: 1065.50,
  EUR: 0.9215,
  NGN: 1520.00,
  GBP: 0.7892,
  JPY: 151.25,
  USDC: 1,
};

// ---------------------------------------------------------------------------
// Mock transfer engine
// ---------------------------------------------------------------------------

export interface MockTransfer {
  invoice_id: string;
  vendor: string;
  from_wallet: string;
  from_address: string;
  to_wallet: string;
  to_address: string;
  amount_usdc: number;
  amount_local: number;
  currency: string;
  country_code: string;
  tx_hash: string;
  network: string;
  status: 'CONFIRMED';
  timestamp: string;
}

export interface MockTransferResult {
  success: boolean;
  transfers: MockTransfer[];
  total_usdc_sent: number;
  remaining_sender_balance: number;
}

function randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateTxHash(): string {
  return `0x${randomHex(64)}`;
}

/** Resolves countryCode from a route by matching currency to the FX table */
function countryCodeFromRoute(route: RouteResult): string {
  // Try to match against RECIPIENT_WALLETS by country name
  const entry = Object.values(RECIPIENT_WALLETS).find(
    (w) => w.label.toLowerCase().includes(route.vendor.toLowerCase().split(' ')[0])
  );
  if (entry) return entry.countryCode;

  // Fallback: match currency to a known wallet
  const byFlag = Object.entries(RECIPIENT_WALLETS).find(
    ([, w]) => w.currency === route.country.toUpperCase()
  );
  return byFlag ? byFlag[0] : 'US';
}

/**
 * Simulates executing the batch of USDC transfers.
 * Deducts from sender balance, credits each recipient, returns per-tx receipts.
 *
 * To switch to real Crossmint: replace this function's body with the n8n webhook call.
 * The return shape (MockTransferResult) maps directly to what the real API should return.
 */
export function mockExecuteTransfers(routes: RouteResult[]): MockTransferResult {
  const now = new Date().toISOString();
  let senderBalance = SENDER_WALLET.balance;
  const transfers: MockTransfer[] = [];

  for (const route of routes) {
    // Find recipient wallet — match by currency code from the route country
    const currencyMap: Record<string, string> = {
      Argentina: 'AR',
      Germany: 'DE',
      Nigeria: 'NG',
      'United Kingdom': 'GB',
      Japan: 'JP',
    };
    const countryCode = currencyMap[route.country] ?? countryCodeFromRoute(route);
    const recipient = RECIPIENT_WALLETS[countryCode] ?? RECIPIENT_WALLETS['DE'];

    const amountUsdc = route.amount_usd; // 1:1 USDC peg
    const fxRate = FX_RATES[recipient.currency] ?? 1;
    const amountLocal = Math.round(amountUsdc * fxRate * 100) / 100;

    senderBalance -= amountUsdc;

    // Simulate brief per-tx timestamp spread (1-3s apart for realism)
    const txTime = new Date(Date.now() + transfers.length * 1500).toISOString();

    transfers.push({
      invoice_id: route.invoice_id,
      vendor: route.vendor,
      from_wallet: SENDER_WALLET.id,
      from_address: SENDER_WALLET.address,
      to_wallet: recipient.id,
      to_address: recipient.address,
      amount_usdc: amountUsdc,
      amount_local: amountLocal,
      currency: recipient.currency,
      country_code: countryCode,
      tx_hash: generateTxHash(),
      network: 'Base (Testnet)',
      status: 'CONFIRMED',
      timestamp: txTime,
    });
  }

  return {
    success: true,
    transfers,
    total_usdc_sent: routes.reduce((s, r) => s + r.amount_usd, 0),
    remaining_sender_balance: senderBalance,
  };
}
