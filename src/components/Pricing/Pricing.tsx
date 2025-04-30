import { theme } from "@/app/theme";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Image from "next/image";
import styles from "./Pricing.module.css";

const pricingData = [
  {
    imageSrc: "/painterOrange.png",
    title: "Small PATCH area",
    subTitle: "(1-5 inches)",
    description: ["Quick fixes for minor damage"],
    price: "$50 - $100",
    image: "/cartoon-painter-1.svg",
  },
  {
    imageSrc: "/plumber.png",
    title: "Medium PATCH area",
    subTitle: "(6-12 inches)",
    description: ["For moderate repairs that need precision"],
    price: "$150 - $250",
    image: "/cartoon-painter-2.svg",
  },
  {
    imageSrc: "/painter.png",
    title: "Large PATCH area",
    subTitle: "(13+ inches)",
    description: ["Extensive repairs requiring more materials and time"],
    price: "$300+",
    image: "/cartoon-painter-3.svg",
  },
];

const Pricing = () => {
  return (
    <>
      <Box
        sx={{
          px: 3,
          py: { xs: 1, md: 1 },
          flex: 1,
          textAlign: "center",
          borderWidth: 3,
          borderRadius: 10,
          backgroundColor: "black",
        }}
      >
        <Typography
          variant="h4"
          component="h3"
          sx={{
            fontWeight: "bold",
            color: "white",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Our Pricing & Packages
        </Typography>
      </Box>

      <Box sx={{ my: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {pricingData.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: index + 1,
                }}
              >
                <Grid
                  sx={{
                    position: "absolute",
                    top: { md: "70px", sm: "auto", xs: "10px" },
                    left: { md: "150px", sm: "auto", xs: "auto" },
                    right: { md: "auto", sm: 0, xs: "120px" },
                    height: {
                      xs: "200px",
                      sm: "150px",
                      md: "200px",
                    },
                  }}
                >
                  <Image
                    className={styles.worker}
                    src={item.imageSrc}
                    alt="Painter"
                    objectFit="cover"
                    fill
                  />
                </Grid>
              </Box>
              <Card
                sx={{
                  zIndex: index,
                  height: "100%",
                  display: "flex",
                  position: "relative",
                  flexDirection: "column",
                  border: "2px solid",
                  maxWidth: { md: "200px", sm: "150px", xs: "320px" },
                  backgroundColor: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  borderTopLeftRadius: "50px",
                  borderTopRightRadius: "50px",
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    color="white"
                    fontWeight="bold"
                    textAlign={"center"}
                    sx={{
                      position: "relative",
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {item.subTitle}
                  </Typography>
                  {item.description.map((desc, i) => (
                    <Typography
                      variant="body1"
                      key={i}
                      sx={{ mt: 1, fontSize: { xs: "0.8rem", md: "1rem" } }}
                    >
                      {desc}
                    </Typography>
                  ))}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                    }}
                  >
                    {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default Pricing;
