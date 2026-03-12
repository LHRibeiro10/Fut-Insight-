import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import {
  Alert,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import FutCard from "@/shared/components/cards/FutCard";
import SectionCard from "@/shared/components/cards/SectionCard";
import { getCampaignSummary } from "@/shared/lib/campaignStats";
import { getPlayerSnapshot } from "@/shared/lib/stats";

function createRow(playerId = "") {
  return {
    id: crypto.randomUUID(),
    playerId,
    goals: 0,
    assists: 0,
    rating: 7,
    mvp: false,
    saves: 0,
  };
}

const formationOptions = [
  "4-4-2",
  "4-3-3",
  "4-2-3-1",
  "4-1-2-1-2",
  "4-5-1",
  "3-5-2",
  "3-4-2-1",
  "3-4-3",
  "5-3-2",
  "5-2-1-2",
  "5-4-1",
];

export default function NewMatchPage({
  players = [],
  matches = [],
  campaigns = [],
  savedTeams = [],
  onAddMatch,
  onAddCampaign,
  onFinishCampaign,
  onDeleteCampaign,
}) {
  const [preview, setPreview] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSeverity, setFeedbackSeverity] = useState("success");
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activeCampaign =
    campaigns.find((campaign) => campaign.isActive) || campaigns[0] || null;

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    campaignId: activeCampaign?.id || "",
    savedTeamId: "",
    result: "win",
    goalsFor: 0,
    goalsAgainst: 0,
    formationUsed: "4-4-2",
    rival: "",
    rankGoal: activeCampaign?.totalMatches || 15,
    notes: "",
    rows: [],
  });

  const [campaignForm, setCampaignForm] = useState({
    name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
    totalMatches: 15,
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      campaignId: current.campaignId || activeCampaign?.id || "",
      rankGoal: activeCampaign?.totalMatches || current.rankGoal || 15,
      rows:
        players.length === 0
          ? []
          : current.rows?.length > 0
            ? current.rows
            : players.map((player) => createRow(player.id)),
    }));
  }, [activeCampaign, players]);

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === form.campaignId) ||
    activeCampaign ||
    null;

  const campaignMatches = useMemo(() => {
    return matches.filter((match) => match.campaignId === selectedCampaign?.id);
  }, [matches, selectedCampaign]);

  const currentMatchNumber = Math.min(
    campaignMatches.length + 1,
    selectedCampaign?.totalMatches || 15
  );

  const campaignSummary = useMemo(() => {
    return getCampaignSummary(players, matches, selectedCampaign?.id || "");
  }, [players, matches, selectedCampaign]);

  const totalGoalsFromRows = useMemo(
    () => form.rows.reduce((acc, row) => acc + Number(row.goals || 0), 0),
    [form.rows]
  );

  const hasScoreMismatch = totalGoalsFromRows !== Number(form.goalsFor || 0);

  const canAddMoreRows = useMemo(() => {
    const selectedIds = form.rows.map((row) => row.playerId).filter(Boolean);
    return selectedIds.length < players.length;
  }, [form.rows, players.length]);

  function setMessage(message, severity = "success") {
    setFeedback(message);
    setFeedbackSeverity(severity);
  }

  function handleDeleteCampaignConfirm() {
    if (!selectedCampaign) return;

    onDeleteCampaign?.(selectedCampaign.id);
    setDeleteDialogOpen(false);
    setMessage(`Campanha "${selectedCampaign.name}" excluída.`);
  }

  function getAvailablePlayers(currentRowId) {
    const selectedIds = form.rows
      .filter((row) => row.id !== currentRowId)
      .map((row) => row.playerId)
      .filter(Boolean);

    return players.filter((player) => !selectedIds.includes(player.id));
  }

  function updateRow(rowId, patch) {
    setForm((current) => {
      const nextRows = current.rows.map((row) =>
        row.id === rowId ? { ...row, ...patch } : row
      );

      const selectedIds = nextRows.map((row) => row.playerId).filter(Boolean);
      const hasDuplicates = new Set(selectedIds).size !== selectedIds.length;

      if (hasDuplicates) {
        setMessage("Esse jogador já foi adicionado na partida.", "warning");
        return current;
      }

      return {
        ...current,
        rows: nextRows,
      };
    });
  }

  function removeRow(rowId) {
    setForm((current) => ({
      ...current,
      rows: current.rows.filter((row) => row.id !== rowId),
    }));
  }

  function addRow() {
    if (!canAddMoreRows) {
      setMessage("Todos os jogadores cadastrados já estão na partida.", "warning");
      return;
    }

    setForm((current) => ({
      ...current,
      rows: [...current.rows, createRow("")],
    }));
  }

  function duplicateRow(row) {
    if (!canAddMoreRows) {
      setMessage("Não há mais jogadores disponíveis para adicionar.", "warning");
      return;
    }

    setForm((current) => ({
      ...current,
      rows: [
        ...current.rows,
        {
          ...row,
          id: crypto.randomUUID(),
          playerId: "",
        },
      ],
    }));
  }

  function handleApplySavedTeam(teamId) {
    if (!teamId) {
      setForm((current) => ({
        ...current,
        savedTeamId: "",
        rows: players.map((player) => createRow(player.id)),
      }));
      return;
    }

    const team = savedTeams.find((item) => item.id === teamId);
    if (!team) return;

    const uniquePlayerIds = [...new Set(team.playerIds || [])];
    const rows = uniquePlayerIds.map((playerId) => createRow(playerId));

    setForm((current) => ({
      ...current,
      savedTeamId: teamId,
      rows,
    }));

    setMessage(`Time "${team.name}" carregado com sucesso.`);
  }

  function handleOpenSaveDialog() {
    if (!form.campaignId) {
      setMessage("Selecione ou crie uma campanha WL antes de salvar.", "warning");
      return;
    }

    setConfirmSaveOpen(true);
  }

  function saveMatch() {
    if (!form.campaignId) {
      setMessage("Selecione ou crie uma campanha WL antes de salvar.", "warning");
      setConfirmSaveOpen(false);
      return;
    }

    onAddMatch?.({
      id: crypto.randomUUID(),
      campaignId: form.campaignId,
      date: form.date,
      result: form.result,
      goalsFor: Number(form.goalsFor),
      goalsAgainst: Number(form.goalsAgainst),
      formationUsed: form.formationUsed,
      rival: form.rival,
      rankGoal: Number(form.rankGoal),
      notes: form.notes,
      players: form.rows.filter((row) => row.playerId),
    });

    setMessage("Partida salva com sucesso.");
    setConfirmSaveOpen(false);

    setForm({
      date: new Date().toISOString().slice(0, 10),
      campaignId: selectedCampaign?.id || activeCampaign?.id || "",
      savedTeamId: "",
      result: "win",
      goalsFor: 0,
      goalsAgainst: 0,
      formationUsed: "4-4-2",
      rival: "",
      rankGoal:
        selectedCampaign?.totalMatches || activeCampaign?.totalMatches || 15,
      notes: "",
      rows: players.map((player) => createRow(player.id)),
    });
  }

  function handleCreateCampaign() {
    const trimmedName = campaignForm.name.trim();

    if (!trimmedName) {
      setMessage("Digite um nome para a nova campanha.", "warning");
      return;
    }

    const newCampaign = {
      id: crypto.randomUUID(),
      name: trimmedName,
      startDate: new Date().toISOString().slice(0, 10),
      totalMatches: Number(campaignForm.totalMatches) || 15,
      isActive: true,
      isFinished: false,
      createdAt: new Date().toISOString(),
    };

    onAddCampaign?.(newCampaign);

    setForm((current) => ({
      ...current,
      campaignId: newCampaign.id,
      rankGoal: newCampaign.totalMatches,
    }));

    setCampaignForm({
      name: `WL ${new Date().toLocaleDateString("pt-BR")}`,
      totalMatches: 15,
    });

    setCampaignDialogOpen(false);
    setMessage(`Campanha "${newCampaign.name}" criada com sucesso.`);
  }

  function handleFinishCampaign() {
    if (!selectedCampaign) {
      setMessage("Nenhuma campanha selecionada.", "warning");
      return;
    }

    onFinishCampaign?.(selectedCampaign.id);
    setFinishDialogOpen(false);
    setMessage(`Campanha "${selectedCampaign.name}" finalizada com sucesso.`);
  }

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Nova partida"
        subtitle="Registro mais rico e rápido, em uma tela só."
      >
        <Stack spacing={2.5}>
          {selectedCampaign ? (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              useFlexGap
              flexWrap="wrap"
            >
              <Chip
                color="secondary"
                variant="outlined"
                label={selectedCampaign.name}
              />
              <Chip
                color="primary"
                variant="outlined"
                label={`Partida ${String(currentMatchNumber).padStart(2, "0")}/${selectedCampaign.totalMatches}`}
              />
              <Chip
                variant="outlined"
                label={`${campaignSummary.wins}W / ${campaignSummary.losses}L`}
              />
            </Stack>
          ) : (
            <Alert severity="warning">
              Nenhuma campanha ativa selecionada. Crie ou escolha uma campanha WL.
            </Alert>
          )}

          {feedback ? <Alert severity={feedbackSeverity}>{feedback}</Alert> : null}

          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Campanha WL"
                value={form.campaignId}
                onChange={(e) => {
                  const nextCampaign =
                    campaigns.find((campaign) => campaign.id === e.target.value) ||
                    null;

                  setForm((current) => ({
                    ...current,
                    campaignId: e.target.value,
                    rankGoal: nextCampaign?.totalMatches || current.rankGoal,
                  }));
                }}
                fullWidth
              >
                {campaigns.map((campaign) => (
                  <MenuItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                    {campaign.isFinished ? " (Finalizada)" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FlagRoundedIcon />}
                onClick={() => setCampaignDialogOpen(true)}
                fullWidth
                sx={{ height: "56px" }}
              >
                Nova campanha
              </Button>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<StopCircleRoundedIcon />}
                onClick={() => setFinishDialogOpen(true)}
                fullWidth
                sx={{ height: "56px" }}
                disabled={!selectedCampaign || selectedCampaign.isFinished}
              >
                Finalizar
              </Button>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
                sx={{ height: "56px" }}
                disabled={!selectedCampaign}
              >
                Excluir campanha
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Time salvo"
                value={form.savedTeamId}
                onChange={(e) => handleApplySavedTeam(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Nenhum</MenuItem>
                {savedTeams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Data"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Resultado"
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                fullWidth
              >
                <MenuItem value="win">Vitória</MenuItem>
                <MenuItem value="loss">Derrota</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: "flex-start", md: "center" }}
                sx={{ height: "100%" }}
              >
                <SportsSoccerRoundedIcon color="primary" />
                <Typography variant="overline" color="text.secondary">
                  Placar
                </Typography>
                <Typography sx={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>
                  {form.goalsFor} x {form.goalsAgainst}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Gols pró"
                type="number"
                value={form.goalsFor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    goalsFor: Math.max(0, Math.min(15, Number(e.target.value) || 0)),
                  })
                }
                inputProps={{ min: 0, max: 15 }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Gols contra"
                type="number"
                value={form.goalsAgainst}
                onChange={(e) =>
                  setForm({
                    ...form,
                    goalsAgainst: Math.max(
                      0,
                      Math.min(15, Number(e.target.value) || 0)
                    ),
                  })
                }
                inputProps={{ min: 0, max: 15 }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Formação"
                value={form.formationUsed}
                onChange={(e) =>
                  setForm({ ...form, formationUsed: e.target.value })
                }
                fullWidth
              >
                {formationOptions.map((formation) => (
                  <MenuItem key={formation} value={formation}>
                    {formation}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Adversário / estilo"
                value={form.rival}
                onChange={(e) => setForm({ ...form, rival: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Meta de wins"
                type="number"
                value={form.rankGoal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rankGoal: Math.max(0, Math.min(15, Number(e.target.value) || 0)),
                  })
                }
                inputProps={{ min: 0, max: 15 }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={10}>
              <TextField
                label="Observações táticas"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                minRows={2}
                multiline
                fullWidth
              />
            </Grid>
          </Grid>

          {hasScoreMismatch ? (
            <Alert severity="warning">
              A soma de gols dos jogadores não bate com o placar da partida.
            </Alert>
          ) : null}

          <SectionCard
            title="Jogadores da partida"
            subtitle="Agora você escolhe a nova linha e não pode repetir jogador."
          >
            <Stack spacing={2}>
              {form.rows.map((row) => {
                const player =
                  players.find((item) => item.id === row.playerId) || null;

                return (
                  <Grid container spacing={1.5} key={row.id} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="text"
                        sx={{
                          justifyContent: "flex-start",
                          minWidth: 0,
                          color: "inherit",
                          width: "100%",
                        }}
                        startIcon={
                          <Avatar
                            src={player?.photo}
                            alt={player?.name || "Jogador"}
                          >
                            {(player?.name || "J")[0]}
                          </Avatar>
                        }
                        onClick={() => player && setPreview(player)}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ minWidth: 0 }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {player?.name || "Jogador"}
                          </Typography>
                          <Chip label={player?.position || "POS"} size="small" />
                        </Stack>
                      </Button>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        select
                        label="Jogador"
                        value={row.playerId}
                        onChange={(e) =>
                          updateRow(row.id, { playerId: e.target.value })
                        }
                        fullWidth
                      >
                        <MenuItem value="">Selecionar jogador</MenuItem>
                        {getAvailablePlayers(row.id).map((playerOption) => (
                          <MenuItem key={playerOption.id} value={playerOption.id}>
                            {playerOption.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={6} md={1}>
                      <TextField
                        label="Gols"
                        type="number"
                        value={row.goals}
                        onChange={(e) =>
                          updateRow(row.id, {
                            goals: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6} md={1}>
                      <TextField
                        label="Ast"
                        type="number"
                        value={row.assists}
                        onChange={(e) =>
                          updateRow(row.id, {
                            assists: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6} md={1}>
                      <TextField
                        label="Nota"
                        type="number"
                        value={row.rating}
                        onChange={(e) =>
                          updateRow(row.id, {
                            rating: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <TextField
                        select
                        label="MVP"
                        value={row.mvp ? "1" : "0"}
                        onChange={(e) =>
                          updateRow(row.id, { mvp: e.target.value === "1" })
                        }
                        fullWidth
                      >
                        <MenuItem value="0">Não</MenuItem>
                        <MenuItem value="1">Sim</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={6} md={1}>
                      <TextField
                        label="Defesas"
                        type="number"
                        value={row.saves}
                        onChange={(e) =>
                          updateRow(row.id, {
                            saves: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6} md={1}>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          color="secondary"
                          onClick={() => duplicateRow(row)}
                        >
                          <ContentCopyRoundedIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => removeRow(row.id)}
                        >
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>
          </SectionCard>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
          >
            <Typography>
              Soma de gols pelos jogadores: <b>{totalGoalsFromRows}</b>
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={addRow}
                disabled={!canAddMoreRows}
              >
                Adicionar linha
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<SaveRoundedIcon />}
                onClick={handleOpenSaveDialog}
              >
                Salvar partida
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </SectionCard>

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{preview?.name}</DialogTitle>
        <DialogContent>
          {preview ? (
            <FutCard
              player={preview}
              snapshot={getPlayerSnapshot(preview, matches)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Excluir campanha</DialogTitle>

        <DialogContent>
          <Typography sx={{ pt: 1 }}>
            Tem certeza que deseja excluir a campanha
            <b> {selectedCampaign?.name}</b>?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Todas as partidas dessa campanha também serão removidas.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteCampaignConfirm}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar salvamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>Deseja salvar esta partida?</Typography>

            <Typography variant="body2" color="text.secondary">
              Campanha: {selectedCampaign?.name || "Não selecionada"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Placar: {form.goalsFor} x {form.goalsAgainst}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Resultado: {form.result === "win" ? "Vitória" : "Derrota"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Jogadores na partida: {form.rows.filter((row) => row.playerId).length}
            </Typography>

            {hasScoreMismatch ? (
              <Alert severity="warning">
                A soma dos gols dos jogadores não bate com o placar informado.
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmSaveOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SaveRoundedIcon />}
            onClick={saveMatch}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={campaignDialogOpen}
        onClose={() => setCampaignDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
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
                  totalMatches: Math.max(
                    1,
                    Math.min(30, Number(e.target.value) || 15)
                  ),
                }))
              }
              inputProps={{ min: 1, max: 30 }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCampaignDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<FlagRoundedIcon />}
            onClick={handleCreateCampaign}
          >
            Criar campanha
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={finishDialogOpen}
        onClose={() => setFinishDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Resumo final da WL</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography>
              Campanha: <b>{selectedCampaign?.name || "-"}</b>
            </Typography>
            <Typography>
              Resultado final: <b>{campaignSummary.wins}</b> vitórias e{" "}
              <b>{campaignSummary.losses}</b> derrotas
            </Typography>
            <Typography>
              Gols pró: <b>{campaignSummary.goalsFor}</b>
            </Typography>
            <Typography>
              Gols contra: <b>{campaignSummary.goalsAgainst}</b>
            </Typography>
            <Typography>
              Artilheiro: <b>{campaignSummary.topScorer?.player?.name || "-"}</b>
            </Typography>
            <Typography>
              Líder em assistências:{" "}
              <b>{campaignSummary.topAssist?.player?.name || "-"}</b>
            </Typography>
            <Typography>
              Mais MVPs: <b>{campaignSummary.topMvp?.player?.name || "-"}</b>
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFinishDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<StopCircleRoundedIcon />}
            onClick={handleFinishCampaign}
          >
            Confirmar finalização
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

