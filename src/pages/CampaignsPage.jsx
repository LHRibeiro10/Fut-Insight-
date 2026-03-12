import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import { getCampaignSummary } from "../utils/campaignStats";

export default function CampaignsPage({
  campaigns = [],
  matches = [],
  onAddCampaign,
  onActivateCampaign,
  onFinishCampaign,
  onDeleteCampaign,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [campaignForm, setCampaignForm] = useState({
    name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
    totalMatches: 15,
  });

  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const safeMatches = Array.isArray(matches) ? matches : [];

  const campaignCards = useMemo(() => {
    return safeCampaigns.map((campaign) => ({
      campaign,
      summary: getCampaignSummary([], safeMatches, campaign.id),
    }));
  }, [safeCampaigns, safeMatches]);

  function handleCreateCampaign() {
    const trimmedName = campaignForm.name.trim();

    if (!trimmedName) {
      setFeedback("Digite um nome para a campanha.");
      return;
    }

    onAddCampaign?.({
      id: crypto.randomUUID(),
      name: trimmedName,
      startDate: new Date().toISOString().slice(0, 10),
      totalMatches: Number(campaignForm.totalMatches) || 15,
      isActive: true,
      isFinished: false,
      createdAt: new Date().toISOString(),
    });

    setCampaignForm({
      name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
      totalMatches: 15,
    });

    setDialogOpen(false);
    setFeedback(`Campanha "${trimmedName}" criada com sucesso.`);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    onDeleteCampaign?.(deleteTarget.id);
    setFeedback(`Campanha "${deleteTarget.name}" excluída.`);
    setDeleteTarget(null);
  }

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Campanhas WL"
        subtitle="Gerencie suas campanhas, acompanhe o recorde e defina a ativa."
      >
        <Stack spacing={2.5}>
          {feedback ? <Alert severity="success">{feedback}</Alert> : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Nova campanha
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {campaignCards.map(({ campaign, summary }) => (
              <Grid key={campaign.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    border: campaign.isActive
                      ? "1px solid rgba(244,211,94,0.45)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                    boxShadow: campaign.isActive
                      ? "0 0 0 1px rgba(244,211,94,0.08) inset, 0 0 22px rgba(244,211,94,0.08)"
                      : "none",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack spacing={0.45}>
                        <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
                          {campaign.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Início: {campaign.startDate || "-"}
                        </Typography>
                      </Stack>

                      <EmojiEventsRoundedIcon sx={{ color: "#f4d35e" }} />
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {campaign.isActive ? (
                        <Chip label="Ativa" color="primary" />
                      ) : null}

                      {campaign.isFinished ? (
                        <Chip label="Finalizada" />
                      ) : null}

                      <Chip label={`${summary.wins}W / ${summary.losses}L`} />
                      <Chip label={`${summary.totalMatches}/${campaign.totalMatches} partidas`} />
                    </Stack>

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aproveitamento
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>
                          {summary.winRate}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Saldo
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>
                          {summary.goalDifference}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Gols pró
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>
                          {summary.goalsFor}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Gols contra
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>
                          {summary.goalsAgainst}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<PlayArrowRoundedIcon />}
                        disabled={campaign.isActive}
                        onClick={() => onActivateCampaign?.(campaign.id)}
                        fullWidth
                      >
                        Ativar
                      </Button>

                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<StopCircleRoundedIcon />}
                        disabled={campaign.isFinished}
                        onClick={() => onFinishCampaign?.(campaign.id)}
                        fullWidth
                      >
                        Finalizar
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => setDeleteTarget(campaign)}
                        fullWidth
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </SectionCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nova campanha WL</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nome da campanha"
              value={campaignForm.name}
              onChange={(e) =>
                setCampaignForm((current) => ({
                  ...current,
                  name: e.target.value,
                }))
              }
              fullWidth
            />

            <TextField
              label="Total de partidas"
              type="number"
              value={campaignForm.totalMatches}
              onChange={(e) =>
                setCampaignForm((current) => ({
                  ...current,
                  totalMatches: Math.max(1, Math.min(30, Number(e.target.value) || 15)),
                }))
              }
              inputProps={{ min: 1, max: 30 }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateCampaign}>
            Criar campanha
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Excluir campanha</DialogTitle>
        <DialogContent>
          <Typography sx={{ pt: 1 }}>
            Deseja realmente excluir a campanha <b>{deleteTarget?.name}</b>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Todas as partidas vinculadas a ela também serão removidas.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}