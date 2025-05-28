import { Grid, List, ListItem, Typography } from "@mui/material";

const HoursOperation = () => {
  return (
    <Grid
      size={{ xs: 12, md: 6 }}
    >
      <article>
        <Typography
          variant="h1"
          component="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
            my: { xs: 2, md: 4 },
            px: { xs: 2, md: 0 },
          }}
          gutterBottom
        >
          Business Hours
        </Typography>
        <List sx={{ padding: 0 }}>
          {[
            { day: "Monday", hours: "9:00 AM - 5:00 PM" },
            { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
            { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
            { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
            { day: "Friday", hours: "9:00 AM - 5:00 PM" },
            { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
            { day: "Sunday", hours: "Closed" },
          ].map((item, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: { xs: "8px 0", md: "12px 0" },
                borderBottom: index < 6 ? "1px solid #ddd" : "none",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                {item.day}:
              </Typography>
              <Typography
                variant="body1"
                component="span"
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                {item.hours}
              </Typography>
            </ListItem>
          ))}
        </List>
      </article>
    </Grid>
  );
};

export default HoursOperation;
