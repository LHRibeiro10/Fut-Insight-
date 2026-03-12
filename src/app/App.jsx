import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import AppShell from "@/app/layout/AppShell";
import { GuestRoute, ProtectedRoute } from "@/features/auth/components/RouteGuards";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { api } from "@/shared/api/api";

const SquadPage = lazy(() => import("@/features/squad/pages/SquadPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const PlayersPage = lazy(() => import("@/features/players/pages/PlayersPage"));
const NewMatchPage = lazy(() => import("@/features/matches/pages/NewMatchPage"));
const HistoryPage = lazy(() => import("@/features/history/pages/HistoryPage"));
const SquadStatsPage = lazy(() => import("@/features/squad/pages/SquadStatsPage"));
const CampaignsPage = lazy(() => import("@/features/campaigns/pages/CampaignsPage"));

function normalizeDataset(data) {
  return {
    players: Array.isArray(data?.players) ? data.players : [],
    matches: Array.isArray(data?.matches) ? data.matches : [],
    campaigns: Array.isArray(data?.campaigns) ? data.campaigns : [],
    savedTeams: Array.isArray(data?.savedTeams) ? data.savedTeams : [],
  };
}

function hasAnyData(data) {
  return (
    data.players.length > 0 ||
    data.matches.length > 0 ||
    data.campaigns.length > 0 ||
    data.savedTeams.length > 0
  );
}

function buildDefaultCampaign() {
  return {
    id: crypto.randomUUID(),
    name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
    startDate: new Date().toISOString().slice(0, 10),
    totalMatches: 15,
    isActive: true,
    isFinished: false,
    createdAt: new Date().toISOString(),
  };
}

function readLegacyLocalData() {
  try {
    return normalizeDataset({
      players: JSON.parse(localStorage.getItem("wl_tracker_players") || "[]"),
      matches: JSON.parse(localStorage.getItem("wl_tracker_matches") || "[]"),
      campaigns: JSON.parse(localStorage.getItem("wl_tracker_campaigns") || "[]"),
      savedTeams: JSON.parse(localStorage.getItem("wl_tracker_teams") || "[]"),
    });
  } catch {
    return normalizeDataset({});
  }
}

function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

export default function App() {
  const { loading: authLoading, logout, user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [savedTeams, setSavedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return undefined;
    }

    if (!user) {
      setPlayers([]);
      setMatches([]);
      setCampaigns([]);
      setSavedTeams([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        let dataset = normalizeDataset(await api.getBootstrap());

        if (!hasAnyData(dataset)) {
          const legacyData = readLegacyLocalData();

          if (hasAnyData(legacyData)) {
            dataset = normalizeDataset(await api.restoreData(legacyData));
          } else {
            const defaultCampaign = buildDefaultCampaign();
            const createdCampaign = await api.createItem("campaigns", defaultCampaign);
            dataset = normalizeDataset({
              players: [],
              matches: [],
              campaigns: [createdCampaign],
              savedTeams: [],
            });
          }
        }

        if (!active) return;

        setPlayers(dataset.players);
        setMatches(dataset.matches);
        setCampaigns(dataset.campaigns);
        setSavedTeams(dataset.savedTeams);
      } catch (loadError) {
        if (!active) return;

        if (loadError?.status === 401) {
          await logout();
          return;
        }

        setError(loadError?.message || "Nao foi possivel carregar os dados.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [authLoading, logout, user]);

  async function handleSaveTeam(team) {
    const nextTeam = team?.id ? team : { ...team, id: crypto.randomUUID() };
    const savedTeam = await api.createItem("teams", nextTeam);

    setSavedTeams((prev) => {
      const exists = prev.some((item) => item.id === savedTeam.id);
      return exists
        ? prev.map((item) => (item.id === savedTeam.id ? savedTeam : item))
        : [...prev, savedTeam];
    });

    return savedTeam;
  }

  async function persistCampaigns(nextCampaigns) {
    await Promise.all(
      nextCampaigns.map((campaign) => api.createItem("campaigns", campaign))
    );
    setCampaigns(nextCampaigns);
  }

  async function handleAddCampaign(newCampaign) {
    const campaignToCreate = {
      ...newCampaign,
      id: newCampaign?.id || crypto.randomUUID(),
      createdAt: newCampaign?.createdAt || new Date().toISOString(),
    };

    const updatedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      isActive: false,
    }));

    await persistCampaigns([...updatedCampaigns, campaignToCreate]);
    return campaignToCreate;
  }

  async function handleActivateCampaign(campaignId) {
    const nextCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      isActive: campaign.id === campaignId,
    }));

    await persistCampaigns(nextCampaigns);
  }

  async function handleFinishCampaign(campaignId) {
    const nextCampaigns = campaigns.map((campaign) =>
      campaign.id === campaignId
        ? {
            ...campaign,
            isActive: false,
            isFinished: true,
            finishedAt: new Date().toISOString(),
          }
        : campaign
    );

    await persistCampaigns(nextCampaigns);
  }

  async function handleAddPlayer(player) {
    const createdPlayer = await api.createItem("players", {
      ...player,
      id: player?.id || crypto.randomUUID(),
    });

    setPlayers((prev) => [...prev, createdPlayer]);
    return createdPlayer;
  }

  async function handleDeleteCampaign(campaignId) {
    await api.deleteItem("campaigns", campaignId);
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
    setMatches((prev) => prev.filter((match) => match.campaignId !== campaignId));
  }

  async function handleDeletePlayer(id) {
    await api.deleteItem("players", id);
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }

  async function handleUpdatePlayer(id, updatedPlayer) {
    const player = await api.updateItem("players", id, updatedPlayer);

    setPlayers((prev) =>
      prev.map((currentPlayer) => (currentPlayer.id === id ? player : currentPlayer))
    );

    return player;
  }

  async function handleAddMatch(match) {
    const createdMatch = await api.createItem("matches", {
      ...match,
      id: match?.id || crypto.randomUUID(),
    });

    setMatches((prev) => [...prev, createdMatch]);
    return createdMatch;
  }

  async function handleDeleteMatch(matchId) {
    await api.deleteItem("matches", matchId);
    setMatches((prev) => prev.filter((match) => match.id !== matchId));
  }

  async function handleUpdateMatch(matchId, updatedMatch) {
    const match = await api.updateItem("matches", matchId, updatedMatch);

    setMatches((prev) =>
      prev.map((currentMatch) => (currentMatch.id === matchId ? match : currentMatch))
    );

    return match;
  }

  async function handleImportData(data) {
    const restored = normalizeDataset(await api.restoreData(normalizeDataset(data)));
    setPlayers(restored.players);
    setMatches(restored.matches);
    setCampaigns(restored.campaigns);
    setSavedTeams(restored.savedTeams);
  }

  async function handleExportData() {
    const backup = await api.getBackup();
    downloadJson(backup, "wl-tracker-backup.json");
  }

  if (authLoading || (user && loading)) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="secondary" />
          <Typography>Carregando dados do app...</Typography>
        </Stack>
      </Box>
    );
  }

  if (user && error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 520 }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell user={user} onLogout={logout} />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <DashboardPage
                  players={players}
                  matches={matches}
                  campaigns={campaigns}
                />
              </Suspense>
            }
          />

          <Route
            path="/players"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <PlayersPage
                  players={players}
                  matches={matches}
                  onAddPlayer={handleAddPlayer}
                  onUpdatePlayer={handleUpdatePlayer}
                  onDeletePlayer={handleDeletePlayer}
                  onImportData={handleImportData}
                  onExportData={handleExportData}
                />
              </Suspense>
            }
          />

          <Route
            path="/campaigns"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <CampaignsPage
                  campaigns={campaigns}
                  matches={matches}
                  onAddCampaign={handleAddCampaign}
                  onActivateCampaign={handleActivateCampaign}
                  onFinishCampaign={handleFinishCampaign}
                  onDeleteCampaign={handleDeleteCampaign}
                />
              </Suspense>
            }
          />

          <Route
            path="/squad"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <SquadPage
                  players={players}
                  savedTeams={savedTeams}
                  onSaveTeam={handleSaveTeam}
                />
              </Suspense>
            }
          />

          <Route
            path="/new-match"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <NewMatchPage
                  players={players}
                  matches={matches}
                  savedTeams={savedTeams}
                  campaigns={campaigns}
                  onAddMatch={handleAddMatch}
                  onAddCampaign={handleAddCampaign}
                  onFinishCampaign={handleFinishCampaign}
                  onDeleteCampaign={handleDeleteCampaign}
                />
              </Suspense>
            }
          />

          <Route
            path="/history"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <HistoryPage
                  matches={matches}
                  players={players}
                  campaigns={campaigns}
                  onDeleteMatch={handleDeleteMatch}
                  onUpdateMatch={handleUpdateMatch}
                />
              </Suspense>
            }
          />

          <Route
            path="/squad-stats"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <SquadStatsPage
                  players={players}
                  matches={matches}
                  campaigns={campaigns}
                />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

