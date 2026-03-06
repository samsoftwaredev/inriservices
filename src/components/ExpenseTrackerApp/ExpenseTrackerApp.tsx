import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import FilterListIcon from "@mui/icons-material/FilterList";
import LinkIcon from "@mui/icons-material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncIcon from "@mui/icons-material/Sync";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import WalletIcon from "@mui/icons-material/Wallet";

/**
 * Expense Tracker App (UI-only / client-side demo)
 * - React + TS + MUI + React Hook Form
 * - Screens: Dashboard, Transactions, Scan Receipt, Reports, Budgets, Accounts (bank linking)
 * - Complete flows per screen: add/edit/delete/filter transactions, receipt scanning -> confirm -> add,
 *   budgets create/manage, account linking wizard, reports timeframe toggle.
 *
 * Wire to backend (Plaid/Finicity, OCR service, DB) where marked.
 */

/* ----------------------- Types ----------------------- */

type AppRoute =
  | "dashboard"
  | "transactions"
  | "scan"
  | "reports"
  | "budgets"
  | "accounts";

type TxType = "expense" | "income";

type Category =
  | "Food"
  | "Transport"
  | "Groceries"
  | "Subscriptions"
  | "Shopping"
  | "Utilities"
  | "Freelance"
  | "Housing"
  | "Other";

type BudgetSystem = "Monarch" | "YNAB" | "Goodbudget";

type Transaction = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  merchant: string;
  category: Category;
  type: TxType;
  amount: number; // positive numeric value
  accountId?: string;
  notes?: string;
  source: "manual" | "receipt" | "bank";
};

type Account = {
  id: string;
  name: string; // "Chase Checking"
  institution: string; // "Chase"
  type: "checking" | "savings" | "credit";
  lastSyncISO?: string;
  isLinked: boolean;
  mask?: string; // "•••• 1234"
};

type Budget = {
  id: string;
  name: string; // "January Budget"
  system: BudgetSystem;
  period: "monthly";
  monthISO: string; // YYYY-MM
  lines: BudgetLine[];
};

type BudgetLine = {
  id: string;
  category: Category;
  limit: number; // monthly amount
};

/* ----------------------- Helpers ----------------------- */

const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Groceries",
  "Subscriptions",
  "Shopping",
  "Utilities",
  "Freelance",
  "Housing",
  "Other",
];

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function toMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toFixed(2)}`;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function monthISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatFriendlyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(transactions: Transaction[]) {
  const m = new Map<string, Transaction[]>();
  transactions.forEach((t) => {
    const key = t.dateISO;
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(t);
  });
  // sort keys desc
  return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function sumIncome(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
}

function sumExpenses(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
}

function calcBalance(transactions: Transaction[]) {
  return sumIncome(transactions) - sumExpenses(transactions);
}

function monthKeyFromISO(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

/* ----------------------- Seed Data ----------------------- */

const seedAccounts: Account[] = [
  {
    id: uid("acct"),
    name: "Chase Checking",
    institution: "Chase",
    type: "checking",
    isLinked: true,
    mask: "•••• 0421",
    lastSyncISO: todayISO(),
  },
  {
    id: uid("acct"),
    name: "Apple Card",
    institution: "Apple",
    type: "credit",
    isLinked: false,
    mask: "•••• 9988",
  },
];

const seedTransactions: Transaction[] = [
  {
    id: uid("tx"),
    dateISO: "2025-01-12",
    merchant: "Starbucks Coffee",
    category: "Food",
    type: "expense",
    amount: 5.75,
    source: "bank",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-11",
    merchant: "Uber Ride",
    category: "Transport",
    type: "expense",
    amount: 18.5,
    source: "bank",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-10",
    merchant: "Grocery Store",
    category: "Groceries",
    type: "expense",
    amount: 87.45,
    source: "bank",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-09",
    merchant: "Netflix Subscription",
    category: "Subscriptions",
    type: "expense",
    amount: 15.99,
    source: "bank",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-08",
    merchant: "Amazon Purchase",
    category: "Shopping",
    type: "expense",
    amount: 45.99,
    source: "bank",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-07",
    merchant: "Electric Bill",
    category: "Utilities",
    type: "expense",
    amount: 125.0,
    source: "manual",
  },
  {
    id: uid("tx"),
    dateISO: "2025-01-06",
    merchant: "Freelance Project",
    category: "Freelance",
    type: "income",
    amount: 750.0,
    source: "manual",
  },
];

const seedBudgets: Budget[] = [
  {
    id: uid("budget"),
    name: "January Budget",
    system: "Monarch",
    period: "monthly",
    monthISO: "2025-01",
    lines: [
      { id: uid("bl"), category: "Food", limit: 300 },
      { id: uid("bl"), category: "Groceries", limit: 450 },
      { id: uid("bl"), category: "Shopping", limit: 200 },
      { id: uid("bl"), category: "Subscriptions", limit: 60 },
    ],
  },
];

/* ----------------------- Main App ----------------------- */

export default function ExpenseTrackerApp(): React.JSX.Element {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [route, setRoute] = React.useState<AppRoute>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const [accounts, setAccounts] = React.useState<Account[]>(seedAccounts);
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(seedTransactions);
  const [budgets, setBudgets] = React.useState<Budget[]>(seedBudgets);

  // Global “system” preference (for UX + guidance)
  const [budgetSystem, setBudgetSystem] =
    React.useState<BudgetSystem>("Monarch");

  const navigate = (r: AppRoute) => {
    setRoute(r);
    setMobileNavOpen(false);
  };

  const balance = React.useMemo(
    () => calcBalance(transactions),
    [transactions]
  );

  const topStats = React.useMemo(() => {
    // Use current month if possible; if none, show all-time.
    const currentMonth = monthISO();
    const monthTx = transactions.filter(
      (t) => monthKeyFromISO(t.dateISO) === currentMonth
    );
    const scope = monthTx.length ? monthTx : transactions;

    return {
      income: sumIncome(scope),
      expenses: sumExpenses(scope),
      totalBalance: calcBalance(transactions), // overall balance
      scopeLabel: monthTx.length ? "This month" : "All time",
    };
  }, [transactions]);

  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
      .slice(0, 5);
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: uid("tx") }, ...prev]);
  };

  const updateTransaction = (id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const linkAccount = (acct: Account) => {
    setAccounts((prev) => [acct, ...prev]);
  };

  const updateAccount = (id: string, patch: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const createOrUpdateBudget = (b: Budget) => {
    setBudgets((prev) => {
      const exists = prev.some((x) => x.id === b.id);
      return exists ? prev.map((x) => (x.id === b.id ? b : x)) : [b, ...prev];
    });
  };

  const deleteBudget = (id: string) =>
    setBudgets((prev) => prev.filter((b) => b.id !== id));

  const Nav = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography fontWeight={900} sx={{ mb: 1.5 }}>
        Expense Tracker
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.25, mb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          Budget style
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={budgetSystem}
          onChange={(_, v) => v && setBudgetSystem(v)}
          size="small"
          sx={{ mt: 1 }}
          fullWidth
        >
          <ToggleButton value="Monarch">Monarch</ToggleButton>
          <ToggleButton value="YNAB">YNAB</ToggleButton>
          <ToggleButton value="Goodbudget">Goodbudget</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {budgetSystem === "Monarch"
            ? "Overall: track everything, categorize, automate."
            : budgetSystem === "YNAB"
            ? "Zero-based: give every dollar a job."
            : "Envelope: allocate cash-like envelopes."}
        </Typography>
      </Paper>

      <List dense>
        <NavItem
          icon={<WalletIcon />}
          label="Dashboard"
          active={route === "dashboard"}
          onClick={() => navigate("dashboard")}
        />
        <NavItem
          icon={<ReceiptLongIcon />}
          label="Transactions"
          active={route === "transactions"}
          onClick={() => navigate("transactions")}
        />
        <NavItem
          icon={<CameraAltIcon />}
          label="Scan Receipt"
          active={route === "scan"}
          onClick={() => navigate("scan")}
        />
        <NavItem
          icon={<AssessmentIcon />}
          label="Reports"
          active={route === "reports"}
          onClick={() => navigate("reports")}
        />
        <NavItem
          icon={<DescriptionIcon />}
          label="Budgets"
          active={route === "budgets"}
          onClick={() => navigate("budgets")}
        />
        <NavItem
          icon={<LinkIcon />}
          label="Accounts"
          active={route === "accounts"}
          onClick={() => navigate("accounts")}
        />
      </List>

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        color="text.secondary"
      >
        <SettingsIcon fontSize="small" />
        <Typography variant="caption">
          Demo app: wire bank linking (Plaid), OCR, and DB to go production.
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc" }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {!mdUp ? (
            <IconButton
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={900} noWrap>
              {route === "dashboard"
                ? "Dashboard"
                : route === "transactions"
                ? "Transactions"
                : route === "scan"
                ? "Scan Receipt"
                : route === "reports"
                ? "Reports"
                : route === "budgets"
                ? "Budgets"
                : "Accounts"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {route === "dashboard"
                ? "Track your financial health"
                : route === "transactions"
                ? "Manage your income and expenses"
                : route === "scan"
                ? "Upload a receipt to automatically extract expense data"
                : route === "reports"
                ? "Analyze your spending patterns"
                : route === "budgets"
                ? "Plan spending by category and system"
                : "Link banks & sync transactions securely"}
            </Typography>
          </Box>

          <Chip
            size="small"
            variant="outlined"
            icon={<AttachMoneyIcon />}
            label={`Balance ${toMoney(balance)}`}
            sx={{ fontWeight: 800 }}
          />
        </Box>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        {mdUp ? <Box sx={{ width: 300, flexShrink: 0 }}>{Nav}</Box> : null}

        <Drawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          {Nav}
        </Drawer>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Container maxWidth="lg" sx={{ py: 2 }}>
            {route === "dashboard" ? (
              <DashboardScreen
                stats={topStats}
                budgetSystem={budgetSystem}
                recent={recentTransactions}
                budgets={budgets}
                onGoTransactions={() => navigate("transactions")}
                onGoScan={() => navigate("scan")}
                onGoBudgets={() => navigate("budgets")}
                onGoAccounts={() => navigate("accounts")}
                transactions={transactions}
              />
            ) : null}

            {route === "transactions" ? (
              <TransactionsScreen
                transactions={transactions}
                accounts={accounts}
                onAdd={addTransaction}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            ) : null}

            {route === "scan" ? (
              <ScanReceiptScreen
                accounts={accounts}
                onConfirmAdd={(draft) =>
                  addTransaction({ ...draft, source: "receipt" })
                }
                defaultSystem={budgetSystem}
              />
            ) : null}

            {route === "reports" ? (
              <ReportsScreen transactions={transactions} budgets={budgets} />
            ) : null}

            {route === "budgets" ? (
              <BudgetsScreen
                budgetSystem={budgetSystem}
                budgets={budgets}
                transactions={transactions}
                onSave={createOrUpdateBudget}
                onDelete={deleteBudget}
              />
            ) : null}

            {route === "accounts" ? (
              <AccountsScreen
                accounts={accounts}
                onLinkAccount={linkAccount}
                onUpdateAccount={updateAccount}
                onSimulateSync={(acctId) => {
                  updateAccount(acctId, {
                    lastSyncISO: todayISO(),
                    isLinked: true,
                  });
                  // optional: simulate importing a transaction
                  // addTransaction({...})
                }}
              />
            ) : null}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

/* ----------------------- Navigation Item ----------------------- */

function NavItem(props: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={props.onClick}
        selected={props.active}
        sx={{ borderRadius: 2 }}
      >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ fontWeight: 800 }}
        />
      </ListItemButton>
    </ListItem>
  );
}

/* ----------------------- Dashboard Screen ----------------------- */

function DashboardScreen(props: {
  stats: {
    totalBalance: number;
    income: number;
    expenses: number;
    scopeLabel: string;
  };
  budgetSystem: BudgetSystem;
  recent: Transaction[];
  budgets: Budget[];
  transactions: Transaction[];
  onGoTransactions: () => void;
  onGoScan: () => void;
  onGoBudgets: () => void;
  onGoAccounts: () => void;
}) {
  const totalBalanceDisplay = toMoney(props.stats.totalBalance);

  // Spending by category: current month only (if none, show "no expenses this month")
  const currentMonth = monthISO();
  const monthTx = props.transactions.filter(
    (t) => monthKeyFromISO(t.dateISO) === currentMonth
  );
  const monthExpenses = monthTx.filter((t) => t.type === "expense");

  const byCat = React.useMemo(() => {
    const m = new Map<Category, number>();
    monthExpenses.forEach((t) =>
      m.set(t.category, (m.get(t.category) ?? 0) + t.amount)
    );
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [monthExpenses]);

  const activeBudget = React.useMemo(() => {
    // pick latest budget
    return (
      [...props.budgets].sort((a, b) =>
        a.monthISO < b.monthISO ? 1 : -1
      )[0] ?? null
    );
  }, [props.budgets]);

  const budgetUsage = React.useMemo(() => {
    if (!activeBudget) return [];
    const month = activeBudget.monthISO;
    const monthExp = props.transactions.filter(
      (t) => t.type === "expense" && monthKeyFromISO(t.dateISO) === month
    );
    const spentByCat = new Map<Category, number>();
    monthExp.forEach((t) =>
      spentByCat.set(t.category, (spentByCat.get(t.category) ?? 0) + t.amount)
    );
    return activeBudget.lines.map((l) => ({
      ...l,
      spent: spentByCat.get(l.category) ?? 0,
    }));
  }, [activeBudget, props.transactions]);

  return (
    <Stack spacing={2}>
      {/* Large gradient balance card (like screenshot vibe) */}
      <Paper
        sx={{
          borderRadius: 4,
          p: { xs: 2.5, md: 3 },
          color: "common.white",
          background:
            "linear-gradient(120deg, #0b1220 0%, #0e1629 45%, #0c2a2a 100%)",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ md: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ opacity: 0.9 }}
            >
              <CreditCardIcon fontSize="small" />
              <Typography variant="caption" fontWeight={800}>
                Total Balance
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              fontWeight={900}
              sx={{ mt: 1, lineHeight: 1 }}
            >
              {totalBalanceDisplay}
            </Typography>

            <Stack direction="row" spacing={4} sx={{ mt: 2, flexWrap: "wrap" }}>
              <StatMini
                label="Income"
                value={toMoney(props.stats.income)}
                icon={<TrendingUpIcon fontSize="small" />}
              />
              <StatMini
                label="Expenses"
                value={toMoney(props.stats.expenses)}
                icon={<TrendingDownIcon fontSize="small" />}
              />
              <Chip
                size="small"
                label={props.stats.scopeLabel}
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontWeight: 800,
                }}
              />
            </Stack>
          </Box>

          {/* Quick actions */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" },
              gap: 1.5,
              minWidth: { md: 360 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <QuickAction
              label="Add Expense"
              tone="danger"
              onClick={props.onGoTransactions}
            />
            <QuickAction
              label="Scan Receipt"
              tone="warning"
              onClick={props.onGoScan}
            />
            <QuickAction
              label="Budgets"
              tone="success"
              onClick={props.onGoBudgets}
            />
            <QuickAction
              label="Accounts"
              tone="info"
              onClick={props.onGoAccounts}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Main grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography fontWeight={900}>Recent Transactions</Typography>
            <Link
              component="button"
              onClick={props.onGoTransactions}
              underline="none"
              sx={{ fontWeight: 800 }}
            >
              See all{" "}
              <ArrowForwardIcon
                sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }}
              />
            </Link>
          </Stack>

          <Stack spacing={1}>
            {props.recent.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                desc="Add one manually or scan a receipt."
              />
            ) : (
              props.recent.map((t) => <TransactionRow key={t.id} t={t} />)
            )}
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 4, p: 2, minHeight: 220 }}
          >
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Spending by Category
            </Typography>
            {byCat.length === 0 ? (
              <EmptyState
                title="No expenses this month"
                desc="Once you add expenses, they’ll show up here."
              />
            ) : (
              <Stack spacing={1.25} sx={{ mt: 1 }}>
                {byCat.slice(0, 5).map(([cat, amt]) => (
                  <CategoryBar
                    key={cat}
                    label={cat}
                    value={amt}
                    max={byCat[0][1]}
                  />
                ))}
              </Stack>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontWeight={900}>Budget Status</Typography>
              <Link
                component="button"
                underline="none"
                sx={{ fontWeight: 800 }}
                onClick={props.onGoBudgets}
              >
                Manage{" "}
                <ArrowForwardIcon
                  sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }}
                />
              </Link>
            </Stack>

            {!activeBudget ? (
              <Box sx={{ mt: 1.5 }}>
                <EmptyState
                  title="No budget yet"
                  desc={`Create a ${props.budgetSystem} budget to track limits.`}
                />
              </Box>
            ) : (
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {budgetUsage.slice(0, 4).map((l) => (
                  <BudgetLineRow
                    key={l.id}
                    category={l.category}
                    spent={l.spent}
                    limit={l.limit}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Stack>
      </Box>

      {/* Upcoming bills (simple demo) */}
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontWeight={900}>Upcoming Bills</Typography>
          <Link
            component="button"
            underline="none"
            sx={{ fontWeight: 800 }}
            onClick={props.onGoTransactions}
          >
            See all{" "}
            <ArrowForwardIcon
              sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }}
            />
          </Link>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
              <ReceiptLongIcon />
            </Avatar>
            <Box>
              <Typography fontWeight={900}>Rent</Typography>
              <Typography variant="body2" color="text.secondary">
                Due in 4 days
              </Typography>
            </Box>
          </Stack>

          <Stack alignItems="flex-end">
            <Typography fontWeight={900}>$1,500</Typography>
            <Typography variant="caption" color="success.main" fontWeight={800}>
              ✓ Autopay
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

function StatMini(props: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ opacity: 0.95 }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(255,255,255,0.12)",
        }}
      >
        {props.icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          {props.label}
        </Typography>
        <Typography fontWeight={900}>{props.value}</Typography>
      </Box>
    </Stack>
  );
}

function QuickAction(props: {
  label: string;
  onClick: () => void;
  tone: "danger" | "warning" | "success" | "info";
}) {
  const toneStyles =
    props.tone === "danger"
      ? { bgcolor: "#ffecee", color: "#cc2343" }
      : props.tone === "warning"
      ? { bgcolor: "#fff8dc", color: "#b05d00" }
      : props.tone === "success"
      ? { bgcolor: "#e9fff5", color: "#007f55" }
      : { bgcolor: "#eaf3ff", color: "#0a49c2" };

  return (
    <Button
      onClick={props.onClick}
      variant="contained"
      sx={{
        ...toneStyles,
        boxShadow: "none",
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 900,
        py: 1.6,
        "&:hover": { boxShadow: "none", opacity: 0.95 },
      }}
    >
      {props.label}
    </Button>
  );
}

function EmptyState(props: { title: string; desc: string }) {
  return (
    <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
      <Typography fontWeight={900}>{props.title}</Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {props.desc}
      </Typography>
    </Box>
  );
}

function TransactionRow({ t }: { t: Transaction }) {
  const icon =
    t.category === "Food"
      ? "🍴"
      : t.category === "Transport"
      ? "🚗"
      : t.category === "Groceries"
      ? "🛒"
      : t.category === "Subscriptions"
      ? "📺"
      : t.category === "Shopping"
      ? "🛍️"
      : t.category === "Utilities"
      ? "⚡"
      : t.category === "Freelance"
      ? "🧾"
      : t.category === "Housing"
      ? "🏠"
      : "💳";

  const amountDisplay =
    t.type === "expense" ? `-${toMoney(t.amount)}` : `+${toMoney(t.amount)}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
          {icon}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={900} noWrap>
            {t.merchant}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatFriendlyDate(t.dateISO)}
          </Typography>
        </Box>
      </Stack>

      <Typography
        fontWeight={900}
        color={t.type === "expense" ? "text.primary" : "success.main"}
      >
        {amountDisplay}
      </Typography>
    </Paper>
  );
}

function CategoryBar(props: { label: string; value: number; max: number }) {
  const pct =
    props.max <= 0
      ? 0
      : Math.min(100, Math.round((props.value / props.max) * 100));
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={800}>{props.label}</Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={800}>
          {toMoney(props.value)}
        </Typography>
      </Stack>
      <Box
        sx={{
          mt: 0.8,
          height: 8,
          bgcolor: "action.hover",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ width: `${pct}%`, height: "100%", bgcolor: "text.primary" }}
        />
      </Box>
    </Box>
  );
}

function BudgetLineRow(props: {
  category: Category;
  spent: number;
  limit: number;
}) {
  const pct =
    props.limit <= 0
      ? 0
      : Math.min(100, Math.round((props.spent / props.limit) * 100));
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={800}>{props.category}</Typography>
        <Typography variant="body2" fontWeight={900}>
          {toMoney(props.spent)} / {toMoney(props.limit)}
        </Typography>
      </Stack>
      <Box
        sx={{
          mt: 0.8,
          height: 8,
          bgcolor: "action.hover",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            bgcolor: pct >= 100 ? "error.main" : "text.primary",
          }}
        />
      </Box>
    </Box>
  );
}

/* ----------------------- Transactions Screen (full flow) ----------------------- */

type TxFormValues = {
  dateISO: string;
  merchant: string;
  category: Category;
  type: TxType;
  amount: number | "";
  accountId: string | "";
  notes: string;
};

function TransactionsScreen(props: {
  transactions: Transaction[];
  accounts: Account[];
  onAdd: (t: Omit<Transaction, "id">) => void;
  onUpdate: (id: string, patch: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<TxType | "all">("all");
  const [catFilter, setCatFilter] = React.useState<Category | "all">("all");

  const openAdd = () => {
    setEditId(null);
    setAddOpen(true);
  };
  const openEdit = (id: string) => {
    setEditId(id);
    setAddOpen(true);
  };
  const close = () => setAddOpen(false);

  const editingTx = React.useMemo(
    () => props.transactions.find((t) => t.id === editId) ?? null,
    [props.transactions, editId]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...props.transactions]
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) => (catFilter === "all" ? true : t.category === catFilter))
      .filter((t) => {
        if (!q) return true;
        return (
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.dateISO.includes(q)
        );
      })
      .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  }, [props.transactions, search, typeFilter, catFilter]);

  const grouped = React.useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ md: "center" }}
        >
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <TextField
              select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              sx={{ minWidth: 160, width: "100%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>

            <TextField
              select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as any)}
              sx={{ minWidth: 190, width: "100%" }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {grouped.length === 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
            <EmptyState
              title="No matching transactions"
              desc="Try a different filter or add a new transaction."
            />
          </Paper>
        ) : (
          grouped.map(([dateISO, items]) => (
            <Box key={dateISO}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={800}
                sx={{ mb: 1 }}
              >
                {new Date(`${dateISO}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>

              <Stack spacing={1}>
                {items.map((t) => (
                  <Paper
                    key={t.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 4,
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      sx={{ minWidth: 0 }}
                    >
                      <Avatar
                        sx={{ bgcolor: "action.hover", color: "text.primary" }}
                      >
                        {t.type === "expense" ? "−" : "+"}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={900} noWrap>
                          {t.merchant}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {t.category} • {t.source}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        fontWeight={900}
                        color={
                          t.type === "expense" ? "text.primary" : "success.main"
                        }
                      >
                        {t.type === "expense"
                          ? `-${toMoney(t.amount)}`
                          : `+${toMoney(t.amount)}`}
                      </Typography>

                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(t.id)}>
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => props.onDelete(t.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Stack>

      <TransactionUpsertDialog
        open={addOpen}
        onClose={close}
        accounts={props.accounts}
        initial={editingTx}
        onCreate={(v) => props.onAdd(v)}
        onUpdate={(id, patch) => props.onUpdate(id, patch)}
      />
    </Stack>
  );
}

function TransactionUpsertDialog(props: {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  initial: Transaction | null;
  onCreate: (t: Omit<Transaction, "id">) => void;
  onUpdate: (id: string, patch: Partial<Transaction>) => void;
}) {
  const isEdit = !!props.initial;

  const { control, handleSubmit, reset, formState } = useForm<TxFormValues>({
    defaultValues: {
      dateISO: props.initial?.dateISO ?? todayISO(),
      merchant: props.initial?.merchant ?? "",
      category: props.initial?.category ?? "Other",
      type: props.initial?.type ?? "expense",
      amount: props.initial ? props.initial.amount : "",
      accountId: props.initial?.accountId ?? "",
      notes: props.initial?.notes ?? "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    reset({
      dateISO: props.initial?.dateISO ?? todayISO(),
      merchant: props.initial?.merchant ?? "",
      category: props.initial?.category ?? "Other",
      type: props.initial?.type ?? "expense",
      amount: props.initial ? props.initial.amount : "",
      accountId: props.initial?.accountId ?? "",
      notes: props.initial?.notes ?? "",
    });
  }, [props.initial, reset, props.open]);

  const onSubmit = handleSubmit((v) => {
    const amt = typeof v.amount === "number" ? v.amount : Number(v.amount);
    if (!Number.isFinite(amt)) return;

    const base: Omit<Transaction, "id"> = {
      dateISO: v.dateISO,
      merchant: v.merchant.trim(),
      category: v.category,
      type: v.type,
      amount: Math.abs(amt),
      accountId: v.accountId || undefined,
      notes: v.notes.trim() || undefined,
      source: props.initial?.source ?? "manual",
    };

    if (isEdit && props.initial) {
      props.onUpdate(props.initial.id, base);
    } else {
      props.onCreate(base);
    }

    props.onClose();
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {isEdit ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Controller
            name="dateISO"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="merchant"
            control={control}
            rules={{
              required: "Merchant is required",
              minLength: { value: 2, message: "Too short" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Merchant"
                placeholder="e.g., Starbucks"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} select label="Type" fullWidth>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} select label="Category" fullWidth>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Amount is required",
                validate: (v) => {
                  const n = typeof v === "number" ? v : Number(v);
                  if (!Number.isFinite(n)) return "Enter a number";
                  if (n <= 0) return "Must be greater than 0";
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Amount"
                  inputProps={{ step: 0.01, min: 0 }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Account (optional)"
                  fullWidth
                >
                  <MenuItem value="">None</MenuItem>
                  {props.accounts.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.institution} • {a.name} {a.mask ? `(${a.mask})` : ""}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes (optional)"
                fullWidth
                multiline
                minRows={3}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={props.onClose}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
          disabled={!formState.isValid}
        >
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ----------------------- Scan Receipt Screen (flow) ----------------------- */

type ReceiptDraft = {
  dateISO: string;
  merchant: string;
  category: Category;
  type: "expense";
  amount: number;
  accountId?: string;
  notes?: string;
};

type ReceiptForm = {
  file: FileList | null;
  accountId: string | "";
  systemHint: BudgetSystem;
};

function ScanReceiptScreen(props: {
  accounts: Account[];
  onConfirmAdd: (draft: ReceiptDraft) => void;
  defaultSystem: BudgetSystem;
}) {
  const [extracting, setExtracting] = useState(false);
  const [draft, setDraft] = useState<ReceiptDraft | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { control, handleSubmit, watch, reset, formState } =
    useForm<ReceiptForm>({
      defaultValues: {
        file: null,
        accountId: "",
        systemHint: props.defaultSystem,
      },
      mode: "onChange",
    });

  const fileList = watch("file");
  const file = fileList?.[0];

  const onUpload = handleSubmit(async (v) => {
    if (!file) return;

    setExtracting(true);

    // Simulate OCR+parsing
    await new Promise((r) => setTimeout(r, 900));

    // Fake extraction based on filename keywords
    const name = file.name.toLowerCase();
    const merchant = name.includes("starbucks")
      ? "Starbucks Coffee"
      : name.includes("uber")
      ? "Uber Ride"
      : name.includes("walmart")
      ? "Walmart"
      : name.includes("home")
      ? "Home Depot"
      : "Receipt Merchant";

    const category: Category = name.includes("starbucks")
      ? "Food"
      : name.includes("uber")
      ? "Transport"
      : name.includes("walmart")
      ? "Groceries"
      : name.includes("home")
      ? "Shopping"
      : "Other";

    const amount = name.includes("uber")
      ? 18.5
      : name.includes("starbucks")
      ? 5.75
      : 24.99;

    const nextDraft: ReceiptDraft = {
      dateISO: todayISO(),
      merchant,
      category,
      type: "expense",
      amount,
      accountId: v.accountId || undefined,
      notes:
        v.systemHint === "YNAB"
          ? "YNAB hint: assign this expense to a category envelope/job."
          : v.systemHint === "Goodbudget"
          ? "Goodbudget hint: this should come out of an envelope category."
          : "Monarch hint: categorize and track trends over time.",
    };

    setDraft(nextDraft);
    setExtracting(false);
    setConfirmOpen(true);
  });

  const closeConfirm = () => setConfirmOpen(false);

  const confirmAdd = () => {
    if (!draft) return;
    props.onConfirmAdd(draft);
    setConfirmOpen(false);
    setDraft(null);
    reset({ file: null, accountId: "", systemHint: props.defaultSystem });
  };

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Typography fontWeight={900}>Upload Receipt</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Take a photo or upload an image/PDF of your receipt. (Demo: extraction
          is simulated.)
        </Typography>

        <Box
          sx={{
            mt: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 4,
            p: { xs: 2, md: 3 },
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "action.hover",
                color: "text.primary",
              }}
            >
              <CameraAltIcon />
            </Avatar>

            <Box>
              <Typography fontWeight={900}>Choose a receipt</Typography>
              <Typography variant="body2" color="text.secondary">
                Supported: JPG/PNG/PDF (in production: validate & malware scan)
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: "100%", maxWidth: 520 }}
            >
              <Controller
                name="file"
                control={control}
                rules={{
                  required: "Receipt file is required",
                  validate: (v) => {
                    const f = v?.[0];
                    if (!f) return "Receipt file is required";
                    const ok =
                      ["image/jpeg", "image/png", "application/pdf"].includes(
                        f.type
                      ) || f.name.toLowerCase().endsWith(".pdf");
                    if (!ok) return "Must be JPG/PNG/PDF";
                    if (f.size > 15 * 1024 * 1024)
                      return "Max file size is 15MB";
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <Box sx={{ flex: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      component="label"
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 900,
                      }}
                    >
                      Choose File
                      <input
                        hidden
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </Button>
                    <Typography
                      variant="caption"
                      color={fieldState.error ? "error" : "text.secondary"}
                      sx={{ display: "block", mt: 0.75 }}
                    >
                      {fieldState.error?.message ??
                        (file
                          ? `${file.name} • ${(file.size / 1024).toFixed(0)} KB`
                          : "No file selected")}
                    </Typography>
                  </Box>
                )}
              />

              <Controller
                name="accountId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Account (optional)"
                    sx={{ minWidth: { sm: 220 } }}
                    fullWidth
                  >
                    <MenuItem value="">None</MenuItem>
                    {props.accounts.map((a) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.institution} • {a.name} {a.mask ? `(${a.mask})` : ""}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Controller
              name="systemHint"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Budgeting style (hint)"
                  sx={{ width: "100%", maxWidth: 520 }}
                >
                  <MenuItem value="Monarch">Monarch (overall)</MenuItem>
                  <MenuItem value="YNAB">YNAB (zero-based)</MenuItem>
                  <MenuItem value="Goodbudget">Goodbudget (envelope)</MenuItem>
                </TextField>
              )}
            />

            <Button
              onClick={onUpload}
              variant="contained"
              disabled={!formState.isValid || extracting}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                px: 4,
              }}
              startIcon={
                extracting ? (
                  <CircularProgress size={18} />
                ) : (
                  <ReceiptLongIcon />
                )
              }
            >
              {extracting ? "Extracting..." : "Extract Expense Data"}
            </Button>

            <Typography variant="caption" color="text.secondary">
              Real app: OCR + merchant normalization + tax/tip extraction +
              confidence scores + user verification.
            </Typography>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={closeConfirm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>
          Confirm extracted expense
        </DialogTitle>
        <DialogContent dividers>
          {draft ? (
            <Stack spacing={2}>
              <Chip
                icon={<DownloadDoneIcon />}
                label="Extraction complete (simulated)"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />

              <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                <Stack spacing={1}>
                  <KV label="Date" value={formatFriendlyDate(draft.dateISO)} />
                  <KV label="Merchant" value={draft.merchant} />
                  <KV label="Category" value={draft.category} />
                  <KV label="Amount" value={toMoney(draft.amount)} />
                </Stack>
              </Paper>

              <Typography variant="body2" color="text.secondary">
                You can edit details after adding it in the Transactions screen.
              </Typography>

              <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                <Typography fontWeight={900}>Budgeting hint</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {draft.notes}
                </Typography>
              </Paper>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={closeConfirm}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmAdd}
            variant="contained"
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function KV(props: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "140px 1fr" },
        gap: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={800}>
        {props.label}
      </Typography>
      <Typography variant="body2" fontWeight={900}>
        {props.value}
      </Typography>
    </Box>
  );
}

/* ----------------------- Reports Screen (flow) ----------------------- */

function ReportsScreen(props: {
  transactions: Transaction[];
  budgets: Budget[];
}) {
  const [range, setRange] = React.useState<6 | 12>(6);

  // Super simple rolling window by month keys (demo)
  const txSorted = React.useMemo(
    () =>
      [...props.transactions].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)),
    [props.transactions]
  );

  const months = React.useMemo(() => {
    const set = new Set<string>();
    txSorted.forEach((t) => set.add(monthKeyFromISO(t.dateISO)));
    const arr = [...set].sort((a, b) => (a < b ? 1 : -1));
    return arr.slice(0, range).reverse(); // oldest->newest
  }, [txSorted, range]);

  const stats = React.useMemo(() => {
    // current month based on latest tx month; if none, use current month
    const latestMonth = months[months.length - 1] ?? monthISO();
    const lastMonth =
      months.length >= 2 ? months[months.length - 2] : latestMonth;

    const m0 = props.transactions.filter(
      (t) => monthKeyFromISO(t.dateISO) === latestMonth
    );
    const m1 = props.transactions.filter(
      (t) => monthKeyFromISO(t.dateISO) === lastMonth
    );

    const exp0 = sumExpenses(m0);
    const exp1 = sumExpenses(m1);
    const inc0 = sumIncome(m0);
    const inc1 = sumIncome(m1);

    const pct = (cur: number, prev: number) =>
      prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100);

    return {
      latestMonth,
      lastMonth,
      exp0,
      inc0,
      expDeltaPct: pct(exp0, exp1),
      incDeltaPct: pct(inc0, inc1),
    };
  }, [props.transactions, months]);

  const byCat = React.useMemo(() => {
    const latestMonth = stats.latestMonth;
    const m0 = props.transactions.filter(
      (t) => t.type === "expense" && monthKeyFromISO(t.dateISO) === latestMonth
    );
    const map = new Map<Category, number>();
    m0.forEach((t) =>
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    );
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [props.transactions, stats.latestMonth]);

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography fontWeight={900}>Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyze your spending patterns
            </Typography>
          </Box>

          <ToggleButtonGroup
            exclusive
            value={range}
            onChange={(_, v) => v && setRange(v)}
            size="small"
          >
            <ToggleButton value={6}>6 Months</ToggleButton>
            <ToggleButton value={12}>12 Months</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <MetricCard
          title="This Month's Expenses"
          value={toMoney(stats.exp0)}
          sub={`vs ${toMoney(0)} last month`}
          deltaPct={stats.expDeltaPct}
          deltaDir="down"
        />
        <MetricCard
          title="This Month's Income"
          value={toMoney(stats.inc0)}
          sub={`vs ${toMoney(0)} last month`}
          deltaPct={stats.incDeltaPct}
          deltaDir="up"
        />
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Typography fontWeight={900}>Income vs Expenses</Typography>
        <Typography variant="body2" color="text.secondary">
          (Demo chart placeholder) Wire a real chart library if you want a line
          graph.
        </Typography>

        <Box
          sx={{
            mt: 2,
            height: 260,
            borderRadius: 4,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Typography color="text.secondary">
            Add a chart (Recharts / MUI X Charts) using the `months` array.
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{ borderRadius: 4, p: 2, minHeight: 260 }}
        >
          <Typography fontWeight={900}>Spending by Category</Typography>
          {byCat.length === 0 ? (
            <EmptyState
              title="No expenses this month"
              desc="Add expenses to see breakdowns."
            />
          ) : (
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {byCat.slice(0, 6).map(([cat, amt]) => (
                <CategoryBar
                  key={cat}
                  label={cat}
                  value={amt}
                  max={byCat[0][1]}
                />
              ))}
            </Stack>
          )}
        </Paper>

        <Paper
          variant="outlined"
          sx={{ borderRadius: 4, p: 2, minHeight: 260 }}
        >
          <Typography fontWeight={900}>Top Categories</Typography>
          {byCat.length === 0 ? (
            <EmptyState title="No data" desc="Once you spend, this fills in." />
          ) : (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {byCat.slice(0, 5).map(([cat, amt], idx) => (
                <Paper
                  key={cat}
                  variant="outlined"
                  sx={{ borderRadius: 3, p: 1.5 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={`#${idx + 1}`}
                        sx={{ fontWeight: 900 }}
                      />
                      <Typography fontWeight={900}>{cat}</Typography>
                    </Stack>
                    <Typography fontWeight={900}>{toMoney(amt)}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Stack>
  );
}

function MetricCard(props: {
  title: string;
  value: string;
  sub: string;
  deltaPct: number;
  deltaDir: "up" | "down";
}) {
  const good = props.deltaDir === "down"; // down expenses is "good"
  return (
    <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={800}>
            {props.title}
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 0.75 }}>
            {props.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.sub}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${props.deltaPct}%`}
          color={good ? "success" : "error"}
          variant="outlined"
          sx={{ fontWeight: 900 }}
        />
      </Stack>
    </Paper>
  );
}

/* ----------------------- Budgets Screen (Monarch/YNAB/Goodbudget flows) ----------------------- */

type BudgetFormValues = {
  name: string;
  system: BudgetSystem;
  monthISO: string; // YYYY-MM
  lines: { category: Category; limit: number | "" }[];
};

function BudgetsScreen(props: {
  budgetSystem: BudgetSystem;
  budgets: Budget[];
  transactions: Transaction[];
  onSave: (b: Budget) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  const currentMonth = monthISO();
  const active = React.useMemo(() => {
    // budget for current month preferred; else latest
    const exact = props.budgets.find((b) => b.monthISO === currentMonth);
    if (exact) return exact;
    return (
      [...props.budgets].sort((a, b) =>
        a.monthISO < b.monthISO ? 1 : -1
      )[0] ?? null
    );
  }, [props.budgets, currentMonth]);

  const openCreate = () => {
    setEditId(null);
    setOpen(true);
  };
  const openEdit = (id: string) => {
    setEditId(id);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const editing = React.useMemo(
    () => props.budgets.find((b) => b.id === editId) ?? null,
    [props.budgets, editId]
  );

  // Status overview for active budget
  const activeUsage = React.useMemo(() => {
    if (!active) return [];
    const monthExp = props.transactions.filter(
      (t) =>
        t.type === "expense" && monthKeyFromISO(t.dateISO) === active.monthISO
    );
    const spentByCat = new Map<Category, number>();
    monthExp.forEach((t) =>
      spentByCat.set(t.category, (spentByCat.get(t.category) ?? 0) + t.amount)
    );
    return active.lines
      .map((l) => ({ ...l, spent: spentByCat.get(l.category) ?? 0 }))
      .sort((a, b) => b.spent / (b.limit || 1) - a.spent / (a.limit || 1));
  }, [active, props.transactions]);

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography fontWeight={900}>Budgets</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a {props.budgetSystem} budget for categories and track
              progress.
            </Typography>
          </Box>

          <Button
            onClick={openCreate}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
          >
            New Budget
          </Button>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
          <Typography fontWeight={900}>Active Budget</Typography>
          {!active ? (
            <EmptyState
              title="No budget yet"
              desc="Create one to start tracking category limits."
            />
          ) : (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {active.name} • {active.monthISO} • {active.system}
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {activeUsage.slice(0, 6).map((l) => (
                  <BudgetLineRow
                    key={l.id}
                    category={l.category}
                    spent={l.spent}
                    limit={l.limit}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => openEdit(active.id)}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 900,
                  }}
                  fullWidth
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => props.onDelete(active.id)}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 900,
                  }}
                  fullWidth
                >
                  Delete
                </Button>
              </Stack>
            </>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
          <Typography fontWeight={900}>How budgeting works here</Typography>

          <Stack spacing={1.25} sx={{ mt: 2 }}>
            <BudgetExplainer
              system="Monarch"
              active={props.budgetSystem === "Monarch"}
            />
            <BudgetExplainer
              system="YNAB"
              active={props.budgetSystem === "YNAB"}
            />
            <BudgetExplainer
              system="Goodbudget"
              active={props.budgetSystem === "Goodbudget"}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            Real app suggestion: allow “rollover”, “goals”, “scheduled bills”,
            and “envelopes” depending on system.
          </Typography>
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Typography fontWeight={900}>All Budgets</Typography>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {props.budgets.length === 0 ? (
            <EmptyState
              title="No budgets created"
              desc="Click “New Budget” to create your first one."
            />
          ) : (
            props.budgets
              .slice()
              .sort((a, b) => (a.monthISO < b.monthISO ? 1 : -1))
              .map((b) => (
                <Paper
                  key={b.id}
                  variant="outlined"
                  sx={{ borderRadius: 3, p: 1.5 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={900} noWrap>
                        {b.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.monthISO} • {b.system} • {b.lines.length} categories
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openEdit(b.id)}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 900,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => props.onDelete(b.id)}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 900,
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))
          )}
        </Stack>
      </Paper>

      <BudgetUpsertDialog
        open={open}
        onClose={close}
        initial={editing}
        defaultSystem={props.budgetSystem}
        onSave={(b) => props.onSave(b)}
      />
    </Stack>
  );
}

function BudgetExplainer(props: { system: BudgetSystem; active: boolean }) {
  const text =
    props.system === "Monarch"
      ? "Overall approach: categorize transactions and watch trends. Budgets act like monthly guardrails."
      : props.system === "YNAB"
      ? "Zero-based: assign every dollar to a category. Spending reduces available category balance."
      : "Envelope system: each category is an envelope. Fund envelopes and spend from them.";

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 1.5,
        borderColor: props.active ? "text.primary" : "divider",
        bgcolor: props.active ? "action.hover" : "transparent",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography fontWeight={900}>{props.system}</Typography>
        {props.active ? (
          <Chip size="small" label="Selected" sx={{ fontWeight: 900 }} />
        ) : null}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        {text}
      </Typography>
    </Paper>
  );
}

function BudgetUpsertDialog(props: {
  open: boolean;
  onClose: () => void;
  initial: Budget | null;
  defaultSystem: BudgetSystem;
  onSave: (b: Budget) => void;
}) {
  const isEdit = !!props.initial;

  const { control, handleSubmit, reset, formState } = useForm<BudgetFormValues>(
    {
      defaultValues: {
        name: props.initial?.name ?? "Monthly Budget",
        system: props.initial?.system ?? props.defaultSystem,
        monthISO: props.initial?.monthISO ?? monthISO(),
        lines: props.initial?.lines?.map((l) => ({
          category: l.category,
          limit: l.limit,
        })) ?? [{ category: "Food", limit: 300 }],
      },
      mode: "onChange",
    }
  );

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  React.useEffect(() => {
    reset({
      name: props.initial?.name ?? "Monthly Budget",
      system: props.initial?.system ?? props.defaultSystem,
      monthISO: props.initial?.monthISO ?? monthISO(),
      lines: props.initial?.lines?.map((l) => ({
        category: l.category,
        limit: l.limit,
      })) ?? [{ category: "Food", limit: 300 }],
    });
  }, [props.initial, props.defaultSystem, reset, props.open]);

  const onSubmit = handleSubmit((v) => {
    const lines: BudgetLine[] = v.lines
      .map((l) => ({
        id: uid("bl"),
        category: l.category,
        limit: typeof l.limit === "number" ? l.limit : Number(l.limit),
      }))
      .filter((l) => Number.isFinite(l.limit) && l.limit > 0);

    const next: Budget = {
      id: props.initial?.id ?? uid("budget"),
      name: v.name.trim() || "Monthly Budget",
      system: v.system,
      period: "monthly",
      monthISO: v.monthISO,
      lines,
    };

    props.onSave(next);
    props.onClose();
  });

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {isEdit ? "Edit Budget" : "New Budget"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                minLength: { value: 3, message: "Too short" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Budget name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="monthISO"
              control={control}
              rules={{
                required: "Month is required",
                pattern: { value: /^\d{4}-\d{2}$/, message: "Use YYYY-MM" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Month (YYYY-MM)"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="system"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="System" fullWidth>
                  <MenuItem value="Monarch">Monarch</MenuItem>
                  <MenuItem value="YNAB">YNAB</MenuItem>
                  <MenuItem value="Goodbudget">Goodbudget</MenuItem>
                </TextField>
              )}
            />
          </Stack>

          <Divider />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontWeight={900}>Category limits</Typography>
            <Button
              onClick={() => append({ category: "Other", limit: 100 })}
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
            >
              Add line
            </Button>
          </Stack>

          <Stack spacing={1.5}>
            {fields.map((f, idx) => (
              <Paper
                key={f.id}
                variant="outlined"
                sx={{ borderRadius: 3, p: 1.5 }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ md: "center" }}
                >
                  <Controller
                    name={`lines.${idx}.category`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Category"
                        sx={{ minWidth: { md: 220 } }}
                        fullWidth
                      >
                        {CATEGORIES.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name={`lines.${idx}.limit`}
                    control={control}
                    rules={{
                      required: "Limit required",
                      validate: (v) => {
                        const n = typeof v === "number" ? v : Number(v);
                        if (!Number.isFinite(n)) return "Enter a number";
                        if (n <= 0) return "Must be > 0";
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Monthly limit"
                        inputProps={{ step: 1, min: 0 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />

                  <IconButton
                    onClick={() => remove(idx)}
                    aria-label="Remove line"
                    disabled={fields.length === 1}
                    sx={{ alignSelf: { xs: "flex-end", md: "center" } }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Production tip: validate category duplicates, add rollover/goals,
            and allow “funding” events (YNAB/Goodbudget).
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={props.onClose}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
          disabled={!formState.isValid}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ----------------------- Accounts Screen (bank linking flow) ----------------------- */

type LinkWizardForm = {
  institution: string;
  accountName: string;
  type: Account["type"];
  mask: string;
};

function AccountsScreen(props: {
  accounts: Account[];
  onLinkAccount: (a: Account) => void;
  onUpdateAccount: (id: string, patch: Partial<Account>) => void;
  onSimulateSync: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [linking, setLinking] = React.useState(false);

  const { control, handleSubmit, reset, trigger, formState } =
    useForm<LinkWizardForm>({
      defaultValues: {
        institution: "Chase",
        accountName: "Checking",
        type: "checking",
        mask: "0421",
      },
      mode: "onChange",
    });

  const openWizard = () => {
    setOpen(true);
    setStep(0);
    setLinking(false);
  };
  const closeWizard = () => {
    setOpen(false);
    setStep(0);
    setLinking(false);
    reset();
  };

  const next = async () => {
    if (step === 0) {
      const ok = await trigger(["institution"]);
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await trigger(["accountName", "type", "mask"]);
      if (!ok) return;
    }
    setStep((s) => Math.min(2, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const onFinish = handleSubmit(async (v) => {
    setLinking(true);

    // Simulate secure linking (Plaid Link etc.)
    await new Promise((r) => setTimeout(r, 900));

    props.onLinkAccount({
      id: uid("acct"),
      institution: v.institution.trim(),
      name: `${v.institution.trim()} ${v.accountName.trim()}`,
      type: v.type,
      isLinked: true,
      mask: `•••• ${v.mask.trim()}`,
      lastSyncISO: todayISO(),
    });

    setLinking(false);
    closeWizard();
  });

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography fontWeight={900}>Accounts</Typography>
            <Typography variant="body2" color="text.secondary">
              Link banks securely, sync transactions, and manage connected
              accounts.
            </Typography>
          </Box>

          <Button
            onClick={openWizard}
            variant="contained"
            startIcon={<LinkIcon />}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 900 }}
          >
            Link Bank
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
        <Typography fontWeight={900}>Connected accounts</Typography>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {props.accounts.length === 0 ? (
            <EmptyState
              title="No accounts linked"
              desc="Link a bank to auto-import transactions."
            />
          ) : (
            props.accounts.map((a) => (
              <Paper
                key={a.id}
                variant="outlined"
                sx={{ borderRadius: 3, p: 1.5 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                  >
                    <Avatar
                      sx={{ bgcolor: "action.hover", color: "text.primary" }}
                    >
                      {a.type === "credit"
                        ? "💳"
                        : a.type === "savings"
                        ? "🏦"
                        : "🏛️"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={900} noWrap>
                        {a.name}{" "}
                        {a.mask ? (
                          <Typography component="span" color="text.secondary">
                            {" "}
                            {a.mask}
                          </Typography>
                        ) : null}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {a.isLinked
                          ? `Linked • Last sync ${a.lastSyncISO ?? "—"}`
                          : "Not linked"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SyncIcon />}
                      onClick={() => props.onSimulateSync(a.id)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 900,
                      }}
                      disabled={!a.isLinked}
                    >
                      Sync
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        props.onUpdateAccount(a.id, { isLinked: !a.isLinked })
                      }
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 900,
                      }}
                    >
                      {a.isLinked ? "Unlink" : "Link"}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          Production requirements: OAuth/Plaid Link, token vaulting, least
          privilege scopes, encryption at rest, audit logs.
        </Typography>
      </Paper>

      <Dialog open={open} onClose={closeWizard} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Link a bank (wizard)</DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={step}
            onChange={(_, v) => setStep(v)}
            variant="fullWidth"
          >
            <Tab label="Institution" />
            <Tab label="Account" />
            <Tab label="Review" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {step === 0 ? (
              <Stack spacing={2}>
                <Typography fontWeight={900}>Choose institution</Typography>
                <Controller
                  name="institution"
                  control={control}
                  rules={{ required: "Institution required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Institution"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                  <Typography fontWeight={900}>Secure connection</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Real app uses a bank aggregator (Plaid) so your app never
                    sees bank credentials.
                  </Typography>
                </Paper>
              </Stack>
            ) : null}

            {step === 1 ? (
              <Stack spacing={2}>
                <Typography fontWeight={900}>Select account details</Typography>

                <Controller
                  name="accountName"
                  control={control}
                  rules={{ required: "Account name required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Account name"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Type required" }}
                    render={({ field }) => (
                      <TextField {...field} select label="Type" fullWidth>
                        <MenuItem value="checking">Checking</MenuItem>
                        <MenuItem value="savings">Savings</MenuItem>
                        <MenuItem value="credit">Credit</MenuItem>
                      </TextField>
                    )}
                  />
                  <Controller
                    name="mask"
                    control={control}
                    rules={{
                      required: "Last 4 required",
                      minLength: { value: 4, message: "4 digits" },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Last 4 digits"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            ) : null}

            {step === 2 ? (
              <Stack spacing={2}>
                <Typography fontWeight={900}>Review & link</Typography>
                <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    This is a demo. In production, this is where you’d launch
                    Plaid Link and confirm consent.
                  </Typography>
                </Paper>

                {linking ? <LinearProgress /> : null}
              </Stack>
            ) : null}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1, justifyContent: "space-between" }}>
          <Button
            onClick={step === 0 ? closeWizard : back}
            sx={{ borderRadius: 999, textTransform: "none" }}
            disabled={linking}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            {step < 2 ? (
              <Button
                onClick={next}
                variant="contained"
                sx={{ borderRadius: 999 }}
                disabled={linking}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={onFinish}
                variant="contained"
                sx={{ borderRadius: 999 }}
                disabled={!formState.isValid || linking}
              >
                Link
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

/* ----------------------- (Optional) What to do next ----------------------- */
/**
 * If you want this to be production-real:
 * 1) Bank linking: Plaid Link -> server exchange public_token -> store access_token in secure vault
 * 2) Ingestion: webhook sync -> normalize merchants -> dedupe -> category rules
 * 3) Receipt scan: OCR (Vision API) -> parse totals/tax/tip -> confidence + user confirmation
 * 4) Budgets: system-aware behaviors
 *    - Monarch: category budgets + alerts
 *    - YNAB: funding transactions + category available balance + carryover rules
 *    - Goodbudget: envelope funding + envelope balances
 */
