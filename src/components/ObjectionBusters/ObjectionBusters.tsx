import { companyName } from "@/constants";
import { Box, Typography, Card, CardContent } from "@mui/material";


interface Props {
  title?: string;
  description?: string;
  cards?: {
    icon: string;
    iconColor: string;
    title: string;
    description: string;
  }[];
}

const ObjectionBusters = ({
  cards = [],
  title = "From Our Family to Yours:",
  description = `At ${companyName}, we’re more than painters — we’re homeowners too. That’s why we treat every project with the care and respect it deserves.`,
}: Props) => (
  <>
    <Typography
      variant="h5"
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        my: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        textAlign: "center",
        mb: { xs: 2, md: 4 },
        px: { xs: 2, md: 6 },
      }}
    >
     {description}
    </Typography>

    <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: { xs: 2, md: 4 },
        }}
      >
        {cards.map(({ icon, iconColor, title, description }, ) => (
          <Box key={title} sx={{ flex: 1, display: "flex" }}>
            <Card
              sx={{
                flex: 1,
                textAlign: "center",
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    component="span"
                    sx={{ fontSize: 48, color: iconColor }}
                  >
                    {icon}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body1">{description}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  </>
);

export default ObjectionBusters;
