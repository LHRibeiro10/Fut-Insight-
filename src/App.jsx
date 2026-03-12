import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";

const SquadPage = lazy(() => import("./pages/SquadPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PlayersPage = lazy(() => import("./pages/PlayersPage"));
const NewMatchPage = lazy(() => import("./pages/NewMatchPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SquadStatsPage = lazy(() => import("./pages/SquadStatsPage"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));

export default function App() {
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem("wl_tracker_players");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem("wl_tracker_matches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem("wl_tracker_campaigns");
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      {
        id: crypto.randomUUID(),
        name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
        startDate: new Date().toISOString().slice(0, 10),
        totalMatches: 15,
        isActive: true,
        isFinished: false,
      },
    ];
  });

  const [savedTeams, setSavedTeams] = useState(() => {
    try {
      const saved = localStorage.getItem("wl_tracker_teams");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wl_tracker_players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("wl_tracker_matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("wl_tracker_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem("wl_tracker_teams", JSON.stringify(savedTeams));
  }, [savedTeams]);

  function handleSaveTeam(team) {
    setSavedTeams((prev) => {
      const exists = prev.find((item) => item.id === team.id);

      if (exists) {
        return prev.map((item) => (item.id === team.id ? team : item));
      }

      return [...prev, { ...team, id: crypto.randomUUID() }];
    });
  }

  function handleAddCampaign(newCampaign) {
    setCampaigns((prev) => {
      const updated = prev.map((campaign) => ({
        ...campaign,
        isActive: false,
      }));

      return [...updated, newCampaign];
    });
  }

  function handleActivateCampaign(campaignId) {
    setCampaigns((prev) =>
      prev.map((campaign) => ({
        ...campaign,
        isActive: campaign.id === campaignId,
      }))
    );
  }

  function handleFinishCampaign(campaignId) {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              isActive: false,
              isFinished: true,
              finishedAt: new Date().toISOString(),
            }
          : campaign
      )
    );
  }

  function handleAddPlayer(player) {
    const createdPlayer = { ...player, id: crypto.randomUUID() };
    setPlayers((prev) => [...prev, createdPlayer]);
    return createdPlayer;
  }

  function handleDeleteCampaign(campaignId) {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
    setMatches((prev) => prev.filter((match) => match.campaignId !== campaignId));
  }

  function handleDeletePlayer(id) {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }

  function handleUpdatePlayer(id, updatedPlayer) {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, ...updatedPlayer } : player
      )
    );
  }

  function handleAddMatch(match) {
    setMatches((prev) => [...prev, match]);
  }

  function handleDeleteMatch(matchId) {
    setMatches((prev) => prev.filter((match) => match.id !== matchId));
  }

  function handleUpdateMatch(matchId, updatedMatch) {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, ...updatedMatch } : match
      )
    );
  }

  function handleImportData(data) {
    const importedPlayers = Array.isArray(data?.players) ? data.players : [];
    const importedMatches = Array.isArray(data?.matches) ? data.matches : [];
    const importedCampaigns = Array.isArray(data?.campaigns) ? data.campaigns : [];
    const importedSavedTeams = Array.isArray(data?.savedTeams) ? data.savedTeams : [];

    setPlayers(importedPlayers);
    setMatches(importedMatches);
    setCampaigns(importedCampaigns);
    setSavedTeams(importedSavedTeams);
  }

  function handleExportData() {
    const data = {
      players,
      matches,
      campaigns,
      savedTeams,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wl-tracker-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
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
    </Routes>
  );
}
