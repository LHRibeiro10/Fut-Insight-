import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Button,
  Chip,
  Dialog,
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
import MiniCard from "@/shared/components/cards/MiniCard";
import SectionCard from "@/shared/components/cards/SectionCard";

const formationsMap = {
  "4-4-2": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LB", label: "LE", top: "66%", left: "14%" },
    { id: "CB1", label: "ZAG", top: "69%", left: "36%" },
    { id: "CB2", label: "ZAG", top: "69%", left: "64%" },
    { id: "RB", label: "LD", top: "66%", left: "86%" },
    { id: "LM", label: "ME", top: "46%", left: "13%" },
    { id: "CM1", label: "MC", top: "48%", left: "39%" },
    { id: "CM2", label: "MC", top: "48%", left: "61%" },
    { id: "RM", label: "MD", top: "46%", left: "87%" },
    { id: "ST1", label: "ATA", top: "20%", left: "41%" },
    { id: "ST2", label: "ATA", top: "20%", left: "59%" },
  ],
  "4-3-3": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LB", label: "LE", top: "66%", left: "14%" },
    { id: "CB1", label: "ZAG", top: "69%", left: "36%" },
    { id: "CB2", label: "ZAG", top: "69%", left: "64%" },
    { id: "RB", label: "LD", top: "66%", left: "86%" },
    { id: "CM1", label: "MC", top: "50%", left: "30%" },
    { id: "CM2", label: "MC", top: "54%", left: "50%" },
    { id: "CM3", label: "MC", top: "50%", left: "70%" },
    { id: "LW", label: "PE", top: "21%", left: "20%" },
    { id: "ST", label: "ATA", top: "17%", left: "50%" },
    { id: "RW", label: "PD", top: "21%", left: "80%" },
  ],
  "4-2-3-1": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LB", label: "LE", top: "66%", left: "14%" },
    { id: "CB1", label: "ZAG", top: "69%", left: "36%" },
    { id: "CB2", label: "ZAG", top: "69%", left: "64%" },
    { id: "RB", label: "LD", top: "66%", left: "86%" },
    { id: "CDM1", label: "VOL", top: "56%", left: "40%" },
    { id: "CDM2", label: "VOL", top: "56%", left: "60%" },
    { id: "LAM", label: "MEI", top: "35%", left: "22%" },
    { id: "CAM", label: "MEI", top: "31%", left: "50%" },
    { id: "RAM", label: "MEI", top: "35%", left: "78%" },
    { id: "ST", label: "ATA", top: "17%", left: "50%" },
  ],
  "4-1-2-1-2": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LB", label: "LE", top: "66%", left: "14%" },
    { id: "CB1", label: "ZAG", top: "69%", left: "36%" },
    { id: "CB2", label: "ZAG", top: "69%", left: "64%" },
    { id: "RB", label: "LD", top: "66%", left: "86%" },
    { id: "CDM", label: "VOL", top: "58%", left: "50%" },
    { id: "LCM", label: "MC", top: "46%", left: "30%" },
    { id: "RCM", label: "MC", top: "46%", left: "70%" },
    { id: "CAM", label: "MEI", top: "34%", left: "50%" },
    { id: "ST1", label: "ATA", top: "18%", left: "40%" },
    { id: "ST2", label: "ATA", top: "18%", left: "60%" },
  ],
  "4-5-1": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LB", label: "LE", top: "66%", left: "14%" },
    { id: "CB1", label: "ZAG", top: "69%", left: "36%" },
    { id: "CB2", label: "ZAG", top: "69%", left: "64%" },
    { id: "RB", label: "LD", top: "66%", left: "86%" },
    { id: "LM", label: "ME", top: "45%", left: "12%" },
    { id: "LCM", label: "MC", top: "49%", left: "31%" },
    { id: "CAM", label: "MEI", top: "46%", left: "50%" },
    { id: "RCM", label: "MC", top: "49%", left: "69%" },
    { id: "RM", label: "MD", top: "45%", left: "88%" },
    { id: "ST", label: "ATA", top: "17%", left: "50%" },
  ],
  "3-5-2": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "CB1", label: "ZAG", top: "68%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "71%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "68%", left: "72%" },
    { id: "LM", label: "ALA", top: "48%", left: "12%" },
    { id: "CM1", label: "MC", top: "50%", left: "34%" },
    { id: "CDM", label: "VOL", top: "55%", left: "50%" },
    { id: "CM2", label: "MC", top: "50%", left: "66%" },
    { id: "RM", label: "ALA", top: "48%", left: "88%" },
    { id: "ST1", label: "ATA", top: "19%", left: "40%" },
    { id: "ST2", label: "ATA", top: "19%", left: "60%" },
  ],
  "3-4-2-1": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "CB1", label: "ZAG", top: "68%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "71%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "68%", left: "72%" },
    { id: "LM", label: "ALA", top: "48%", left: "12%" },
    { id: "CM1", label: "MC", top: "52%", left: "38%" },
    { id: "CM2", label: "MC", top: "52%", left: "62%" },
    { id: "RM", label: "ALA", top: "48%", left: "88%" },
    { id: "LF", label: "SA", top: "30%", left: "38%" },
    { id: "RF", label: "SA", top: "30%", left: "62%" },
    { id: "ST", label: "ATA", top: "15%", left: "50%" },
  ],
  "3-4-3": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "CB1", label: "ZAG", top: "68%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "71%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "68%", left: "72%" },
    { id: "LM", label: "ALA", top: "48%", left: "12%" },
    { id: "CM1", label: "MC", top: "52%", left: "38%" },
    { id: "CM2", label: "MC", top: "52%", left: "62%" },
    { id: "RM", label: "ALA", top: "48%", left: "88%" },
    { id: "LW", label: "PE", top: "20%", left: "20%" },
    { id: "ST", label: "ATA", top: "16%", left: "50%" },
    { id: "RW", label: "PD", top: "20%", left: "80%" },
  ],
  "5-3-2": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LWB", label: "ALA", top: "63%", left: "10%" },
    { id: "CB1", label: "ZAG", top: "67%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "70%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "67%", left: "72%" },
    { id: "RWB", label: "ALA", top: "63%", left: "90%" },
    { id: "CM1", label: "MC", top: "48%", left: "32%" },
    { id: "CM2", label: "MC", top: "52%", left: "50%" },
    { id: "CM3", label: "MC", top: "48%", left: "68%" },
    { id: "ST1", label: "ATA", top: "19%", left: "40%" },
    { id: "ST2", label: "ATA", top: "19%", left: "60%" },
  ],
  "5-2-1-2": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LWB", label: "ALA", top: "63%", left: "10%" },
    { id: "CB1", label: "ZAG", top: "67%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "70%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "67%", left: "72%" },
    { id: "RWB", label: "ALA", top: "63%", left: "90%" },
    { id: "CM1", label: "MC", top: "50%", left: "38%" },
    { id: "CM2", label: "MC", top: "50%", left: "62%" },
    { id: "CAM", label: "MEI", top: "34%", left: "50%" },
    { id: "ST1", label: "ATA", top: "18%", left: "40%" },
    { id: "ST2", label: "ATA", top: "18%", left: "60%" },
  ],
  "5-4-1": [
    { id: "GK", label: "GOL", top: "82%", left: "50%" },
    { id: "LWB", label: "ALA", top: "63%", left: "10%" },
    { id: "CB1", label: "ZAG", top: "67%", left: "28%" },
    { id: "CB2", label: "ZAG", top: "70%", left: "50%" },
    { id: "CB3", label: "ZAG", top: "67%", left: "72%" },
    { id: "RWB", label: "ALA", top: "63%", left: "90%" },
    { id: "LM", label: "ME", top: "46%", left: "18%" },
    { id: "CM1", label: "MC", top: "50%", left: "39%" },
    { id: "CM2", label: "MC", top: "50%", left: "61%" },
    { id: "RM", label: "MD", top: "46%", left: "82%" },
    { id: "ST", label: "ATA", top: "17%", left: "50%" },
  ],
};

const benchSlots = ["SUB1", "SUB2", "SUB3", "SUB4", "SUB5", "SUB6", "SUB7"];

const STORAGE_FORMATION_KEY = "wl_tracker_squad_formation";
const STORAGE_SQUAD_KEY = "wl_tracker_squad_data";

function createEmptySquad(formationSlots) {
  const squad = formationSlots.reduce((acc, slot) => {
    acc[slot.id] = null;
    return acc;
  }, {});

  benchSlots.forEach((slot) => {
    squad[slot] = null;
  });

  return squad;
}

function mergeSquadWithFormation(existingSquad, formationSlots) {
  const empty = createEmptySquad(formationSlots);

  return Object.keys(empty).reduce((acc, key) => {
    acc[key] = existingSquad?.[key] || null;
    return acc;
  }, {});
}

function getSlotMeta(slotId, formationSlots) {
  return formationSlots.find((item) => item.id === slotId) || null;
}

function calcSquadOverall(squad, formationSlots) {
  const starterIds = formationSlots.map((slot) => slot.id);
  const players = starterIds.map((id) => squad[id]).filter(Boolean);

  if (!players.length) return 0;

  const total = players.reduce(
    (acc, player) => acc + (Number(player?.overall) || 0),
    0
  );

  return Math.round(total / players.length);
}

function getPositionColor(positionId) {
  const id = String(positionId).toUpperCase();

  if (id === "GK" || id.startsWith("SUB")) return "rgba(255, 193, 7, 0.14)";
  if (id.includes("CB") || id === "LB" || id === "RB" || id.includes("WB")) {
    return "rgba(33, 150, 243, 0.14)";
  }
  if (
    id.includes("CM") ||
    id.includes("CDM") ||
    id.includes("CAM") ||
    id === "LM" ||
    id === "RM" ||
    id === "LAM" ||
    id === "RAM"
  ) {
    return "rgba(156, 39, 176, 0.14)";
  }
  return "rgba(0, 208, 132, 0.14)";
}

function FieldLine({ sx }) {
  return (
    <Box
      sx={{
        position: "absolute",
        borderColor: "rgba(255,255,255,0.22)",
        borderStyle: "solid",
        pointerEvents: "none",
        ...sx,
      }}
    />
  );
}

function SlotPlaceholder({ slot, onClick, compact = false }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: compact ? 84 : 96,
        height: compact ? 118 : 134,
        borderRadius: "28px 28px 18px 18px",
        border: "1px dashed rgba(255,255,255,0.36)",
        background: getPositionColor(slot.id),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
        backdropFilter: "blur(5px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
        transition: "all .18s ease",
        "&:hover": {
          transform: "translateY(-3px) scale(1.02)",
          background: "rgba(255,255,255,0.12)",
          borderColor: "rgba(255,255,255,0.55)",
          boxShadow: "0 16px 26px rgba(0,0,0,0.16)",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: compact ? 24 : 28,
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1,
        }}
      >
        +
      </Typography>
      <Typography
        sx={{
          mt: 0.7,
          fontWeight: 900,
          color: "#fff",
          fontSize: compact ? 14 : 18,
        }}
      >
        {slot.label}
      </Typography>
      <Typography
        sx={{
          mt: 0.35,
          fontSize: compact ? 11 : 13,
          color: "rgba(255,255,255,0.78)",
        }}
      >
        Selecionar
      </Typography>
    </Box>
  );
}

export default function SquadPage({ players = [] }) {
  const safePlayers = Array.isArray(players) ? players : [];

  const [formation, setFormation] = useState(() => {
    return localStorage.getItem(STORAGE_FORMATION_KEY) || "4-4-2";
  });

  const activeFormation = useMemo(
    () => formationsMap[formation] || formationsMap["4-4-2"],
    [formation]
  );

  const [squad, setSquad] = useState(() => {
    try {
      const savedFormation =
        localStorage.getItem(STORAGE_FORMATION_KEY) || "4-4-2";
      const savedSquad = JSON.parse(
        localStorage.getItem(STORAGE_SQUAD_KEY) || "{}"
      );
      const slots = formationsMap[savedFormation] || formationsMap["4-4-2"];
      return mergeSquadWithFormation(savedSquad, slots);
    } catch {
      return createEmptySquad(formationsMap["4-4-2"]);
    }
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [draggedSlot, setDraggedSlot] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const selectedSlotMeta = useMemo(
    () => getSlotMeta(selectedSlot, activeFormation),
    [selectedSlot, activeFormation]
  );

  const usedPlayersCount = useMemo(
    () => Object.values(squad).filter(Boolean).length,
    [squad]
  );

  const squadOverall = useMemo(
    () => calcSquadOverall(squad, activeFormation),
    [squad, activeFormation]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_FORMATION_KEY, formation);
  }, [formation]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SQUAD_KEY, JSON.stringify(squad));
  }, [squad]);

  function openSlot(slotId) {
    setSelectedSlot(slotId);
  }

  function closeDialog() {
    setSelectedSlot(null);
  }

  function assignPlayerToSlot(player) {
    if (!selectedSlot) return;

    setSquad((current) => ({
      ...current,
      [selectedSlot]: player,
    }));

    closeDialog();
  }

  function swapPlayers(fromSlot, toSlot) {
    if (!fromSlot || !toSlot || fromSlot === toSlot) return;

    setSquad((current) => {
      const updated = { ...current };
      const temp = updated[fromSlot];
      updated[fromSlot] = updated[toSlot];
      updated[toSlot] = temp;
      return updated;
    });
  }

  function handleDrop(targetSlot) {
    if (!draggedSlot || draggedSlot === targetSlot) {
      setDraggedSlot(null);
      setDragOverSlot(null);
      return;
    }

    swapPlayers(draggedSlot, targetSlot);
    setDraggedSlot(null);
    setDragOverSlot(null);
  }

  function removePlayerFromSlot(slotId) {
    setSquad((current) => ({
      ...current,
      [slotId]: null,
    }));
  }

  function clearSquad() {
    setSquad(createEmptySquad(activeFormation));
    setFeedback("Escalação limpa.");
  }

  function handleChangeFormation(newFormation) {
    const nextFormation = formationsMap[newFormation];
    if (!nextFormation) return;

    setFormation(newFormation);
    setSquad((current) => mergeSquadWithFormation(current, nextFormation));
    setSelectedSlot(null);
    setFeedback(`Formação alterada para ${newFormation}.`);
  }

  function handleSaveSquad() {
    localStorage.setItem(STORAGE_FORMATION_KEY, formation);
    localStorage.setItem(STORAGE_SQUAD_KEY, JSON.stringify(squad));
    setFeedback("Elenco salvo com sucesso.");
  }

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Meu Time"
        subtitle="Monte sua escalação estilo Ultimate Team"
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
              <Chip
                icon={<SportsSoccerRoundedIcon />}
                label={`Formação ${formation}`}
                sx={{ borderRadius: 0, fontWeight: 800 }}
              />
              <Chip
                icon={<GroupsRoundedIcon />}
                label={`Jogadores ${usedPlayersCount}/18`}
                sx={{ borderRadius: 0, fontWeight: 800 }}
              />
              <Chip
                icon={<StarRoundedIcon />}
                label={`Overall ${squadOverall}`}
                sx={{ borderRadius: 0, fontWeight: 800 }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <TextField
                select
                size="small"
                label="Formação"
                value={formation}
                onChange={(e) => handleChangeFormation(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="4-4-2">4-4-2</MenuItem>
                <MenuItem value="4-3-3">4-3-3</MenuItem>
                <MenuItem value="4-2-3-1">4-2-3-1</MenuItem>
                <MenuItem value="4-1-2-1-2">4-1-2-1-2</MenuItem>
                <MenuItem value="4-5-1">4-5-1</MenuItem>
                <MenuItem value="3-5-2">3-5-2</MenuItem>
                <MenuItem value="3-4-2-1">3-4-2-1</MenuItem>
                <MenuItem value="3-4-3">3-4-3</MenuItem>
                <MenuItem value="5-3-2">5-3-2</MenuItem>
                <MenuItem value="5-2-1-2">5-2-1-2</MenuItem>
                <MenuItem value="5-4-1">5-4-1</MenuItem>
              </TextField>

              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                onClick={handleSaveSquad}
              >
                Salvar elenco
              </Button>

              <Button variant="outlined" color="error" onClick={clearSquad}>
                Limpar escalação
              </Button>
            </Stack>
          </Stack>

          {feedback ? (
            <Typography variant="body2" color="text.secondary">
              {feedback}
            </Typography>
          ) : null}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: 980,
              borderRadius: 0,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.08)",
              background: `
                linear-gradient(90deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.025) 100%),
                repeating-linear-gradient(
                  90deg,
                  #259443 0px,
                  #259443 120px,
                  #21863e 120px,
                  #21863e 240px
                )
              `,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            <FieldLine
              sx={{
                inset: 22,
                borderWidth: 2,
              }}
            />

            <FieldLine
              sx={{
                top: "50%",
                left: 22,
                right: 22,
                borderTopWidth: 2,
                transform: "translateY(-50%)",
              }}
            />

            <FieldLine
              sx={{
                top: "50%",
                left: "50%",
                width: 150,
                height: 150,
                borderWidth: 2,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            <FieldLine
              sx={{
                bottom: 22,
                left: "23%",
                width: "54%",
                height: 165,
                borderWidth: 2,
              }}
            />

            <FieldLine
              sx={{
                bottom: 22,
                left: "35%",
                width: "30%",
                height: 86,
                borderWidth: 2,
              }}
            />

            <FieldLine
              sx={{
                top: 22,
                left: "23%",
                width: "54%",
                height: 165,
                borderWidth: 2,
              }}
            />

            <FieldLine
              sx={{
                top: 22,
                left: "35%",
                width: "30%",
                height: 86,
                borderWidth: 2,
              }}
            />

            {activeFormation.map((slot) => {
              const assignedPlayer = squad[slot.id];

              return (
                <Box
                  key={slot.id}
                  sx={{
                    position: "absolute",
                    top: slot.top,
                    left: slot.left,
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                  }}
                >
                  {assignedPlayer ? (
                    <Box sx={{ position: "relative" }}>
                      <Box
                        draggable
                        onDragStart={() => setDraggedSlot(slot.id)}
                        onDragEnd={() => {
                          setDraggedSlot(null);
                          setDragOverSlot(null);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={() => setDragOverSlot(slot.id)}
                        onDragLeave={() => {
                          if (dragOverSlot === slot.id) {
                            setDragOverSlot(null);
                          }
                        }}
                        onDrop={() => handleDrop(slot.id)}
                        onClick={() => openSlot(slot.id)}
                        sx={{
                          cursor: "grab",
                          transition: "transform .16s ease, filter .16s ease, box-shadow .16s ease",
                          opacity: draggedSlot === slot.id ? 0.65 : 1,
                          filter: draggedSlot === slot.id ? "brightness(1.08)" : "none",
                          transform:
                            dragOverSlot === slot.id
                              ? "translateY(-4px) scale(1.05)"
                              : "translateY(0) scale(1)",
                          boxShadow:
                            dragOverSlot === slot.id
                              ? "0 0 0 3px rgba(255,255,255,0.35)"
                              : "none",
                          "&:hover": {
                            transform: "translateY(-2px) scale(1.02)",
                          },
                        }}
                      >
                        <MiniCard player={assignedPlayer} />
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => removePlayerFromSlot(slot.id)}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          width: 28,
                          height: 28,
                          bgcolor: "rgba(0,0,0,0.72)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.16)",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.9)",
                          },
                        }}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={() => setDragOverSlot(slot.id)}
                      onDragLeave={() => {
                        if (dragOverSlot === slot.id) {
                          setDragOverSlot(null);
                        }
                      }}
                      onDrop={() => handleDrop(slot.id)}
                      sx={{
                        transform:
                          dragOverSlot === slot.id
                            ? "translateY(-4px) scale(1.05)"
                            : "translateY(0) scale(1)",
                        transition: "transform .16s ease, filter .16s ease",
                        filter:
                          dragOverSlot === slot.id
                            ? "brightness(1.12)"
                            : "none",
                      }}
                    >
                      <SlotPlaceholder
                        slot={slot}
                        onClick={() => openSlot(slot.id)}
                      />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <SectionCard
            title="Banco de reservas"
            subtitle="Arraste jogadores entre o campo e o banco"
          >
            <Grid container spacing={2}>
              {benchSlots.map((slotId) => {
                const benchPlayer = squad[slotId];

                return (
                  <Grid key={slotId} size={{ xs: 6, sm: 4, md: 3, lg: 12 / 7 }}>
                    <Stack spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {slotId}
                      </Typography>

                      {benchPlayer ? (
                        <Box sx={{ position: "relative" }}>
                          <Box
                            draggable
                            onDragStart={() => setDraggedSlot(slotId)}
                            onDragEnd={() => {
                              setDraggedSlot(null);
                              setDragOverSlot(null);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(slotId)}
                            onClick={() => openSlot(slotId)}
                            sx={{
                              cursor: "grab",
                              transition: "transform .16s ease",
                              "&:hover": {
                                transform: "translateY(-2px) scale(1.02)",
                              },
                            }}
                          >
                            <MiniCard player={benchPlayer} />
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => removePlayerFromSlot(slotId)}
                            sx={{
                              position: "absolute",
                              top: -10,
                              right: -10,
                              width: 24,
                              height: 24,
                              bgcolor: "rgba(0,0,0,0.72)",
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.16)",
                              "&:hover": {
                                bgcolor: "rgba(0,0,0,0.9)",
                              },
                            }}
                          >
                            <CloseRoundedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box
                          draggable
                          onDragStart={() => setDraggedSlot(slotId)}
                          onDragEnd={() => {
                            setDraggedSlot(null);
                            setDragOverSlot(null);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnter={() => setDragOverSlot(slotId)}
                          onDragLeave={() => {
                            if (dragOverSlot === slotId) {
                              setDragOverSlot(null);
                            }
                          }}
                          onDrop={() => handleDrop(slotId)}
                          onClick={() => openSlot(slotId)}
                          sx={{
                            cursor: "grab",
                            transition: "transform .16s ease, filter .16s ease, box-shadow .16s ease",
                            opacity: draggedSlot === slotId ? 0.65 : 1,
                            filter: draggedSlot === slotId ? "brightness(1.08)" : "none",
                            transform:
                              dragOverSlot === slotId
                                ? "translateY(-4px) scale(1.05)"
                                : "translateY(0) scale(1)",
                            boxShadow:
                              dragOverSlot === slotId
                                ? "0 0 0 3px rgba(255,255,255,0.35)"
                                : "none",
                          }}
                        >
                          <MiniCard player={benchPlayer} />
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </SectionCard>
        </Stack>
      </SectionCard>

      <Dialog
        open={Boolean(selectedSlot)}
        onClose={closeDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedSlotMeta
            ? `Selecionar jogador para ${selectedSlotMeta.label}`
            : selectedSlot?.startsWith("SUB")
              ? `Selecionar jogador para ${selectedSlot}`
              : "Selecionar jogador"}
        </DialogTitle>

        <DialogContent>
          {safePlayers.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum jogador cadastrado ainda.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {safePlayers.map((player) => (
                <Grid key={player.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Box
                    onClick={() => assignPlayerToSlot(player)}
                    sx={{ cursor: "pointer" }}
                  >
                    <FutCard player={player} compact />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

