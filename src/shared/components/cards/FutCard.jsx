import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import IconButton from "@mui/material/IconButton";
import { Avatar, Box, Stack, Typography } from "@mui/material";

function PositionIcon({ pos }) {
  const value = (pos || "").toUpperCase();

  if (value === "GOL") return "🧤";
  if (value === "ZAG") return "🛡️";
  if (value === "LD" || value === "LE" || value === "ALA") return "🏃";
  if (
    value === "VOL" ||
    value === "MC" ||
    value === "MEI" ||
    value === "CAM" ||
    value === "ME" ||
    value === "MD"
  ) {
    return "🧙‍♂️";
  }
  if (
    value === "PD" ||
    value === "PE" ||
    value === "ATA" ||
    value === "CA" ||
    value === "SA"
  ) {
    return "⚽";
  }

  return "⭐";
}

function getCardTheme(cardType = "gold") {
  switch ((cardType || "").toLowerCase()) {
    case "icon":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.34), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.18), transparent 18%),
          linear-gradient(180deg, #f8f3e8 0%, #e8dcc4 48%, #cdb38b 100%)
        `,
        border: "rgba(145, 114, 58, 0.72)",
        text: "#241700",
        subtext: "rgba(61,42,8,0.78)",
        panel: "rgba(122, 88, 28, 0.10)",
        divider: "rgba(105, 72, 10, 0.18)",
        shadow: "0 18px 40px rgba(0,0,0,0.24)",
        badge: "rgba(90, 64, 15, 0.10)",
      };

    case "hero":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.18), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,180,84,0.14), transparent 18%),
          linear-gradient(180deg, #7f2f1d 0%, #5f2218 48%, #24151a 100%)
        `,
        border: "rgba(255, 170, 82, 0.72)",
        text: "#ffe6be",
        subtext: "rgba(255,228,188,0.8)",
        panel: "rgba(255, 194, 111, 0.08)",
        divider: "rgba(255, 198, 119, 0.15)",
        shadow: "0 18px 40px rgba(0,0,0,0.32)",
        badge: "rgba(255, 187, 92, 0.12)",
      };

    case "totw":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.10), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,214,92,0.14), transparent 18%),
          linear-gradient(180deg, #16171c 0%, #0d1015 48%, #07080b 100%)
        `,
        border: "rgba(244, 208, 93, 0.8)",
        text: "#f4d05c",
        subtext: "rgba(244,208,92,0.82)",
        panel: "rgba(244, 208, 92, 0.06)",
        divider: "rgba(244, 208, 92, 0.16)",
        shadow: "0 18px 40px rgba(0,0,0,0.38)",
        badge: "rgba(244, 208, 92, 0.12)",
      };

    case "rare":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.28), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.10), transparent 18%),
          linear-gradient(180deg, #f8e7a8 0%, #f2cf61 48%, #c8952f 100%)
        `,
        border: "rgba(140, 98, 16, 0.68)",
        text: "#241700",
        subtext: "rgba(61,42,8,0.78)",
        panel: "rgba(122, 88, 28, 0.10)",
        divider: "rgba(105, 72, 10, 0.18)",
        shadow: "0 18px 40px rgba(0,0,0,0.26)",
        badge: "rgba(90, 64, 15, 0.10)",
      };

    case "silver":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.32), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.12), transparent 18%),
          linear-gradient(180deg, #f1f4f7 0%, #d9dfe6 48%, #a9b4c0 100%)
        `,
        border: "rgba(115, 126, 142, 0.66)",
        text: "#1b2430",
        subtext: "rgba(40,50,62,0.76)",
        panel: "rgba(60, 72, 88, 0.08)",
        divider: "rgba(70, 82, 96, 0.16)",
        shadow: "0 18px 40px rgba(0,0,0,0.22)",
        badge: "rgba(80, 92, 108, 0.08)",
      };

    case "bronze":
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.22), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.08), transparent 18%),
          linear-gradient(180deg, #cf9364 0%, #b06f3e 48%, #814920 100%)
        `,
        border: "rgba(97, 56, 26, 0.7)",
        text: "#201005",
        subtext: "rgba(45,24,9,0.74)",
        panel: "rgba(76, 38, 14, 0.10)",
        divider: "rgba(76, 38, 14, 0.18)",
        shadow: "0 18px 40px rgba(0,0,0,0.24)",
        badge: "rgba(76, 38, 14, 0.10)",
      };

    case "gold":
    default:
      return {
        background: `
          radial-gradient(circle at 20% 14%, rgba(255,255,255,0.30), transparent 24%),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.12), transparent 18%),
          linear-gradient(180deg, #f8e8ab 0%, #f1cf61 48%, #ca982f 100%)
        `,
        border: "rgba(140, 98, 16, 0.68)",
        text: "#241700",
        subtext: "rgba(61,42,8,0.78)",
        panel: "rgba(122, 88, 28, 0.10)",
        divider: "rgba(105, 72, 10, 0.18)",
        shadow: "0 18px 40px rgba(0,0,0,0.26)",
        badge: "rgba(90, 64, 15, 0.10)",
      };
  }
}

function StatLine({ leftLabel, leftValue, rightLabel, rightValue, textColor, subtextColor }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
      <Stack direction="row" spacing={0.45} alignItems="center">
        <Typography
          sx={{
            fontWeight: 900,
            color: textColor,
            minWidth: 22,
            fontSize: 13,
            lineHeight: 1,
          }}
        >
          {leftValue}
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            color: subtextColor,
            fontSize: 12,
            lineHeight: 1,
          }}
        >
          {leftLabel}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.45} alignItems="center">
        <Typography
          sx={{
            fontWeight: 900,
            color: textColor,
            minWidth: 22,
            fontSize: 13,
            lineHeight: 1,
            textAlign: "right",
          }}
        >
          {rightValue}
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            color: subtextColor,
            fontSize: 12,
            lineHeight: 1,
          }}
        >
          {rightLabel}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function FutCard({
  player,
  snapshot,
  onClick,
  onEdit,
  onDelete,
  compact = false,
  highlight = false,
}) {
  const safePlayer = player || {};

  const matches = snapshot?.matchesPlayed ?? snapshot?.games ?? 0;
  const goals = snapshot?.goals ?? 0;
  const assists = snapshot?.assists ?? 0;
  const saves = snapshot?.saves ?? 0;
  const mvps = snapshot?.mvps ?? 0;
  const avgR = snapshot?.averageRating ?? snapshot?.avgRating ?? 0;

  const rating =
    safePlayer?.overall ??
    Math.max(60, Math.min(99, Math.round((avgR || 7) * 10)));

  const portrait = safePlayer?.photo || null;
  const clubLogo = safePlayer?.clubBadge || null;
  const nationFlag = safePlayer?.nationFlag || null;
  const clubName =
    typeof safePlayer?.club === "string" ? safePlayer.club : "Sem clube";

  const nation = safePlayer?.nation || "—";
  const position = (safePlayer?.position || "POS").toUpperCase();
  const preferredFoot = safePlayer?.preferredFoot || "—";
  const isGK = position === "GOL";
  const rarity = safePlayer?.cardType || safePlayer?.rarity || "gold";
  const theme = getCardTheme(rarity);

  const footShort =
    preferredFoot === "Direito"
      ? "DIR"
      : preferredFoot === "Esquerdo"
      ? "ESQ"
      : preferredFoot === "Ambidestro"
      ? "AMB"
      : "—";

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: compact ? 405 : 485,
        borderRadius: "28px 28px 22px 22px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        background: theme.background,
        border: `2px solid ${highlight ? "rgba(0,208,132,0.78)" : theme.border}`,
        boxShadow: highlight
          ? "0 0 0 3px rgba(0,208,132,0.45), 0 0 28px rgba(0,208,132,0.22), 0 18px 40px rgba(0,0,0,0.26)"
          : theme.shadow,
        transition: "transform .18s ease, box-shadow .25s ease, border-color .25s ease",
        "&:hover": {
          transform: onClick ? "translateY(-4px) scale(1.01)" : "none",
          boxShadow: onClick
            ? `${highlight ? "0 0 0 3px rgba(0,208,132,0.45), 0 0 28px rgba(0,208,132,0.22), " : ""}${theme.shadow}, 0 24px 48px rgba(0,0,0,0.16)`
            : theme.shadow,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.12), transparent 36%),
            linear-gradient(225deg, rgba(255,255,255,0.05), transparent 26%)
          `,
          pointerEvents: "none",
        }}
      />

      {highlight ? (
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 4,
            px: 1.1,
            py: 0.45,
            borderRadius: 999,
            bgcolor: "rgba(0,208,132,0.16)",
            border: "1px solid rgba(0,208,132,0.45)",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 900,
              color: "#00d084",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Novo no elenco
          </Typography>
        </Box>
      ) : null}

      <Box
        sx={{
          position: "absolute",
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: "22px 22px 16px 16px",
          border: "1px solid rgba(255,255,255,0.18)",
          pointerEvents: "none",
        }}
      />

      {(onEdit || onDelete) && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 4,
          }}
        >
          {onEdit ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.45)",
                color: theme.text,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.65)",
                },
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          ) : null}

          {onDelete ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.45)",
                color: "#b00020",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.65)",
                },
              }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Stack>
      )}

      <Box
        sx={{
          position: "absolute",
          top: 18,
          left: 14,
          zIndex: 3,
          width: 68,
        }}
      >
        <Typography
          sx={{
            fontSize: compact ? 34 : 40,
            lineHeight: 1,
            fontWeight: 900,
            color: theme.text,
            textAlign: "center",
            textShadow: "0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {rating}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: 15,
            fontWeight: 900,
            color: theme.text,
            textAlign: "center",
            letterSpacing: "0.03em",
          }}
        >
          {position}
        </Typography>

        <Typography
          sx={{
            mt: 0.6,
            fontSize: 18,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          <PositionIcon pos={position} />
        </Typography>

        {nationFlag ? (
          <Box
            component="img"
            src={nationFlag}
            alt={nation}
            sx={{
              width: 28,
              height: 19,
              objectFit: "cover",
              borderRadius: "4px",
              display: "block",
              mx: "auto",
              mt: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
            }}
          />
        ) : null}

        {clubLogo ? (
          <Box
            component="img"
            src={clubLogo}
            alt={clubName}
            sx={{
              width: 30,
              height: 30,
              objectFit: "contain",
              display: "block",
              mx: "auto",
              mt: nationFlag ? 0.9 : 1,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,.18))",
            }}
          />
        ) : null}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          px: 1.2,
          py: 0.45,
          borderRadius: 999,
          bgcolor: theme.badge,
          border: "1px solid rgba(255,255,255,0.14)",
          zIndex: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.08em",
            color: theme.subtext,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {String(rarity).toUpperCase()}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: compact ? 70 : 78,
          left: 78,
          right: 18,
          height: compact ? 175 : 210,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        {portrait ? (
          <Box
            component="img"
            src={portrait}
            alt={safePlayer?.name || "Jogador"}
            sx={{
              width: compact ? "80%" : "84%",
              maxWidth: compact ? 190 : 230,
              maxHeight: compact ? 185 : 220,
              objectFit: "contain",
              objectPosition: "center bottom",
              filter: "drop-shadow(0 10px 18px rgba(0,0,0,.22))",
              transform: "translateY(6px)",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: compact ? 92 : 116,
              height: compact ? 92 : 116,
              fontSize: compact ? 34 : 42,
              fontWeight: 900,
              bgcolor: "rgba(255,255,255,0.28)",
              color: theme.text,
              border: "2px solid rgba(255,255,255,0.18)",
              mb: 1.2,
            }}
          >
            {(safePlayer?.name || "J")[0]}
          </Avatar>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          zIndex: 2,
          background: theme.panel,
          borderRadius: "16px 16px 12px 12px",
          px: 1.2,
          py: 1.1,
          backdropFilter: "blur(2px)",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: compact ? 19 : 24,
            lineHeight: 1,
            color: theme.text,
            textTransform: "uppercase",
            letterSpacing: "0.015em",
            mb: 0.35,
            px: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {safePlayer?.name || "Jogador"}
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: 700,
            color: theme.subtext,
            mb: 1,
            px: 1.2,
            lineHeight: 1.2,
          }}
        >
          {clubName} • {nation} • {preferredFoot}
        </Typography>

        <Box
          sx={{
            borderTop: `1px solid ${theme.divider}`,
            pt: 1,
            px: 0.3,
          }}
        >
          {isGK ? (
            <Stack spacing={0.75}>
              <StatLine
                leftLabel="DEF"
                leftValue={saves}
                rightLabel="PJ"
                rightValue={matches}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
              <StatLine
                leftLabel="MVP"
                leftValue={mvps}
                rightLabel="NOT"
                rightValue={Number(avgR || 0).toFixed(2)}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
              <StatLine
                leftLabel="GOL"
                leftValue={goals}
                rightLabel="AST"
                rightValue={assists}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
            </Stack>
          ) : (
            <Stack spacing={0.75}>
              <StatLine
                leftLabel="GOL"
                leftValue={goals}
                rightLabel="AST"
                rightValue={assists}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
              <StatLine
                leftLabel="PJ"
                leftValue={matches}
                rightLabel="MVP"
                rightValue={mvps}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
              <StatLine
                leftLabel="NOT"
                leftValue={Number(avgR || 0).toFixed(2)}
                rightLabel="PÉ"
                rightValue={footShort}
                textColor={theme.text}
                subtextColor={theme.subtext}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

