import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export default function SectionCard({
  title,
  subtitle,
  children,
  accent = "linear-gradient(90deg,#ff234f,#f4d35e)",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        borderRadius: 0,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: `
          linear-gradient(
            180deg,
            rgba(20,24,34,0.95) 0%,
            rgba(12,16,24,0.95) 100%
          )
        `,
      }}
    >
      {/* Accent line */}
      <Box
        sx={{
          height: 3,
          width: "100%",
          background: accent,
        }}
      />

      <CardContent
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={2}>
          {/* Header */}
          <Stack spacing={0.4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Stack>

          {/* Content */}
          <Box>{children}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
