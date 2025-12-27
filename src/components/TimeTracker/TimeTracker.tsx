"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useForm, Controller } from "react-hook-form";
import { JSX } from "react";

type Category = "development" | "admin" | "estimate" | "sales" | "other";

type TimeEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  category: Category;
  projectTask: string;
  notes?: string;
};

type FormValues = {
  date: string; // YYYY-MM-DD
  hours: number | "";
  category: Category | "";
  projectTask: string;
  notes: string;
};

const categories: { value: Category; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "admin", label: "Admin" },
  { value: "estimate", label: "Estimates" },
  { value: "sales", label: "Sales" },
  { value: "other", label: "Other" },
];

function formatWeekRange(start: Date): string {
  // Week of Dec 22 - Dec 28, 2025
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString(undefined, opts);
  const endStr = end.toLocaleDateString(undefined, opts);

  return `Week of ${startStr} - ${endStr}, ${start.getFullYear()}`;
}

function getISODate(d = new Date()): string {
  // Local date to YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function sumHours(entries: TimeEntry[]) {
  return entries.reduce((acc, e) => acc + (Number(e.hours) || 0), 0);
}

function hoursToDisplay(h: number) {
  // "3h" (no decimals unless needed)
  const isInt = Number.isInteger(h);
  return `${isInt ? h : h.toFixed(1)}h`;
}

function weekdayKey(isoDate: string) {
  // simplistic "this week" grouping: use ISO week boundaries if you want
  return isoDate.slice(0, 10);
}

export default function TimeTracker(): JSX.Element {
  // Seed data (matches the screenshot vibe)
  const [entries, setEntries] = React.useState<TimeEntry[]>([
    {
      id: "seed-1",
      date: "2025-12-25",
      hours: 3,
      category: "development",
      projectTask: "Talk with Clients",
      notes: "following leads",
    },
  ]);

  const [formOpen, setFormOpen] = React.useState(true);

  // Pretend the “week of” is Dec 22, 2025
  const weekStart = React.useMemo(() => new Date("2025-12-22T00:00:00"), []);
  const weekLabel = React.useMemo(
    () => formatWeekRange(weekStart),
    [weekStart]
  );

  const todayISO = getISODate(new Date("2025-12-26T12:00:00")); // keep deterministic to screenshot
  const todayHours = React.useMemo(
    () => sumHours(entries.filter((e) => e.date === todayISO)),
    [entries, todayISO]
  );

  const thisWeekHours = React.useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    const startISO = getISODate(weekStart);
    const endISO = getISODate(end);
    return sumHours(
      entries.filter((e) => e.date >= startISO && e.date <= endISO)
    );
  }, [entries, weekStart]);

  const thisWeekDaysWithEntries = React.useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    const startISO = getISODate(weekStart);
    const endISO = getISODate(end);

    const daySet = new Set(
      entries
        .filter((e) => e.date >= startISO && e.date <= endISO)
        .map((e) => weekdayKey(e.date))
    );
    return daySet.size;
  }, [entries, weekStart]);

  const avgDaily = React.useMemo(() => {
    if (thisWeekDaysWithEntries === 0) return 0;
    return thisWeekHours / thisWeekDaysWithEntries;
  }, [thisWeekHours, thisWeekDaysWithEntries]);

  const totalEntries = entries.length;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      date: todayISO,
      hours: 8,
      category: "",
      projectTask: "",
      notes: "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    const hoursNum =
      typeof values.hours === "number" ? values.hours : Number(values.hours);
    const newEntry: TimeEntry = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      date: values.date,
      hours: Number.isFinite(hoursNum) ? hoursNum : 0,
      category: (values.category || "other") as Category,
      projectTask: values.projectTask.trim() || "Untitled",
      notes: values.notes.trim() || undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);

    reset({
      date: values.date,
      hours: values.hours,
      category: values.category,
      projectTask: "",
      notes: "",
    });
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#fff" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Time Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {weekLabel}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Log Hours
        </Button>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="TODAY"
            value={hoursToDisplay(todayHours)}
            subtitle={`${
              entries.filter((e) => e.date === todayISO).length
            } entries`}
            icon={<AccessTimeIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="THIS WEEK"
            value={hoursToDisplay(thisWeekHours)}
            subtitle={`${thisWeekDaysWithEntries || 0} days logged`}
            icon={<CalendarMonthIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="AVG DAILY"
            value={`${avgDaily.toFixed(1)}h`}
            subtitle="This week"
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="TOTAL ENTRIES"
            value={String(totalEntries)}
            subtitle="All time"
            icon={<WorkOutlineIcon />}
          />
        </Grid>
      </Grid>

      {/* Log New Hours */}
      {formOpen && (
        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Log New Hours
            </Typography>
            <IconButton aria-label="Close" onClick={() => setFormOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      label="Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="hours"
                  control={control}
                  rules={{
                    required: "Hours are required",
                    validate: (v) => {
                      const n = typeof v === "number" ? v : Number(v);
                      if (!Number.isFinite(n)) return "Enter a number";
                      if (n <= 0) return "Must be greater than 0";
                      if (n > 24) return "Must be 24 or less";
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hours"
                      type="number"
                      inputProps={{ step: 0.5, min: 0, max: 24 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Category"
                      placeholder="Select category"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message ?? " "}
                    >
                      <MenuItem value="" disabled>
                        Select category
                      </MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c.value} value={c.value}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="projectTask"
                  control={control}
                  rules={{
                    required: "Project / Task is required",
                    minLength: { value: 2, message: "Too short" },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Project / Task"
                      placeholder="What did you work on?"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notes (optional)"
                      placeholder="Add any additional details..."
                      multiline
                      minRows={3}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ borderRadius: 999, textTransform: "none", px: 3 }}
                  >
                    Save Entry
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Recent Entries */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Recent Entries
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        {entries.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">No entries yet.</Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />} sx={{ p: 1 }}>
            {entries.slice(0, 6).map((e) => (
              <RecentEntryRow key={e.id} entry={e} />
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

function StatCard(props: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            letterSpacing={0.6}
          >
            {props.title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ lineHeight: 1.1, mt: 0.5 }}
          >
            {props.value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {props.subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
          }}
        >
          {props.icon}
        </Box>
      </CardContent>
    </Card>
  );
}

function RecentEntryRow({ entry }: { entry: TimeEntry }) {
  const dt = new Date(`${entry.date}T00:00:00`);
  const month = dt.toLocaleString(undefined, { month: "short" }).toUpperCase();
  const day = String(dt.getDate()).padStart(2, "0");

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "stretch", p: 1 }}>
      {/* Date badge */}
      <Box
        sx={{
          width: 56,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          {month}
        </Typography>
        <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1 }}>
          {day}
        </Typography>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={800} noWrap>
          {entry.projectTask}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mt: 0.5,
          }}
        >
          <Chip
            size="small"
            label={entry.category}
            sx={{ textTransform: "capitalize", borderRadius: 2 }}
            variant="outlined"
          />
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {hoursToDisplay(entry.hours)}
            </Typography>
          </Box>
        </Box>

        {entry.notes ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {entry.notes}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
