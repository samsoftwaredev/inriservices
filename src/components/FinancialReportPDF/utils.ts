import type {
  ReportTransaction,
  FinancialSummary,
  CategoryBreakdown,
} from "./types";

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateLong = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateFinancialSummary = (
  transactions: ReportTransaction[],
): FinancialSummary => {
  let totalRevenue = 0;
  let totalOperatingExpenses = 0;
  let totalCOGS = 0;
  let ownerContributions = 0;
  let ownerDraws = 0;
  let uncategorizedTotal = 0;

  transactions.forEach((tx) => {
    const amount = tx.amount / 100;

    if (!tx.category || tx.category.toLowerCase() === "uncategorized") {
      uncategorizedTotal += Math.abs(amount);
    }

    switch (tx.type) {
      case "revenue":
        totalRevenue += amount;
        break;
      case "cogs":
        totalCOGS += amount;
        break;
      case "expense":
        totalOperatingExpenses += amount;
        break;
      case "equity":
        if (amount < 0) {
          ownerDraws += amount;
        } else {
          ownerContributions += amount;
        }
        break;
    }
  });

  const netProfit = totalRevenue + totalCOGS + totalOperatingExpenses;

  return {
    totalRevenue,
    totalOperatingExpenses,
    totalCOGS,
    netProfit,
    ownerContributions,
    ownerDraws,
    transactionCount: transactions.length,
    uncategorizedTotal,
  };
};

export const getOperatingExpensesBreakdown = (
  transactions: ReportTransaction[],
): CategoryBreakdown[] => {
  const categoryMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((tx) => {
    if (tx.type !== "expense") return;

    const category = tx.category || "Uncategorized";
    const amount = Math.abs(tx.amount / 100);

    const existing = categoryMap.get(category) || { total: 0, count: 0 };
    categoryMap.set(category, {
      total: existing.total + amount,
      count: existing.count + 1,
    });
  });

  const totalExpenses = Array.from(categoryMap.values()).reduce(
    (sum, { total }) => sum + total,
    0,
  );

  return Array.from(categoryMap.entries())
    .map(([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getOwnerActivityBreakdown = (
  transactions: ReportTransaction[],
): {
  contributions: CategoryBreakdown[];
  draws: CategoryBreakdown[];
} => {
  const contributionsMap = new Map<string, { total: number; count: number }>();
  const drawsMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((tx) => {
    if (tx.type !== "equity") return;

    const category = tx.category || "Uncategorized";
    const amount = tx.amount / 100;

    if (amount > 0) {
      const existing = contributionsMap.get(category) || { total: 0, count: 0 };
      contributionsMap.set(category, {
        total: existing.total + amount,
        count: existing.count + 1,
      });
    } else {
      const existing = drawsMap.get(category) || { total: 0, count: 0 };
      drawsMap.set(category, {
        total: existing.total + Math.abs(amount),
        count: existing.count + 1,
      });
    }
  });

  const contributions = Array.from(contributionsMap.entries()).map(
    ([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: 0,
    }),
  );

  const draws = Array.from(drawsMap.entries()).map(
    ([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: 0,
    }),
  );

  return { contributions, draws };
};

export const getTransactionsWithReceipts = (
  transactions: ReportTransaction[],
): ReportTransaction[] => {
  return transactions
    .filter((tx) => tx.has_receipt)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

export const getTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case "revenue":
      return "Income";
    case "expense":
      return "Expense";
    case "cogs":
      return "Cost of Goods Sold";
    case "equity":
      return "Owner Activity";
    case "asset":
      return "Asset";
    case "liability":
      return "Liability";
    default:
      return type;
  }
};
