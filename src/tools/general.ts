import { PROFIT_MARGIN, TAX_RATE } from "@/constants";
import type { PostgrestError } from "@supabase/supabase-js";

export const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

export function assertOk<T>(
  res: { data: T | null; error: PostgrestError | null },
  msg?: string
): T {
  if (res.error) throw res.error;
  if (res.data == null) throw new Error(msg ?? "No data returned");
  return res.data;
}

export function formatPhoneNumber(phoneNumberString: string): string {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumberString;
}

export const calculateSubtotal = (
  labor: number,
  material: number,
  companyFee: number,
  companyProfit: number
) => {
  if (isNaN(labor)) labor = 0;
  if (isNaN(material)) material = 0;
  if (isNaN(companyFee)) companyFee = 0;
  if (isNaN(companyProfit)) companyProfit = 0;
  return labor + material + companyFee + companyProfit;
};

export const calculateTotal = (
  labor: number,
  material: number,
  companyFee: number,
  taxes: number,
  companyProfit: number
) => {
  if (isNaN(labor)) labor = 0;
  if (isNaN(material)) material = 0;
  if (isNaN(companyFee)) companyFee = 0;
  if (isNaN(taxes)) taxes = 0;
  if (isNaN(companyProfit)) companyProfit = 0;
  return labor + material + companyFee + taxes + companyProfit;
};

export const calculateTaxes = (subtotal: number) => {
  if (isNaN(subtotal)) subtotal = 0;
  return Math.round(subtotal * TAX_RATE);
};

export const calculateProfits = (labor: number, material: number) => {
  if (isNaN(labor)) labor = 0;
  if (isNaN(material)) material = 0;
  return Math.round((labor + material) * PROFIT_MARGIN);
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context = this;
    const later = () => {
      timeout = undefined;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
