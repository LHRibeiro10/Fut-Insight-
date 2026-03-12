import { Chip, Grid, Stack, Typography } from '@mui/material';
import SectionCard from './SectionCard';

function RenderChips({ items, getLabel, color }) {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {items.map((item) => (
        <Chip key={item.player.id} label={getLabel(item)} color={color} />
      ))}
    </Stack>
  );
}

export default function TopLists({ top }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <SectionCard title="Destaques — Artilharia & Assistências">
          <Typography sx={{ mb: 1, fontWeight: 700 }}>Artilharia</Typography>
          <RenderChips items={top.scorers} color="error" getLabel={(item) => `${item.player.name}: ${item.goals}`} />
          <Typography sx={{ mt: 2, mb: 1, fontWeight: 700 }}>Assistências</Typography>
          <RenderChips items={top.assistants} color="secondary" getLabel={(item) => `${item.player.name}: ${item.assists}`} />
        </SectionCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <SectionCard title="Destaques — MVPs & Notas">
          <Typography sx={{ mb: 1, fontWeight: 700 }}>MVPs acumulados</Typography>
          <RenderChips items={top.mvps} color="success" getLabel={(item) => `${item.player.name}: ${item.mvps}`} />
          <Typography sx={{ mt: 2, mb: 1, fontWeight: 700 }}>Melhores médias</Typography>
          <RenderChips items={top.ratings} color="default" getLabel={(item) => `${item.player.name}: ${item.averageRating}`} />
        </SectionCard>
      </Grid>
    </Grid>
  );
}
