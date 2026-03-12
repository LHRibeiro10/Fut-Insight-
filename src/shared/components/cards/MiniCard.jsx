import { Avatar, Box, Typography } from "@mui/material";

function getMiniCardTheme(cardType) {
  switch (cardType) {
    case "bronze":
      return {
        background: "linear-gradient(180deg, #cf915f 0%, #ac6838 55%, #80451f 100%)",
        border: "rgba(103,57,28,0.68)",
        text: "#201005",
        glow: "rgba(0,0,0,0.24)",
      };
    case "silver":
      return {
        background: "linear-gradient(180deg, #f2f4f7 0%, #d8dde5 55%, #a9b3be 100%)",
        border: "rgba(122,132,146,0.62)",
        text: "#17212c",
        glow: "rgba(0,0,0,0.20)",
      };
    case "totw":
      return {
        background: "linear-gradient(180deg, #17181d 0%, #0d1015 58%, #08090c 100%)",
        border: "rgba(243,201,78,0.90)",
        text: "#f5d25f",
        glow: "rgba(243,201,78,0.18)",
      };
    case "icon":
      return {
        background: "linear-gradient(180deg, #f8f3e9 0%, #e7dbc5 55%, #c8ae84 100%)",
        border: "rgba(142,113,62,0.74)",
        text: "#241700",
        glow: "rgba(0,0,0,0.20)",
      };
    case "hero":
      return {
        background: "linear-gradient(180deg, #93361f 0%, #642118 55%, #29181a 100%)",
        border: "rgba(255,162,70,0.78)",
        text: "#ffe7b8",
        glow: "rgba(255,162,70,0.16)",
      };
    case "gold":
    default:
      return {
        background: "linear-gradient(180deg, #f8e7a6 0%, #f1cd59 55%, #c8922c 100%)",
        border: "rgba(128,90,18,0.66)",
        text: "#241700",
        glow: "rgba(0,0,0,0.24)",
      };
  }
}

export default function MiniCard({ player }) {
  const safePlayer = player || {};
  const theme = getMiniCardTheme(safePlayer?.cardType || "gold");

  const rating = safePlayer?.overall ?? 0;
  const position = (safePlayer?.position || "POS").toUpperCase();
  const photo = safePlayer?.photo || null;
  const clubLogo = safePlayer?.clubBadge || null;

  const shortName = safePlayer?.name
    ? safePlayer.name.split(" ")[0].toUpperCase().slice(0, 11)
    : "JOGADOR";

  return (
    <Box
      sx={{
        position: "relative",
        width: 96,
        height: 134,
        borderRadius: "28px 28px 18px 18px",
        overflow: "hidden",
        background: theme.background,
        border: `2px solid ${theme.border}`,
        boxShadow: `
          0 10px 20px rgba(0,0,0,0.28),
          0 0 0 1px rgba(255,255,255,0.08),
          0 0 18px ${theme.glow}
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 0.65,
        py: 0.5,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18), transparent 30%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 4,
          borderRadius: "24px 24px 14px 14px",
          border: "1px solid rgba(255,255,255,0.16)",
          pointerEvents: "none",
        }}
      />

      <Typography
        sx={{
          mt: 0.15,
          fontWeight: 900,
          fontSize: 22,
          lineHeight: 1,
          color: theme.text,
          zIndex: 1,
        }}
      >
        {rating}
      </Typography>

      <Typography
        sx={{
          mt: 0.1,
          fontWeight: 900,
          fontSize: 12,
          lineHeight: 1,
          color: theme.text,
          zIndex: 1,
          letterSpacing: "0.02em",
        }}
      >
        {position}
      </Typography>

      <Box
        sx={{
          mt: 0.7,
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {photo ? (
          <Avatar
            src={photo}
            sx={{
              width: 52,
              height: 52,
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "rgba(255,255,255,0.22)",
              color: theme.text,
              fontWeight: 900,
              fontSize: 22,
            }}
          >
            {safePlayer?.name?.[0] || "J"}
          </Avatar>
        )}
      </Box>

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.35,
          width: "100%",
          zIndex: 1,
        }}
      >
        {clubLogo ? (
          <Box
            component="img"
            src={clubLogo}
            alt={safePlayer?.club || "Clube"}
            sx={{
              width: 20,
              height: 20,
              objectFit: "contain",
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.16))",
            }}
          />
        ) : (
          <Box sx={{ width: 20, height: 20 }} />
        )}

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 900,
            color: theme.text,
            lineHeight: 1,
            textAlign: "center",
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            px: 0.25,
            mb: 0.2,
          }}
        >
          {shortName}
        </Typography>
      </Box>
    </Box>
  );
}
