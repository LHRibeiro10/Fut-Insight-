import { Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import SectionCard from './SectionCard';
import { formatDate, getResultColor, getResultLabel } from '../utils/format';

export default function RecentMatches({ matches }) {
  return (
    <SectionCard title="Últimas partidas" subtitle="Resumo rápido dos jogos mais recentes">
      <List sx={{ p: 0 }}>
        {matches.map((match) => (
          <ListItem
            key={match.id}
            sx={{
              px: 0,
              py: 1.2,
              borderBottom: '1px solid rgba(255,255,255,.05)',
            }}
            secondaryAction={<Chip label={match.formationUsed} size="small" />}
          >
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                  <Chip label={getResultLabel(match.result)} color={getResultColor(match.result)} size="small" />
                  <Typography sx={{ fontWeight: 700 }}>{formatDate(match.date)}</Typography>
                  <Typography>
                    {match.goalsFor}–{match.goalsAgainst}
                  </Typography>
                </Stack>
              }
              secondary={match.notes || match.rival}
            />
          </ListItem>
        ))}
      </List>
    </SectionCard>
  );
}
