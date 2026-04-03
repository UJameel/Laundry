export interface Invoice {
  id: string;
  vendor: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
  amount: number;
  amountUSD: number;
  fxRate: number;
  localAmount: number;
  status: 'dirty' | 'analyzing' | 'clean' | 'executed';
  regionColor: string;
}

export interface RouteAnalysis {
  invoice: Invoice;
  bankCost: number;
  laundryCost: number;
  savings: number;
  savingsPercent: number;
  routeType: string;
}

export const invoices: Invoice[] = [
  {
    id: 'INV-2026-0401',
    vendor: 'DevCo Buenos Aires',
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    flag: '🇦🇷',
    currency: 'ARS',
    amount: 45000,
    amountUSD: 45000,
    fxRate: 1065.50,
    localAmount: 45000 * 1065.50,
    status: 'dirty',
    regionColor: 'hsl(217 91% 53%)',
  },
  {
    id: 'INV-2026-0402',
    vendor: 'Design Studio Berlin',
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    currency: 'EUR',
    amount: 62000,
    amountUSD: 62000,
    fxRate: 0.9215,
    localAmount: Math.round(62000 * 0.9215),
    status: 'dirty',
    regionColor: 'hsl(239 84% 67%)',
  },
  {
    id: 'INV-2026-0403',
    vendor: 'CloudOps Lagos',
    city: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    currency: 'NGN',
    amount: 28000,
    amountUSD: 28000,
    fxRate: 1520.00,
    localAmount: 28000 * 1520.00,
    status: 'dirty',
    regionColor: 'hsl(160 84% 39%)',
  },
  {
    id: 'INV-2026-0404',
    vendor: 'Legal Counsel London',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    currency: 'GBP',
    amount: 35000,
    amountUSD: 35000,
    fxRate: 0.7892,
    localAmount: Math.round(35000 * 0.7892),
    status: 'dirty',
    regionColor: 'hsl(0 84% 60%)',
  },
  {
    id: 'INV-2026-0405',
    vendor: 'Consulting Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    currency: 'JPY',
    amount: 37000,
    amountUSD: 37000,
    fxRate: 151.25,
    localAmount: Math.round(37000 * 151.25),
    status: 'dirty',
    regionColor: 'hsl(187 94% 43%)',
  },
];

export const totalAmount = invoices.reduce((sum, inv) => sum + inv.amountUSD, 0);

export const routeAnalyses: RouteAnalysis[] = [
  { invoice: invoices[0], bankCost: 2295, laundryCost: 450, savings: 1845, savingsPercent: 80, routeType: 'USDC Route' },
  { invoice: invoices[1], bankCost: 2480, laundryCost: 620, savings: 1860, savingsPercent: 75, routeType: 'USDC Route' },
  { invoice: invoices[2], bankCost: 1400, laundryCost: 280, savings: 1120, savingsPercent: 80, routeType: 'USDC Route' },
  { invoice: invoices[3], bankCost: 1050, laundryCost: 350, savings: 700, savingsPercent: 67, routeType: 'USDC Route' },
  { invoice: invoices[4], bankCost: 375, laundryCost: 370, savings: 5, savingsPercent: 1, routeType: 'USDC Route' },
];

export const totalBankCost = routeAnalyses.reduce((s, r) => s + r.bankCost, 0);
export const totalLaundryCost = routeAnalyses.reduce((s, r) => s + r.laundryCost, 0);
export const totalSavings = routeAnalyses.reduce((s, r) => s + r.savings, 0);
export const savingsPercent = Math.round((totalSavings / totalBankCost) * 100);
