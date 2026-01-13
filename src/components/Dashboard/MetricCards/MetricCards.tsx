import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { MetricCard } from "@/types";

interface Props {
  summaryCards: MetricCard[];
}

const MetricCards = ({ summaryCards }: Props) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {summaryCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card
            sx={{
              height: "100%",
              background: `linear-gradient(135deg, ${card.bgColor} 0%, white 100%)`,
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                transition: "all 0.3s ease",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    bgcolor: card.color,
                    width: 250,
                    height: 250,
                    borderRadius: 50,
                    left: -180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    position: "absolute",
                    zIndex: 1,
                  }}
                />
                <Avatar
                  sx={{
                    zIndex: 2,
                    bgcolor: card.color,
                    width: 56,
                    height: 56,
                    mr: 2,
                  }}
                >
                  {card.icon}
                </Avatar>

                <Box sx={{ zIndex: 2 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {card.format(card.value)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Box>

              {card.title === "Amount Earned" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    zIndex: 2,
                  }}
                >
                  <TrendingUpIcon
                    sx={{
                      fontSize: 16,
                      color: "success.main",
                      mr: 0.5,
                      zIndex: 2,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ zIndex: 2 }}
                  >
                    +12% from last month
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricCards;
