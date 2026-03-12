import { Grid, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SectionCard from './SectionCard';

export default function ChartsPanel({ goalsData, ratingData, rollingData }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={4}>
        <SectionCard title="Gols por partida" subtitle="Comparativo entre gols pró e contra">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={goalsData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="partida" stroke="#8b96aa" />
                <YAxis stroke="#8b96aa" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="golsPro" stroke="#f4c95d" strokeWidth={3} />
                <Line type="monotone" dataKey="golsContra" stroke="#ff4d4f" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SectionCard title="Evolução da nota média" subtitle="Média de notas do time por jogo">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={ratingData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="partida" stroke="#8b96aa" />
                <YAxis stroke="#8b96aa" domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="nota" stroke="#f7df8c" fill="#f7df8c55" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SectionCard title="Win rate móvel" subtitle="Últimos 5 jogos">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={rollingData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="partida" stroke="#8b96aa" />
                <YAxis stroke="#8b96aa" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="winRate" stroke="#f4c95d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Typography variant="body2" color="text.secondary">
            Ajuda a ver se você está encaixando ou entrando em tilt ao longo da WL.
          </Typography>
        </SectionCard>
      </Grid>
    </Grid>
  );
}
