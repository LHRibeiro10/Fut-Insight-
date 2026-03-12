import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

function FullScreenAuthLoader({ label }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        backgroundColor: "#070b12",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="secondary" />
        <Typography color="white">{label}</Typography>
      </Stack>
    </Box>
  );
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullScreenAuthLoader label="Verificando sessao..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullScreenAuthLoader label="Verificando sessao..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
