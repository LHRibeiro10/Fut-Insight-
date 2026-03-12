import { Outlet, NavLink } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Container,
  Toolbar,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import logo from "@/shared/assets/logo.png";

const menuItems = [
  { label: "Dashboard", to: "/", icon: <DashboardRoundedIcon /> },
  { label: "Jogadores", to: "/players", icon: <GroupsRoundedIcon /> },
  { label: "Nova partida", to: "/new-match", icon: <SportsSoccerRoundedIcon /> },
  { label: "Histórico", to: "/history", icon: <HistoryRoundedIcon /> },
  { label: "Campanhas", to: "/campaigns", icon: <EmojiEventsRoundedIcon /> },
  { label: "Estatísticas", to: "/squad-stats", icon: <BarChartRoundedIcon /> },
  { label: "Meu Time", to: "/squad", icon: <SportsSoccerRoundedIcon /> },
];

function NavButton({ to, label, icon }) {
  return (
    <Button
      component={NavLink}
      to={to}
      startIcon={icon}
      sx={{
        color: "rgba(255,255,255,0.86)",
        fontWeight: 800,
        textTransform: "none",
        borderRadius: 999,
        px: 1.75,
        py: 0.9,
        minWidth: "fit-content",
        position: "relative",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        "&.active": {
          color: "#fff",
          background: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        },
        "&.active::after": {
          content: '""',
          position: "absolute",
          left: 14,
          right: 14,
          bottom: -6,
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, #f4d35e 0%, #ffd86b 100%)",
          boxShadow: "0 0 14px rgba(244,211,94,0.65)",
        },
        "&:hover": {
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default function AppShell({ user, onLogout }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#070b12" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            "linear-gradient(90deg, #0a0f18 0%, #111827 55%, #0b1220 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 82, md: 90 },
            px: { xs: 2, md: 3 },
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.75}
            sx={{ minWidth: 0, flexGrow: 1 }}
          >
            <Box
              sx={{
                width: { xs: 58, md: 66 },
                height: { xs: 58, md: 66 },
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#0b0f18",
                border: "1px solid rgba(244,211,94,0.28)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 22px rgba(244,211,94,0.16)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="FUT Insight 26"
                sx={{
                  width: { xs: 50, md: 58 },
                  height: { xs: 50, md: 58 },
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 0 8px rgba(244,211,94,0.18))",
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  letterSpacing: "0.03em",
                  lineHeight: 1,
                  color: "#fff",
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                }}
              >
                FUT INSIGHT 26
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: { xs: "none", sm: "block" },
                  mt: 0.6,
                  color: "rgba(255,255,255,0.72)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Weekend League Analytics
              </Typography>

              <Box
                sx={{
                  mt: 0.8,
                  px: 1.5,
                  py: 0.35,
                  borderRadius: 999,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  width: "fit-content",
                  background: "rgba(244,211,94,0.12)",
                  border: "1px solid rgba(244,211,94,0.35)",
                  color: "#f4d35e",
                  display: { xs: "none", md: "block" },
                }}
              >
                CAMPANHAS E PERFORMANCE
              </Box>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {menuItems.map((item) => (
              <NavButton
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
          >
            <Chip
              avatar={<Avatar>{user?.name?.[0] || "U"}</Avatar>}
              label={user?.name || "Usuario"}
              sx={{
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <Button variant="outlined" color="inherit" onClick={onLogout}>
              Sair
            </Button>
          </Stack>
        </Toolbar>

        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            gap: 1,
            overflowX: "auto",
            px: 2,
            pb: 1.5,
            scrollbarWidth: "none",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {menuItems.map((item) => (
            <NavButton
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
          <Button
            variant="outlined"
            color="inherit"
            onClick={onLogout}
            sx={{ ml: "auto", flexShrink: 0 }}
          >
            Sair
          </Button>
        </Box>
      </AppBar>

      <Box
        sx={{
          minHeight: { xs: "calc(100vh - 130px)", lg: "calc(100vh - 90px)" },
          backgroundImage: `
            radial-gradient(circle at 12% 18%, rgba(255,35,79,0.08), transparent 22%),
            radial-gradient(circle at 86% 8%, rgba(244,211,94,0.08), transparent 20%),
            radial-gradient(circle at 50% 100%, rgba(86,122,255,0.06), transparent 28%),
            linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0))
          `,
          backgroundColor: "#070b12",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
