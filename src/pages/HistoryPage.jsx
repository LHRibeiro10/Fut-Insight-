import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
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
import { formatDate, getResultColor, getResultLabel } from "../utils/format";

function createEditableRows(match) {
  return Array.isArray(match?.players)
    ? match.players.map((row) => ({ ...row }))
    : [];
}

export default function HistoryPage({
  matches = [],
  players = [],
  campaigns = [],
  onDeleteMatch,
  onUpdateMatch,
}) {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("all");
  const [campaignId, setCampaignId] = useState("all");
  const [editingMatch, setEditingMatch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const safeMatches = Array.isArray(matches) ? matches : [];
  const safePlayers = Array.isArray(players) ? players : [];
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const rows = useMemo(() => {
    return [...safeMatches]
      .reverse()
      .filter((match) => {
        if (result !== "all" && match.result !== result) return false;
        if (campaignId !== "all" && match.campaignId !== campaignId) return false;

        const haystack =
          `${match.rival || ""} ${match.formationUsed || ""} ${match.notes || ""}`.toLowerCase();

        return haystack.includes(search.toLowerCase());
      });
  }, [safeMatches, search, result, campaignId]);

  function getMvpName(match) {
    const mvpRow = match.players?.find((row) => row.mvp);
    const mvp = safePlayers.find((player) => player.id === mvpRow?.playerId);
    return mvp?.name || "-";
  }

  function getCampaignName(id) {
    return safeCampaigns.find((campaign) => campaign.id === id)?.name || "-";
  }

  function openEditDialog(match) {
    setEditingMatch({
      ...match,
      players: createEditableRows(match),
    });
  }

  function handleEditRow(index, patch) {
    setEditingMatch((current) => {
      if (!current) return current;

      const nextPlayers = current.players.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      );

      return {
        ...current,
        players: nextPlayers,
      };
    });
  }

  function handleSaveEditedMatch() {
    if (!editingMatch) return;

    onUpdateMatch?.(editingMatch.id, {
      ...editingMatch,
      goalsFor: Number(editingMatch.goalsFor || 0),
      goalsAgainst: Number(editingMatch.goalsAgainst || 0),
      rankGoal: Number(editingMatch.rankGoal || 0),
      players: editingMatch.players.map((row) => ({
        ...row,
        goals: Number(row.goals || 0),
        assists: Number(row.assists || 0),
        rating: Number(row.rating || 0),
        saves: Number(row.saves || 0),
      })),
    });

    setEditingMatch(null);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    onDeleteMatch?.(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Histórico"
        subtitle="Agora com busca, filtro por campanha, edição e exclusão."
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              placeholder="Buscar por formação, notas ou estilo do adversário"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3.5 }}>
            <TextField
              select
              fullWidth
              label="Resultado"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="win">Vitória</MenuItem>
              <MenuItem value="loss">Derrota</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 3.5 }}>
            <TextField
              select
              fullWidth
              label="Campanha"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              {safeCampaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Campanha</TableCell>
              <TableCell>Resultado</TableCell>
              <TableCell>Placar</TableCell>
              <TableCell>Formação</TableCell>
              <TableCell>Adversário</TableCell>
              <TableCell>MVP</TableCell>
              <TableCell>Meta</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((match) => (
              <TableRow key={match.id} hover>
                <TableCell>{formatDate(match.date)}</TableCell>
                <TableCell>{getCampaignName(match.campaignId)}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={getResultLabel(match.result)}
                    color={getResultColor(match.result)}
                  />
                </TableCell>

                <TableCell>
                  {match.goalsFor} x {match.goalsAgainst}
                </TableCell>

                <TableCell>{match.formationUsed || "-"}</TableCell>

                <TableCell>
                  <Stack spacing={0.4}>
                    <Typography>{match.rival || "-"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {match.notes || "Sem observações"}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell>{getMvpName(match)}</TableCell>
                <TableCell>{match.rankGoal ?? "-"} wins</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton color="primary" onClick={() => openEditDialog(match)}>
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => setDeleteTarget(match)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography color="text.secondary">
                    Nenhuma partida encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </SectionCard>

      <Dialog
        open={Boolean(editingMatch)}
        onClose={() => setEditingMatch(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar partida</DialogTitle>
        <DialogContent>
          {editingMatch ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Data"
                    type="date"
                    value={editingMatch.date}
                    onChange={(e) =>
                      setEditingMatch({ ...editingMatch, date: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    select
                    label="Resultado"
                    value={editingMatch.result}
                    onChange={(e) =>
                      setEditingMatch({ ...editingMatch, result: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value="win">Vitória</MenuItem>
                    <MenuItem value="loss">Derrota</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    label="Gols pró"
                    type="number"
                    value={editingMatch.goalsFor}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        goalsFor: Number(e.target.value || 0),
                      })
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    label="Gols contra"
                    type="number"
                    value={editingMatch.goalsAgainst}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        goalsAgainst: Number(e.target.value || 0),
                      })
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    label="Meta"
                    type="number"
                    value={editingMatch.rankGoal}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        rankGoal: Number(e.target.value || 0),
                      })
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Formação"
                    value={editingMatch.formationUsed || ""}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        formationUsed: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Adversário"
                    value={editingMatch.rival || ""}
                    onChange={(e) =>
                      setEditingMatch({ ...editingMatch, rival: e.target.value })
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    label="Observações"
                    value={editingMatch.notes || ""}
                    onChange={(e) =>
                      setEditingMatch({ ...editingMatch, notes: e.target.value })
                    }
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>

              <SectionCard
                title="Jogadores da partida"
                subtitle="Edite os números desta partida por jogador."
              >
                <Stack spacing={1.5}>
                  {editingMatch.players.map((row, index) => {
                    const player =
                      safePlayers.find((item) => item.id === row.playerId) || null;

                    return (
                      <Grid container spacing={1.5} key={`${row.playerId}-${index}`}>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <Typography sx={{ fontWeight: 700 }}>
                            {player?.name || "Jogador"}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, md: 1.5 }}>
                          <TextField
                            label="Gols"
                            type="number"
                            value={row.goals}
                            onChange={(e) =>
                              handleEditRow(index, {
                                goals: Number(e.target.value || 0),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 6, md: 1.5 }}>
                          <TextField
                            label="Ast"
                            type="number"
                            value={row.assists}
                            onChange={(e) =>
                              handleEditRow(index, {
                                assists: Number(e.target.value || 0),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 6, md: 1.5 }}>
                          <TextField
                            label="Nota"
                            type="number"
                            value={row.rating}
                            onChange={(e) =>
                              handleEditRow(index, {
                                rating: Number(e.target.value || 0),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 6, md: 1.5 }}>
                          <TextField
                            label="Defesas"
                            type="number"
                            value={row.saves}
                            onChange={(e) =>
                              handleEditRow(index, {
                                saves: Number(e.target.value || 0),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>
                          <TextField
                            select
                            label="MVP"
                            value={row.mvp ? "1" : "0"}
                            onChange={(e) =>
                              handleEditRow(index, {
                                mvp: e.target.value === "1",
                              })
                            }
                            fullWidth
                          >
                            <MenuItem value="0">Não</MenuItem>
                            <MenuItem value="1">Sim</MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
              </SectionCard>
            </Stack>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditingMatch(null)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={handleSaveEditedMatch}
          >
            Salvar alterações
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <WarningAmberRoundedIcon sx={{ color: "#f4d35e", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Excluir partida
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Deseja realmente excluir esta partida do histórico?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
              Esta ação remove permanentemente o registro da partida e impacta as
              estatísticas da campanha.
            </Typography>

            {deleteTarget ? (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography variant="body2">
                  <b>Data:</b> {formatDate(deleteTarget.date)}
                </Typography>
                <Typography variant="body2">
                  <b>Campanha:</b> {getCampaignName(deleteTarget.campaignId)}
                </Typography>
                <Typography variant="body2">
                  <b>Placar:</b> {deleteTarget.goalsFor} x {deleteTarget.goalsAgainst}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}