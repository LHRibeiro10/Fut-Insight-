import { Box, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logo from "@/shared/assets/logo.png";

export default function AuthPageLayout({ title, subtitle, alternateLabel, alternateTo, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: `
          radial-gradient(circle at 20% 20%, rgba(244,211,94,0.14), transparent 22%),
          radial-gradient(circle at 80% 10%, rgba(255,35,79,0.14), transparent 18%),
          linear-gradient(180deg, #070b12 0%, #0c1320 100%)
        `,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: "rgba(10,15,24,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.36)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1.5} alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="FUT Insight 26"
              sx={{ width: 72, height: 72, objectFit: "contain" }}
            />
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff" }}>
              {title}
            </Typography>
            <Typography color="rgba(255,255,255,0.72)" sx={{ textAlign: "center" }}>
              {subtitle}
            </Typography>
          </Stack>

          {children}

          <Typography color="rgba(255,255,255,0.72)">
            {alternateLabel}{" "}
            <Box
              component={RouterLink}
              to={alternateTo}
              sx={{
                color: "#f4d35e",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              aqui
            </Box>
            .
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
