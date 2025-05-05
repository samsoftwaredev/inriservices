"use client";
import { companyName } from "@/constants";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ObjectionBusters = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
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
        From Our Family to Yours:
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          mb: { xs: 2, md: 4 },
          px: { xs: 2, md: 6 },
        }}
      >
        At {companyName}, we’re more than painters — we’re homeowners too.
        That’s why we treat every project with the care and respect it deserves.
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
          <motion.div
            ref={ref1}
            variants={cardVariants}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            style={{ flex: 1, display: "flex" }}
          >
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
                    sx={{ fontSize: 48, color: "primary.main" }}
                  >
                    🛡️
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Trust and Credibility
                </Typography>
                <Typography variant="body1">
                  We build trust with transparency and deliver credible results
                  you can rely on.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            ref={ref2}
            variants={cardVariants}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            style={{ flex: 1, display: "flex" }}
          >
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
                    sx={{ fontSize: 48, color: "secondary.main" }}
                  >
                    💰
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Clear Pricing, No Hidden Fees
                </Typography>
                <Typography variant="body1">
                  Our pricing is straightforward, with no surprises or hidden
                  costs.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            ref={ref3}
            variants={cardVariants}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            style={{ flex: 1, display: "flex" }}
          >
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
                    sx={{ fontSize: 48, color: "success.main" }}
                  >
                    🧹
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Clean and Professional Workers
                </Typography>
                <Typography variant="body1">
                  Our team is composed of skilled professionals who prioritize
                  cleanliness and quality.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </>
  );
};

export default ObjectionBusters;
