import {
  Avatar,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import { getPlayerStatsForCampaign } from "../utils/campaignStats";

export default function SquadStatsPage({
  players = [],
  matches = [],
  campaigns = [],
}) {
  const safePlayers = Array.isArray(players) ? players : [];
  const safeMatches = Array.isArray(matches) ? matches : [];
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const activeCampaign =
    safeCampaigns.find((campaign) => campaign.isActive) ||
    safeCampaigns[0] ||
    null;

  const [selectedCampaignId, setSelectedCampaignId] = useState(
    activeCampaign?.id || "all"
  );

  const stats = useMemo(() => {
    return getPlayerStatsForCampaign(
      safePlayers,
      safeMatches,
      selectedCampaignId === "all" ? "" : selectedCampaignId
    );
  }, [safePlayers, safeMatches, selectedCampaignId]);

  const topScorer = useMemo(() => {
    return (
      [...stats].sort(
        (a, b) => b.goals - a.goals || b.matchesPlayed - a.matchesPlayed
      )[0] || null
    );
  }, [stats]);

  const topAssist = useMemo(() => {
    return (
      [...stats].sort(
        (a, b) => b.assists - a.assists || b.matchesPlayed - a.matchesPlayed
      )[0] || null
    );
  }, [stats]);

  const topAverageRating = useMemo(() => {
    return (
      [...stats]
        .filter((item) => item.ratingEntries > 0)
        .sort(
          (a, b) =>
            b.averageRating - a.averageRating ||
            b.matchesPlayed - a.matchesPlayed
        )[0] || null
    );
  }, [stats]);

  const topMvp = useMemo(() => {
    return (
      [...stats].sort(
        (a, b) => b.mvps - a.mvps || b.matchesPlayed - a.matchesPlayed
      )[0] || null
    );
  }, [stats]);

  const topKeeper = useMemo(() => {
    return (
      [...stats]
        .filter((item) => item.player?.position === "GOL")
        .sort((a, b) => b.saves - a.saves || b.matchesPlayed - a.matchesPlayed)[0] ||
      null
    );
  }, [stats]);

  const mostUsed = useMemo(() => {
    return (
      [...stats].sort(
        (a, b) => b.matchesPlayed - a.matchesPlayed || b.goals - a.goals
      )[0] || null
    );
  }, [stats]);

  const ranking = useMemo(() => {
    return [...stats].sort((a, b) => {
      if (b.matchesPlayed !== a.matchesPlayed) return b.matchesPlayed - a.matchesPlayed;
      if (b.goals !== a.goals) return b.goals - a.goals;
      return b.assists - a.assists;
    });
  }, [stats]);

  function renderHighlight(title, value, subtitle, playerStats) {
    return (
      <SectionCard title={title} subtitle={subtitle}>
        {playerStats ? (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={playerStats.player?.photo}
                alt={playerStats.player?.name || "Jogador"}
              >
                {(playerStats.player?.name || "J")[0]}
              </Avatar>
              <Stack>
                <Typography sx={{ fontWeight: 700 }}>
                  {playerStats.player?.name || "Jogador"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {playerStats.player?.position || "-"}{" "}
                  {playerStats.player?.club ? `• ${playerStats.player.club}` : ""}
                </Typography>
              </Stack>
            </Stack>

            <Chip label={value} color="secondary" sx={{ width: "fit-content" }} />
          </Stack>
        ) : (
          <Typography color="text.secondary">Sem dados ainda.</Typography>
        )}
      </SectionCard>
    );
  }

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Filtro de campanha"
        subtitle="As estatísticas agora podem ser separadas por WL."
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
        </Grid>
      </SectionCard>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Artilheiro",
            `${topScorer?.goals ?? 0} gols`,
            "Jogador com mais gols marcados no filtro atual.",
            topScorer
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Líder em assistências",
            `${topAssist?.assists ?? 0} assistências`,
            "Quem mais serviu os companheiros no filtro atual.",
            topAssist
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Melhor média de nota",
            `${topAverageRating?.averageRating ?? 0}`,
            "Maior média nas avaliações das partidas.",
            topAverageRating
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Mais MVP",
            `${topMvp?.mvps ?? 0} MVPs`,
            "Jogador mais decisivo no filtro atual.",
            topMvp
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Goleiro com mais defesas",
            `${topKeeper?.saves ?? 0} defesas`,
            "Entre os jogadores da posição GOL.",
            topKeeper
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderHighlight(
            "Jogador mais usado",
            `${mostUsed?.matchesPlayed ?? 0} partidas`,
            "Quem mais apareceu no seu time.",
            mostUsed
          )}
        </Grid>
      </Grid>

      <SectionCard
        title="Ranking completo do elenco"
        subtitle="Visão geral das estatísticas acumuladas de cada jogador no filtro atual."
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jogador</TableCell>
              <TableCell>Posição</TableCell>
              <TableCell>Partidas</TableCell>
              <TableCell>Gols</TableCell>
              <TableCell>Assistências</TableCell>
              <TableCell>MVPs</TableCell>
              <TableCell>Defesas</TableCell>
              <TableCell>Nota média</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ranking.map((item) => (
              <TableRow key={item.player.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar
                      src={item.player?.photo}
                      alt={item.player?.name || "Jogador"}
                      sx={{ width: 32, height: 32 }}
                    >
                      {(item.player?.name || "J")[0]}
                    </Avatar>
                    <Stack spacing={0.2}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.player?.name || "Jogador"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.player?.club || "Sem clube"}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>

                <TableCell>{item.player?.position || "-"}</TableCell>
                <TableCell>{item.matchesPlayed}</TableCell>
                <TableCell>{item.goals}</TableCell>
                <TableCell>{item.assists}</TableCell>
                <TableCell>{item.mvps}</TableCell>
                <TableCell>{item.saves}</TableCell>
                <TableCell>{item.averageRating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </Stack>
  );
}
