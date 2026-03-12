import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export default function StatCard({
  title,
  value,
  subtitle,
  accentColor = "#f4d35e",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 0,
        minHeight: 150,
        border: "1px solid rgba(255,255,255,0.08)",
        background: `
          linear-gradient(
            180deg,
            rgba(20,24,34,0.98) 0%,
            rgba(11,15,22,0.98) 100%
          )
        `,
        boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
        transition: "transform .18s ease, box-shadow .22s ease, border-color .22s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 18px 38px rgba(0,0,0,0.28)",
          borderColor: "rgba(255,255,255,0.14)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 32%),
            linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%)
          `,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: accentColor,
          boxShadow: `0 0 14px ${accentColor}`,
        },
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={1.4}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: accentColor,
                boxShadow: `0 0 12px ${accentColor}`,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.62)",
                fontWeight: 700,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontWeight: 900,
              lineHeight: 1,
              fontSize: { xs: "2.2rem", md: "2.6rem" },
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            {value}
          </Typography>

          {subtitle ? (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
