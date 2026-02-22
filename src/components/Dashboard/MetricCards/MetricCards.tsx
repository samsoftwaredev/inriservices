import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { MetricCard } from "@/types";

interface Props {
  summaryCards: MetricCard[];
}

const MetricCardDisplay = ({
  title,
  value,
  icon,
  color = "primary.main",
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              color: "white",
              borderRadius: 2,
              p: 1,
              mr: 2,
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            mb: description ? 1 : 0,
          }}
        >
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCards = ({ summaryCards }: Props) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {summaryCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <MetricCardDisplay
            title={card.title}
            value={
              typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value
            }
            icon={card.icon}
            color={card.color}
            description={card.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricCards;
