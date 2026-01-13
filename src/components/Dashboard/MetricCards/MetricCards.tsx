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
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                transition: "all 0.3s ease",
              },
            }}
            elevation={4}
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
                    width: 200,
                    height: 200,
                    borderRadius: 50,
                    left: -100,
                    bottom: -20,
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
                    borderRadius: 2,
                    zIndex: 2,
                    bgcolor: card.iconWrapperColor,
                    width: 36,
                    height: 36,
                    mr: 2,
                    mt: -4,
                  }}
                >
                  {card.icon}
                </Avatar>

                <Box sx={{ zIndex: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize="small"
                  >
                    {card.title}
                  </Typography>
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

                  <Typography variant="h6" fontWeight="bold">
                    {card.format(card.value)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricCards;
