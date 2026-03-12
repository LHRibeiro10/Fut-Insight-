import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Avatar,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import FutCard from '@/shared/components/cards/FutCard';
import SectionCard from '@/shared/components/cards/SectionCard';
import { getPlayerSnapshot } from '@/shared/lib/stats';
import {
  applyAliases,
  normalizeText,
  pickBestMatch,
} from "@/shared/lib/searchUtils";
import { searchPlayers } from "@/shared/lib/searchPlayers";

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/123';

const emptyForm = {
  name: '',
  position: '',
  overall: 85,
  club: '',
  nation: '',
  nationFlag: '',
  preferredFoot: 'Direito',
  notes: '',
  photo: '',
  clubBadge: '',
  cardType: 'gold',
};

function normalize(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados: ${response.status}`);
  }

  return response.json();
}

const ASSETS_CACHE_KEY = "wl_tracker_assets_cache";

function readAssetsCache() {
  try {
    return JSON.parse(localStorage.getItem(ASSETS_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAssetsCache(cache) {
  localStorage.setItem(ASSETS_CACHE_KEY, JSON.stringify(cache));
}

function buildAssetCacheKey({ name, club, nation }) {
  return `${normalizeText(name)}__${normalizeText(club)}__${normalizeText(nation)}`;
}

export default function PlayersPage({
  players = [],
  matches = [],
  onAddPlayer,
  onImportData,
  onExportData,
  onUpdatePlayer,
  onDeletePlayer,
}) {
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedPlayerPreview, setSavedPlayerPreview] = useState(null);
  const [highlightPlayerId, setHighlightPlayerId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [playerDatabase, setPlayerDatabase] = useState([]);
  const [databaseStatus, setDatabaseStatus] = useState("loading");

  const [rosterSearch, setRosterSearch] = useState("");
  const [rosterPosition, setRosterPosition] = useState("all");
  const [rosterCardType, setRosterCardType] = useState("all");
  const [rosterSort, setRosterSort] = useState("overall");

  const rosterSectionRef = useRef(null);

  const safePlayers = Array.isArray(players) ? players : [];
  const safeMatches = Array.isArray(matches) ? matches : [];

  useEffect(() => {
    let active = true;

    import("@/shared/data/futMiniDatabase")
      .then(({ default: data }) => {
        if (!active) return;

        startTransition(() => {
          setPlayerDatabase(Array.isArray(data) ? data : []);
          setDatabaseStatus("ready");
        });
      })
      .catch(() => {
        if (active) {
          setDatabaseStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPlayers = useMemo(() => {
    if (playerDatabase.length === 0) return [];
    if (!form.name || form.name.trim().length < 2) return [];
    return searchPlayers(playerDatabase, form.name, 20);
  }, [form.name, playerDatabase]);

  const playerSuggestions = useMemo(() => {
    return filteredPlayers.map((item) => ({
      label: `${item.name} • ${item.overall} • ${item.position} • ${item.club}`,
      value: item,
    }));
  }, [filteredPlayers]);

  const clubSuggestions = useMemo(() => {
    const uniqueClubs = [...new Set(playerDatabase.map((item) => item.club).filter(Boolean))];
    return uniqueClubs.sort();
  }, [playerDatabase]);

  const nationSuggestions = useMemo(() => {
    const uniqueNations = [...new Set(playerDatabase.map((item) => item.nation).filter(Boolean))];
    return uniqueNations.sort();
  }, [playerDatabase]);

  const playersWithSnapshot = useMemo(
    () =>
      safePlayers.map((player) => ({
        player,
        snapshot: getPlayerSnapshot(player, safeMatches),
      })),
    [safePlayers, safeMatches]
  );

  const displayedPlayers = useMemo(() => {
    const searchValue = rosterSearch.toLowerCase();

    const filtered = playersWithSnapshot.filter(({ player }) => {
      const matchesSearch =
        !searchValue ||
        `${player?.name || ""} ${player?.club || ""} ${player?.nation || ""}`
          .toLowerCase()
          .includes(searchValue);

      const matchesPosition =
        rosterPosition === "all" ||
        (player?.position || "").toUpperCase() === rosterPosition;

      const matchesCardType =
        rosterCardType === "all" ||
        (player?.cardType || "gold").toLowerCase() === rosterCardType;

      return matchesSearch && matchesPosition && matchesCardType;
    });

    return [...filtered].sort((a, b) => {
      if (rosterSort === "overall") {
        return (b.player?.overall || 0) - (a.player?.overall || 0);
      }

      if (rosterSort === "goals") {
        return (b.snapshot?.goals || 0) - (a.snapshot?.goals || 0);
      }

      if (rosterSort === "assists") {
        return (b.snapshot?.assists || 0) - (a.snapshot?.assists || 0);
      }

      if (rosterSort === "rating") {
        return (b.snapshot?.averageRating || 0) - (a.snapshot?.averageRating || 0);
      }

      if (rosterSort === "matches") {
        return (b.snapshot?.matchesPlayed || 0) - (a.snapshot?.matchesPlayed || 0);
      }

      return (a.player?.name || "").localeCompare(b.player?.name || "");
    });
  }, [playersWithSnapshot, rosterSearch, rosterPosition, rosterCardType, rosterSort]);

  function handleEdit(player) {
    setForm({
      name: player?.name || '',
      position: player?.position || '',
      overall: player?.overall ?? 85,
      club: player?.club || '',
      nation: player?.nation || '',
      nationFlag: player?.nationFlag || '',
      preferredFoot: player?.preferredFoot || 'Direito',
      notes: player?.notes || '',
      photo: player?.photo || '',
      clubBadge: player?.clubBadge || '',
      cardType: player?.cardType || 'gold',
    });

    setEditingId(player.id);
    setFeedback('Editando jogador.');
  }

  async function handlePlayerAutocomplete(selectedOption) {
    if (!selectedOption?.value) return;

    const player = selectedOption.value;

    setForm((current) => ({
      ...current,
      name: player.name || current.name,
      position: player.position || current.position,
      overall: player.overall ?? current.overall,
      club: player.club || current.club,
      nation: player.nation || current.nation,
      preferredFoot: player.preferredFoot || current.preferredFoot,
      cardType: player.cardType || current.cardType,
      photo: player.photo || current.photo || "",
      clubBadge: player.clubBadge || current.clubBadge || "",
      nationFlag: player.nationFlag || current.nationFlag || "",
    }));

    setFeedback(`Sugestão aplicada: ${player.name}`);

    await handleAutoFillFromSelectedPlayer(player);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.position.trim()) {
      setFeedback('Preencha ao menos nome e posição.');
      return;
    }

    const playerData = {
      ...form,
    };

    try {
      if (editingId) {
        await onUpdatePlayer?.(editingId, playerData);
        setFeedback('Jogador atualizado com sucesso.');
      } else {
        const createdPlayer = (await onAddPlayer?.(playerData)) || null;
        setSavedPlayerPreview(createdPlayer || playerData);
        setSaveDialogOpen(true);

        if (createdPlayer?.id) {
          setHighlightPlayerId(createdPlayer.id);
          setTimeout(() => setHighlightPlayerId(null), 4000);
        }

        setFeedback('Jogador salvo com sucesso.');
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setFeedback('Nao foi possivel salvar este jogador agora.');
    }
  }

  function handleViewInRoster() {
    setSaveDialogOpen(false);

    setTimeout(() => {
      rosterSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }

  function handleClearPlayerSearch() {
    setForm((current) => ({
      ...emptyForm,
      preferredFoot: current.preferredFoot || "Direito",
      cardType: current.cardType || "gold",
    }));

    setFeedback("");
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;

    onDeletePlayer?.(deleteTarget.id);

    if (editingId === deleteTarget.id) {
      setForm(emptyForm);
      setEditingId(null);
    }

    setFeedback('Jogador excluído com sucesso.');
    setDeleteTarget(null);
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setFeedback('Edição cancelada.');
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        await onImportData?.(parsed);
        setFeedback('Backup importado com sucesso.');
      } catch {
        setFeedback('Arquivo inválido. Use um JSON exportado pelo app.');
      }
    };

    reader.readAsText(file);
  }

  function handleImageUpload(field, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        [field]: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  }

  async function fetchNationFlag(countryName) {
    if (!countryName?.trim()) return "";

    try {
      const normalizedCountry = applyAliases(countryName, "country");

      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(normalizedCountry)}?fields=name,flags,altSpellings`
      );

      if (!response.ok) return "";

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return "";

      const wanted = normalizeText(normalizedCountry);

      const best =
        data.find((item) => {
          const common = normalizeText(item?.name?.common || "");
          const official = normalizeText(item?.name?.official || "");
          const altSpellings = Array.isArray(item?.altSpellings)
            ? item.altSpellings.map((alt) => normalizeText(alt))
            : [];

          return (
            common === wanted ||
            official === wanted ||
            altSpellings.includes(wanted)
          );
        }) || data[0];

      return best?.flags?.png || best?.flags?.svg || "";
    } catch {
      return "";
    }
  }

  async function searchPlayerAssets({ name, club }) {
    const possibleNames = [
      name,
      applyAliases(name, "player"),
      normalizeText(name),
    ].filter(Boolean);

    let bestPlayer = null;
    let bestTeam = null;

    for (const possibleName of possibleNames) {
      const playerUrl = `${API_BASE}/searchplayers.php?p=${encodeURIComponent(possibleName)}`;
      const playerData = await fetchJson(playerUrl);

      const matchedPlayer = pickBestMatch(playerData?.player || [], {
        wantedName: name,
        wantedClub: club,
        getName: (item) => item?.strPlayer || "",
        getClub: (item) => item?.strTeam || "",
        minScore: 0.42,
      });

      if (matchedPlayer) {
        bestPlayer = matchedPlayer;
        break;
      }
    }

    const possibleClubs = [
      club,
      applyAliases(club, "club"),
      normalizeText(club),
    ].filter(Boolean);

    for (const possibleClub of possibleClubs) {
      const teamUrl = `${API_BASE}/searchteams.php?t=${encodeURIComponent(possibleClub)}`;
      const teamData = await fetchJson(teamUrl);

      const matchedTeam = pickBestMatch(teamData?.teams || [], {
        wantedName: club,
        wantedClub: club,
        getName: (item) => item?.strTeam || "",
        getClub: (item) => item?.strTeam || "",
        minScore: 0.40,
      });

      if (matchedTeam) {
        bestTeam = matchedTeam;
        break;
      }
    }

    return {
      player: bestPlayer,
      team: bestTeam,
    };
  }

  async function handleAutoFillFromSelectedPlayer(player) {
    if (!player) return;

    try {
      setLoadingAssets(true);
      setFeedback("Buscando foto, escudo e bandeira...");

      const cacheKey = buildAssetCacheKey({
        name: player.name,
        club: player.club,
        nation: player.nation,
      });

      const cache = readAssetsCache();
      const cachedAssets = cache[cacheKey];

      if (cachedAssets) {
        setForm((current) => ({
          ...current,
          photo: current.photo || cachedAssets.photo || "",
          clubBadge: current.clubBadge || cachedAssets.clubBadge || "",
          nationFlag: current.nationFlag || cachedAssets.nationFlag || "",
        }));

        setFeedback("Assets carregados do cache.");
        return;
      }

      const [{ player: apiPlayer, team }, autoNationFlag] = await Promise.all([
        searchPlayerAssets({
          name: player.name,
          club: player.club,
        }),
        fetchNationFlag(player.nation),
      ]);

      const autoPhoto =
        apiPlayer?.strCutout ||
        apiPlayer?.strRender ||
        apiPlayer?.strThumb ||
        apiPlayer?.strFanart1 ||
        "";

      const autoClubBadge =
        team?.strBadge ||
        team?.strLogo ||
        "";

      cache[cacheKey] = {
        photo: autoPhoto || "",
        clubBadge: autoClubBadge || "",
        nationFlag: autoNationFlag || "",
      };

      writeAssetsCache(cache);

      setForm((current) => ({
        ...current,
        photo: current.photo || autoPhoto || "",
        clubBadge: current.clubBadge || autoClubBadge || "",
        nationFlag: current.nationFlag || autoNationFlag || "",
      }));

      if (autoPhoto || autoClubBadge || autoNationFlag) {
        setFeedback("Imagem do jogador, escudo e bandeira preenchidos automaticamente.");
      } else {
        setFeedback("Nenhum asset automático encontrado para esse jogador.");
      }
    } catch {
      setFeedback("Não foi possível fazer o autofill agora.");
    } finally {
      setLoadingAssets(false);
    }
  }

  async function handleAutoFillAssets() {
    if (!form.name.trim() || !form.club.trim()) {
      setFeedback("Preencha ao menos nome e clube para buscar foto e escudo.");
      return;
    }

    const cacheKey = buildAssetCacheKey({
      name: form.name,
      club: form.club,
      nation: form.nation,
    });

    const cache = readAssetsCache();
    const cachedAssets = cache[cacheKey];

    if (cachedAssets) {
      setForm((current) => ({
        ...current,
        photo: current.photo || cachedAssets.photo || "",
        clubBadge: current.clubBadge || cachedAssets.clubBadge || "",
        nationFlag: current.nationFlag || cachedAssets.nationFlag || "",
      }));

      setFeedback("Assets carregados do cache.");
      return;
    }

    try {
      setLoadingAssets(true);
      setFeedback("Buscando foto, escudo e bandeira...");

      const [{ player, team }, autoNationFlag] = await Promise.all([
        searchPlayerAssets({
          name: form.name,
          club: form.club,
        }),
        fetchNationFlag(form.nation),
      ]);

      const autoPhoto =
        player?.strCutout ||
        player?.strRender ||
        player?.strThumb ||
        player?.strFanart1 ||
        "";

      const autoClubBadge =
        team?.strBadge ||
        team?.strLogo ||
        "";

      cache[cacheKey] = {
        photo: autoPhoto || "",
        clubBadge: autoClubBadge || "",
        nationFlag: autoNationFlag || "",
      };

      writeAssetsCache(cache);

      setForm((current) => ({
        ...current,
        photo: current.photo || autoPhoto || "",
        clubBadge: current.clubBadge || autoClubBadge || "",
        nationFlag: current.nationFlag || autoNationFlag || "",
      }));

      if (autoPhoto || autoClubBadge || autoNationFlag) {
        setFeedback("Imagem do jogador, escudo e bandeira preenchidos automaticamente.");
      } else {
        setFeedback("Não encontrei imagens automáticas para esse jogador/clube/país.");
      }
    } catch {
      setFeedback("Não foi possível fazer o autofill agora.");
    } finally {
      setLoadingAssets(false);
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            title={editingId ? 'Editar jogador' : 'Adicionar jogador'}
            subtitle="Monte seu elenco e acompanhe estatísticas individuais."
          >
            <Stack component="form" spacing={2} onSubmit={handleSubmit}>
              {feedback ? <Alert severity="info">{feedback}</Alert> : null}
              {databaseStatus === "loading" ? (
                <Alert severity="info">
                  Carregando base de sugestoes de jogadores...
                </Alert>
              ) : null}
              {databaseStatus === "error" ? (
                <Alert severity="warning">
                  Nao foi possivel carregar a base de sugestoes automaticamente.
                </Alert>
              ) : null}

              <Autocomplete
                freeSolo
                options={playerSuggestions}
                filterOptions={(x) => x}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return option?.value?.name || "";
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ py: 1 }}>
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
                      <Avatar
                        src={option.value.photo || ""}
                        alt={option.value.name || "Jogador"}
                        sx={{ width: 38, height: 38 }}
                      >
                        {(option.value.name || "J")[0]}
                      </Avatar>

                      <Stack spacing={0.15} sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                          {option.value.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1 }}>
                          {option.value.overall} • {option.value.position} • {option.value.club} • {option.value.nation}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                )}
                onChange={async (_, value) => {
                  if (value === null) {
                    handleClearPlayerSearch();
                    return;
                  }

                  if (typeof value === "string") {
                    setForm((current) => ({ ...current, name: value }));
                    return;
                  }

                  if (value?.value) {
                    await handlePlayerAutocomplete(value);
                  }
                }}
                inputValue={form.name}
                onInputChange={(_, value, reason) => {
                  if (reason === "input") {
                    setForm((current) => ({ ...current, name: value }));
                  }

                  if (reason === "clear") {
                    handleClearPlayerSearch();
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nome"
                    fullWidth
                  />
                )}
              />

              <TextField
                label="Posição"
                placeholder="ATA, MOC, ZAG, GOL"
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value.toUpperCase() })
                }
                fullWidth
              />

              <TextField
                label="Overall"
                type="number"
                value={form.overall}
                onChange={(e) =>
                  setForm({
                    ...form,
                    overall: Math.max(60, Math.min(99, Number(e.target.value) || 60)),
                  })
                }
                inputProps={{ min: 60, max: 99 }}
                fullWidth
              />

              <Autocomplete
                freeSolo
                options={clubSuggestions}
                value={form.club}
                onChange={(_, value) => {
                  setForm((current) => ({
                    ...current,
                    club: value || "",
                  }));
                }}
                inputValue={form.club}
                onInputChange={(_, value) => {
                  setForm((current) => ({
                    ...current,
                    club: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Clube"
                    fullWidth
                  />
                )}
              />

              <Button
                variant="outlined"
                onClick={handleAutoFillAssets}
                disabled={loadingAssets}
                startIcon={<SearchRoundedIcon />}
              >
                {loadingAssets ? 'Buscando...' : 'Buscar foto, escudo e bandeira'}
              </Button>

              <Autocomplete
                freeSolo
                options={nationSuggestions}
                value={form.nation}
                onChange={(_, value) => {
                  setForm((current) => ({
                    ...current,
                    nation: value || "",
                  }));
                }}
                inputValue={form.nation}
                onInputChange={(_, value) => {
                  setForm((current) => ({
                    ...current,
                    nation: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nação"
                    fullWidth
                  />
                )}
              />

              <TextField
                select
                label="Pé preferido"
                value={form.preferredFoot}
                onChange={(e) =>
                  setForm({ ...form, preferredFoot: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="Direito">Direito</MenuItem>
                <MenuItem value="Esquerdo">Esquerdo</MenuItem>
                <MenuItem value="Ambidestro">Ambidestro</MenuItem>
              </TextField>

              <TextField
                select
                label="Tipo da carta"
                value={form.cardType}
                onChange={(e) => setForm({ ...form, cardType: e.target.value })}
                fullWidth
              >
                <MenuItem value="bronze">Bronze</MenuItem>
                <MenuItem value="silver">Prata</MenuItem>
                <MenuItem value="gold">Ouro</MenuItem>
                <MenuItem value="totw">TOTW</MenuItem>
                <MenuItem value="icon">Icon</MenuItem>
                <MenuItem value="hero">Hero</MenuItem>
              </TextField>

              <TextField
                label="Observações"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                minRows={3}
                multiline
                fullWidth
              />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Imagem do jogador</Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={form.photo}
                    alt={form.name || 'Jogador'}
                    sx={{ width: 56, height: 56 }}
                  >
                    {form.name?.[0] || 'J'}
                  </Avatar>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateRoundedIcon />}
                  >
                    Importar foto
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('photo', e)}
                    />
                  </Button>
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Escudo do clube</Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={form.clubBadge}
                    alt={form.club || 'Clube'}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  >
                    <ImageRoundedIcon />
                  </Avatar>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageRoundedIcon />}
                  >
                    Importar escudo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('clubBadge', e)}
                    />
                  </Button>
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Bandeira da nação</Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={form.nationFlag}
                    alt={form.nation || 'Nação'}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  >
                    <ImageRoundedIcon />
                  </Avatar>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageRoundedIcon />}
                  >
                    Importar bandeira
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('nationFlag', e)}
                    />
                  </Button>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<SaveRoundedIcon />}
                  fullWidth
                >
                  {editingId ? 'Atualizar jogador' : 'Salvar jogador'}
                </Button>

                {editingId ? (
                  <Button variant="outlined" onClick={handleCancelEdit} fullWidth>
                    Cancelar
                  </Button>
                ) : null}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onExportData}
                  startIcon={<UploadFileRoundedIcon />}
                >
                  Exportar JSON
                </Button>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateRoundedIcon />}
                >
                  Importar JSON
                  <input
                    hidden
                    type="file"
                    accept="application/json"
                    onChange={handleImport}
                  />
                </Button>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }} ref={rosterSectionRef}>
          <SectionCard
            title="Elenco & estatísticas"
            subtitle="Agora com busca, filtros e ordenação inteligente."
          >
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Buscar no elenco"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2.6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Posição"
                    value={rosterPosition}
                    onChange={(e) => setRosterPosition(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="GOL">GOL</MenuItem>
                    <MenuItem value="ZAG">ZAG</MenuItem>
                    <MenuItem value="LD">LD</MenuItem>
                    <MenuItem value="LE">LE</MenuItem>
                    <MenuItem value="VOL">VOL</MenuItem>
                    <MenuItem value="MC">MC</MenuItem>
                    <MenuItem value="MEI">MEI</MenuItem>
                    <MenuItem value="CAM">CAM</MenuItem>
                    <MenuItem value="ATA">ATA</MenuItem>
                    <MenuItem value="CA">CA</MenuItem>
                    <MenuItem value="PE">PE</MenuItem>
                    <MenuItem value="PD">PD</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 2.6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Carta"
                    value={rosterCardType}
                    onChange={(e) => setRosterCardType(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="bronze">Bronze</MenuItem>
                    <MenuItem value="silver">Prata</MenuItem>
                    <MenuItem value="gold">Ouro</MenuItem>
                    <MenuItem value="totw">TOTW</MenuItem>
                    <MenuItem value="icon">Icon</MenuItem>
                    <MenuItem value="hero">Hero</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 2.8 }}>
                  <TextField
                    select
                    fullWidth
                    label="Ordenar por"
                    value={rosterSort}
                    onChange={(e) => setRosterSort(e.target.value)}
                  >
                    <MenuItem value="overall">Overall</MenuItem>
                    <MenuItem value="goals">Gols</MenuItem>
                    <MenuItem value="assists">Assistências</MenuItem>
                    <MenuItem value="rating">Nota média</MenuItem>
                    <MenuItem value="matches">Mais usados</MenuItem>
                    <MenuItem value="name">Nome</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {displayedPlayers.length === 0 ? (
                <Box sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum jogador encontrado com os filtros atuais.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {displayedPlayers.map(({ player, snapshot }) => (
                    <Grid key={player.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <FutCard
                        player={player}
                        snapshot={snapshot}
                        compact
                        highlight={highlightPlayerId === player.id}
                        onEdit={() => handleEdit(player)}
                        onDelete={() => setDeleteTarget(player)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <CheckCircleRoundedIcon sx={{ color: "#00d084", fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Jogador adicionado
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1, alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.35,
              }}
            >
              Parabéns, você adicionou{" "}
              <Box component="span" sx={{ color: "#f4d35e" }}>
                {savedPlayerPreview?.name || "o jogador"}
              </Box>{" "}
              ao seu elenco.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", maxWidth: 420 }}
            >
              O jogador já está disponível no seu elenco e pronto para aparecer
              nas estatísticas, campanhas e partidas.
            </Typography>

            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              {savedPlayerPreview ? (
                <Box sx={{ width: "100%", maxWidth: 340 }}>
                  <FutCard
                    player={savedPlayerPreview}
                    snapshot={getPlayerSnapshot(savedPlayerPreview, safeMatches)}
                  />
                </Box>
              ) : null}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Fechar
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleViewInRoster}
          >
            Ver no elenco
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
              Excluir jogador
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Deseja realmente excluir <b>{deleteTarget?.name}</b> do elenco?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
              Esta ação remove o jogador do cadastro e ele deixará de aparecer nas
              listagens do elenco.
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
                  <b>Nome:</b> {deleteTarget.name}
                </Typography>
                <Typography variant="body2">
                  <b>Posição:</b> {deleteTarget.position || "-"}
                </Typography>
                <Typography variant="body2">
                  <b>Overall:</b> {deleteTarget.overall || "-"}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={handleDeleteConfirm}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

