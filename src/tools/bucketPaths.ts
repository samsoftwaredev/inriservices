export const bucketPathForReceipt = ({
  companyId,
  year,
  transactionId,
  safeName,
}: {
  companyId: string;
  year: number;
  transactionId?: string | null;
  safeName?: string | null;
}) => {
  const timestamp = Date.now();
  if (!transactionId && !safeName) {
    return `${companyId}/${year}/receipts`;
  }
  if (!transactionId) {
    return `${companyId}/${year}/temp/${timestamp}-${safeName}`;
  }
  return `${companyId}/${year}/receipts/${transactionId}/${timestamp}-${safeName}`;
};
