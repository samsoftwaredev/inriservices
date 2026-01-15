import { BUSINESS_OPERATION_FEES, PRICING_CONFIG } from "@/constants";
import {
  CostCalculation,
  DiscountConfig,
  RoomFeature,
} from "@/interfaces/laborTypes";

export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) {
    amount = 0;
  }
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const calculateTotalCompanyFees = (): number => {
  return Object.values(BUSINESS_OPERATION_FEES).reduce(
    (acc, fee) => acc + fee,
    0
  );
};

export const calculateDiscount = (
  subtotal: number,
  discount: DiscountConfig
): number => {
  if (discount.type === "percentage") {
    return (subtotal * discount.value) / 100;
  }
  return discount.value;
};

export const calculateCosts = (
  estimateItems: Array<{ cost: number }>,
  discount: DiscountConfig
): CostCalculation => {
  const subtotal = estimateItems.reduce((acc, item) => acc + item.cost, 0);
  const discountAmount = calculateDiscount(subtotal, discount);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const managementFeeTotal = calculateTotalCompanyFees();
  const profitAmount = totalAfterDiscount * PRICING_CONFIG.profitMargin;
  const totalWithProfit = totalAfterDiscount + profitAmount;
  const taxesToPay = totalWithProfit * PRICING_CONFIG.taxAmount;
  const paymentSystemFee =
    totalWithProfit * PRICING_CONFIG.paymentFeeRate +
    PRICING_CONFIG.paymentFeeFixed;
  const totalWithTaxes =
    managementFeeTotal + paymentSystemFee + totalWithProfit + taxesToPay;

  return {
    subtotal,
    discountAmount,
    totalAfterDiscount,
    profitAmount,
    totalWithProfit,
    taxesToPay,
    paymentSystemFee,
    managementFeeTotal,
    totalWithTaxes,
  };
};

export const validateDiscountValue = (
  value: number,
  type: DiscountConfig["type"],
  maxAmount: number
): number => {
  const maxValue = type === "percentage" ? 100 : maxAmount;
  return Math.max(0, Math.min(value, maxValue));
};

export const calculateFeatureCost = (feature: RoomFeature): number => {
  if (!feature.workLabor) return 0;
  return feature.workLabor.reduce((total, task) => {
    const laborCost = task.hours * task.rate;
    const materialCost =
      (feature.includeMaterialCosts === true &&
        task.laborMaterials?.reduce((matTotal, material) => {
          return matTotal + material.quantity * material.price;
        }, 0)) ||
      0;
    return total + laborCost + materialCost;
  }, 0);
};
