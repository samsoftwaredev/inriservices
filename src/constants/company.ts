export const companyName = "INRI Paint & Wall LLC";
export const companySlogan = "Expert Painting & Drywall Repair";

export const companyPhoneFormatted = "(214) 400-1397";
export const companyPhone = "+12144001397";
export const companyEmail = "samuel@inripaintwall.com";
export const companyWebsiteURL = "https://inripaintwall.com";

export const companyStreetAddress = "5900 Balcones Drive, STE 100";
export const companyAddressLocality = "Austin";
export const companyAddressRegion = "TX";
export const companyPostalCode = "78731";
export const companyAddressCountry = "US";
export const companyFullAddress = `${companyStreetAddress}, ${companyAddressLocality}, ${companyAddressRegion} ${companyPostalCode}, ${companyAddressCountry}`;

export const TAX_RATE_PERCNT = 0.0825;
export const PROFIT_MARGIN_PERCNT = 0.2;

export const BUSINESS_OPERATION_FEES = {
  insurance: 25.0,
  paymentSystemFeeFixed: 2.0,
  phoneFee: 4.0,
  promotionFee: 50.0,
  hostWebsiteFee: 5.0,
  domainFee: 5.0,
  thirdPartySoftwareFee: 15.0,
  companyRegistrationFee: 10.0,
  estimateFee: 60.0,
} as const;

export const PRICING_CONFIG = {
  hoursRate: 40,
  costGallons: 65,
  profitMargin: 0.2,
  taxAmount: 0.0825,
  paymentFeeRate: 0.03,
  paymentFeeFixed: 2,
} as const;
