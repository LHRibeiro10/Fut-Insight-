import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "@/shared/components/cards/StatCard";
import SectionCard from "@/shared/components/cards/SectionCard";
import { getCampaignMatches, getCampaignSummary } from "@/shared/lib/campaignStats";

function getRecentForm(matches) {
  return [...matches]
    .slice(-5)
    .map((match) => (match?.result === "win" ? "W" : "L"));
}

function getCurrentStreak(matches) {
  if (!matches.length) return { type: "-", count: 0 };

  let count = 0;
  const lastResult = matches[matches.length - 1]?.result;

  if (lastResult !== "win" && lastResult !== "loss") {
    return { type: "-", count: 0 };
  }

  for (let i = matches.length - 1; i >= 0; i -= 1) {
    if (matches[i]?.result === lastResult) {
      count += 1;
    } else {
      break;
    }
  }

  return {
    type: lastResult === "win" ? "Vitórias" : "Derrotas",
    count,
  };
}

function buildProgressChartData(matches) {
  let wins = 0;
  let losses = 0;

  return matches.map((match, index) => {
    if (match?.result === "win") wins += 1;
    if (match?.result === "loss") losses += 1;

    return {
      partida: index + 1,
      vitorias: wins,
      derrotas: losses,
    };
  });
}

function buildFormationData(matches) {
  const map = new Map();

  matches.forEach((match) => {
    const formation = match?.formationUsed || "Sem formação";
    const current = map.get(formation) || {
      formation,
      wins: 0,
      losses: 0,
      total: 0,
    };

    current.total += 1;
    if (match?.result === "win") current.wins += 1;
    if (match?.result === "loss") current.losses += 1;

    map.set(formation, current);
  });

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function buildTopPlayers(summary) {
  return [...(summary.playerStats || [])]
    .filter((item) => item.matchesPlayed > 0)
    .map((item) => ({
      ...item,
      impactScore:
        item.goals * 4 +
        item.assists * 3 +
        item.mvps * 5 +
        item.averageRating * 2,
    }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5);
}

export default function DashboardPage({
  matches = [],
  players = [],
  campaigns = [],
}) {
  const safeMatches = Array.isArray(matches) ? matches : [];
  const safePlayers = Array.isArray(players) ? players : [];
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const activeCampaign =
    safeCampaigns.find((campaign) => campaign.isActive) ||
    safeCampaigns[0] ||
    null;

  const [selectedCampaignId, setSelectedCampaignId] = useState(
    activeCampaign?.id || "all"
  );

  const filteredMatches = useMemo(() => {
    return getCampaignMatches(
      safeMatches,
      selectedCampaignId === "all" ? "" : selectedCampaignId
    );
  }, [safeMatches, selectedCampaignId]);

  const summary = useMemo(() => {
    return getCampaignSummary(
      safePlayers,
      safeMatches,
      selectedCampaignId === "all" ? "" : selectedCampaignId
    );
  }, [safePlayers, safeMatches, selectedCampaignId]);

  const recentForm = useMemo(() => getRecentForm(filteredMatches), [filteredMatches]);
  const streak = useMemo(() => getCurrentStreak(filteredMatches), [filteredMatches]);

  const selectedCampaign =
    selectedCampaignId === "all"
      ? null
      : safeCampaigns.find((campaign) => campaign.id === selectedCampaignId) || null;

  const progressChartData = useMemo(
    () => buildProgressChartData(filteredMatches),
    [filteredMatches]
  );

  const formationData = useMemo(
    () => buildFormationData(filteredMatches),
    [filteredMatches]
  );

  const topPlayers = useMemo(() => buildTopPlayers(summary), [summary]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral da sua Weekend League
        </Typography>
      </Stack>

      <SectionCard
        title="Filtro de campanha"
        subtitle="Você pode ver o geral ou separar os números por WL."
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Campanha"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">Todas as campanhas</MenuItem>
              {safeCampaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                  {campaign.isFinished ? " (Finalizada)" : ""}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedCampaign ? (
                <>
                  <Chip label={selectedCampaign.name} color="secondary" />
                  <Chip
                    label={selectedCampaign.isFinished ? "Finalizada" : "Ativa"}
                    color={selectedCampaign.isFinished ? "default" : "primary"}
                  />
                  <Chip label={`${summary.wins}W / ${summary.losses}L`} />
                </>
              ) : (
                <Chip label="Visão geral de todas as campanhas" />
              )}
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Vitórias"
            value={summary.wins}
            subtitle={`${summary.totalMatches} partidas registradas`}
            accentColor="#00d084"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Derrotas"
            value={summary.losses}
            subtitle={`Win rate ${summary.winRate}`}
            accentColor="#ff4d4f"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Gols Pró"
            value={summary.goalsFor}
            subtitle={`Média ${summary.avgGoalsFor} por jogo`}
            accentColor="#f4d35e"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Saldo"
            value={summary.goalDifference}
            subtitle={`Contra ${summary.goalsAgainst} gols sofridos`}
            accentColor={summary.goalDifference >= 0 ? "#00d084" : "#ff234f"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionCard
            title="Performance geral"
            subtitle="Leitura rápida do seu momento atual"
          >
            <Stack spacing={2.2}>
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.8 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Aproveitamento
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {summary.winRate}
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={summary.winRateNumber}
                  sx={{
                    height: 10,
                    borderRadius: 99,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                    },
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Sequência atual
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {streak.count > 0
                        ? `${streak.count} ${streak.type}`
                        : "Sem sequência"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Média de gols pró
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {summary.avgGoalsFor}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Média de gols contra
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {summary.avgGoalsAgainst}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Forma recente
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {recentForm.length > 0 ? (
                    recentForm.map((item, index) => (
                      <Chip
                        key={`${item}-${index}`}
                        label={item}
                        sx={{
                          fontWeight: 900,
                          minWidth: 42,
                          borderRadius: 999,
                          bgcolor:
                            item === "W"
                              ? "rgba(0,208,132,0.18)"
                              : "rgba(255,77,79,0.18)",
                          color: item === "W" ? "#00d084" : "#ff4d4f",
                          border:
                            item === "W"
                              ? "1px solid rgba(0,208,132,0.35)"
                              : "1px solid rgba(255,77,79,0.35)",
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Ainda sem partidas suficientes.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            title="Destaques"
            subtitle="Resumo do elenco dentro do filtro escolhido"
          >
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Artilheiro atual
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {summary.topScorer?.player?.name || "Sem dados"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary.topScorer?.goals ?? 0} gols
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Melhor jogador
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {summary.topAverageRating?.player?.name || "Sem dados"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nota média {summary.topAverageRating?.averageRating ?? 0}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Melhor goleiro
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {summary.topKeeper?.player?.name || "Sem dados"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary.topKeeper?.saves ?? 0} defesas
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Jogadores cadastrados
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {safePlayers.length}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Campanhas cadastradas
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {safeCampaigns.length}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Partidas no filtro
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {summary.totalMatches}
                </Typography>
              </Box>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Evolução da campanha"
            subtitle="Vitórias e derrotas acumuladas ao longo das partidas"
          >
            {progressChartData.length > 0 ? (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={progressChartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="partida" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="vitorias"
                      stroke="#00d084"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="derrotas"
                      stroke="#ff4d4f"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Ainda não há dados suficientes para o gráfico.
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Top 5 jogadores"
            subtitle="Impacto geral dentro do filtro atual"
          >
            <Stack spacing={1.2}>
              {topPlayers.length > 0 ? (
                topPlayers.map((item, index) => (
                  <Box
                    key={item.player?.id || index}
                    sx={{
                      p: 1.35,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography sx={{ fontWeight: 900 }}>
                          {index + 1}. {item.player?.name || "Jogador"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.goals} gols • {item.assists} assistências • {item.mvps} MVPs
                        </Typography>
                      </Box>

                      <Typography sx={{ fontWeight: 900, color: "#f4d35e" }}>
                        {item.impactScore.toFixed(1)}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  Ainda não há jogadores com dados suficientes.
                </Typography>
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Desempenho por formação"
            subtitle="Entenda qual esquema rende mais na WL"
          >
            {formationData.length > 0 ? (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={formationData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="formation" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="wins" fill="#00d084" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="losses" fill="#ff4d4f" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Ainda não há formações registradas.
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Resumo ofensivo e defensivo"
            subtitle="Leitura rápida do desempenho no filtro"
          >
            <Stack spacing={1.1}>
              <Typography variant="body1">
                Total de gols marcados: <b>{summary.goalsFor}</b>
              </Typography>
              <Typography variant="body1">
                Média por partida: <b>{summary.avgGoalsFor}</b>
              </Typography>
              <Typography variant="body1">
                Líder em assistências: <b>{summary.topAssist?.player?.name || "-"}</b>
              </Typography>
              <Typography variant="body1">
                Total de gols sofridos: <b>{summary.goalsAgainst}</b>
              </Typography>
              <Typography variant="body1">
                Média sofrida: <b>{summary.avgGoalsAgainst}</b>
              </Typography>
              <Typography variant="body1">
                Goleiro destaque: <b>{summary.topKeeper?.player?.name || "-"}</b>
              </Typography>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
