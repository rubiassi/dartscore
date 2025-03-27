import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Fade,
  Badge
} from '@mui/material';
import { Info as InfoIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import {
  getPlayerStats,
  getTimeStats,
  getRecentGames,
  getPersonalBests,
  PlayerStats,
  GameStats
} from '../services/statisticsService';

// Styled components
const StyledCard = ({ children, title, tooltip }: { children: React.ReactNode; title: string; tooltip?: string }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        boxShadow: theme.shadows[4],
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

const CircularStatistic = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={4}
          sx={{ color: theme.palette.divider }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={80}
          thickness={4}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};

const StatBar = ({ value, max, label, color }: { value: number; max: number; label: string; color?: string }) => {
  const theme = useTheme();
  const percentage = (value / max) * 100;
  const calculatedColor = color || theme.palette.primary.main;
  
  return (
    <Tooltip
      title={`${value} af ${max} (${percentage.toFixed(1)}%)`}
      arrow
      placement="top"
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {value}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.action.hover,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundImage: `linear-gradient(90deg, ${calculatedColor}, ${theme.palette.primary.light})`,
              transition: 'transform 0.4s ease',
            }
          }}
        />
      </Box>
    </Tooltip>
  );
};

const SparklineChart = ({ data, color }: { data: number[]; color: string }) => {
  const theme = useTheme();
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const height = 40;
  const width = 120;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Box sx={{ display: 'inline-block', ml: 2 }}>
      <svg width={width} height={height}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

const RadarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const theme = useTheme();
  const size = 200;
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((_, i) => {
    const value = data[i].value / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle) * value;
    const y = center + radius * Math.sin(angle) * value;
    return `${x},${y}`;
  }).join(' ');

  const gridPoints = Array.from({ length: 4 }, (_, i) => {
    const level = (i + 1) / 4;
    return data.map((_, j) => {
      const angle = j * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle) * level;
      const y = center + radius * Math.sin(angle) * level;
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <svg width={size} height={size}>
        {/* Grid */}
        {gridPoints.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke={theme.palette.divider}
            strokeWidth="0.5"
          />
        ))}
        
        {/* Labels */}
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.palette.text.secondary}
              fontSize="12"
            >
              {item.label}
            </text>
          );
        })}

        {/* Data */}
        <polygon
          points={points}
          fill={theme.palette.primary.main}
          fillOpacity="0.2"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
        />
      </svg>
    </Box>
  );
};

const HeatmapCell = ({ value, max }: { value: number; max: number }) => {
  const theme = useTheme();
  const intensity = value / max;
  
  return (
    <Tooltip title={`${value} spil`} arrow>
      <Box
        sx={{
          width: 30,
          height: 30,
          backgroundColor: theme.palette.primary.main,
          opacity: 0.1 + intensity * 0.9,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            opacity: 0.2 + intensity * 0.8,
          }
        }}
      />
    </Tooltip>
  );
};

const Achievement = ({ 
  title, 
  description, 
  progress, 
  target 
}: { 
  title: string; 
  description: string; 
  progress: number; 
  target: number 
}) => {
  const theme = useTheme();
  const percentage = (progress / target) * 100;
  const isCompleted = percentage >= 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Badge
          badgeContent={isCompleted ? '✓' : null}
          color="success"
          sx={{ mr: 1 }}
        >
          <TrophyIcon 
            color={isCompleted ? 'primary' : 'disabled'} 
            sx={{ opacity: isCompleted ? 1 : 0.5 }}
          />
        </Badge>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {progress}/{target}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.palette.action.hover,
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundImage: isCompleted
              ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
              : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
          }
        }}
      />
    </Box>
  );
};

const StatisticsPage = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameStats[]>([]);
  const [personalBests, setPersonalBests] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      loadStats();
    }
  }, [currentUser, timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [playerStats, games, bests] = await Promise.all([
        getPlayerStats(currentUser!.uid),
        getRecentGames(currentUser!.uid, 10),
        getPersonalBests(currentUser!.uid)
      ]);

      setStats(playerStats);
      setRecentGames(games);
      setPersonalBests(bests);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'day' | 'week' | 'month' | 'year'
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const renderOverview = () => {
    // Helper functions for calculations
    const calculateScoringStrength = () => {
      if (!stats?.scoring) return 0;
      return ((stats.scoring.oneEighty * 3 + stats.scoring.oneFortyPlus * 2 + stats.scoring.oneHundredPlus) / 
             (stats.totalGames || 1)) * 10;
    };

    const calculateConsistency = () => {
      if (!stats?.averages) return 0;
      const variance = Math.abs(stats.averages.overall - stats.averages.firstNine);
      return Math.max(0, 100 - variance * 2);
    };

    const calculateSpeedScore = () => {
      if (!stats?.legsWon) return 0;
      const quickLegs = stats.legsWon.nine + stats.legsWon.tenToTwelve + stats.legsWon.thirteenToFifteen;
      return (quickLegs / (stats.totalGames || 1)) * 100;
    };

    const calculateAccuracy = () => {
      if (!stats?.checkouts) return 0;
      return stats.checkouts.percentage;
    };

    const calculateCurrentStreak = () => {
      if (!recentGames || recentGames.length === 0) return 0;
      let streak = 0;
      for (const game of recentGames) {
        if (game.winner) streak++;
        else break;
      }
      return streak;
    };

    const calculateDayPerformance = (dayIndex: number) => {
      // Implementation for day performance calculation
      return Math.floor(Math.random() * 10); // Placeholder
    };

    const getMaxDayPerformance = () => {
      // Implementation for max day performance
      return 10; // Placeholder
    };

    const calculateTimePerformance = (timeIndex: number) => {
      // Implementation for time performance calculation
      return Math.floor(Math.random() * 10); // Placeholder
    };

    const getMaxTimePerformance = () => {
      // Implementation for max time performance
      return 10; // Placeholder
    };

    return (
      <Grid container spacing={3}>
        {/* Generel statistik */}
        <Grid item xs={12} md={6}>
          <StyledCard 
            title="Generel Statistik"
            tooltip="Overordnede statistikker for alle dine spil"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
              <CircularStatistic
                value={stats?.winRate || 0}
                label="Win Rate"
                color={theme.palette.success.main}
              />
              <CircularStatistic
                value={stats?.checkouts?.percentage || 0}
                label="Checkout %"
                color={theme.palette.primary.main}
              />
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span>Gennemsnit</span>
                      <SparklineChart
                        data={recentGames.map(g => g.averagePerDart)}
                        color={theme.palette.primary.main}
                      />
                    </Box>
                  }
                  secondary={stats?.averages?.overall.toFixed(2) || '0'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Set Gennemsnit"
                  secondary={stats?.averages?.set.toFixed(2) || '0'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Leg Gennemsnit"
                  secondary={stats?.averages?.leg.toFixed(2) || '0'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="First 9 Gennemsnit"
                  secondary={stats?.averages?.firstNine.toFixed(2) || '0'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Antal spil"
                  secondary={`${stats?.totalGames || 0} spil`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Vundne spil"
                  secondary={`${stats?.gamesWon || 0} af ${stats?.totalGames || 0}`}
                />
              </ListItem>
            </List>
          </StyledCard>
        </Grid>

        {/* Checkout statistik */}
        <Grid item xs={12} md={6}>
          <StyledCard title="Checkout Statistik">
            <List>
              <ListItem>
                <ListItemText
                  primary="Checkout Procent"
                  secondary={`${stats?.checkouts?.percentage.toFixed(1) || 0}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Succesfulde Checkouts"
                  secondary={`${stats?.checkouts?.successful || 0} af ${stats?.checkouts?.attempts || 0}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Højeste Checkout"
                  secondary={personalBests?.bestCheckout || '0'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Bedste Gennemsnit"
                  secondary={`${personalBests?.bestAverage.toFixed(2) || '0'}`}
                />
              </ListItem>
            </List>
          </StyledCard>
        </Grid>

        {/* Legs vundet statistik */}
        <Grid item xs={12}>
          <StyledCard title="Legs Vundet (antal darts)">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.nine || 0}
                  max={Math.max(stats?.legsWon?.nine || 0, 5)}
                  label="9 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.tenToTwelve || 0}
                  max={Math.max(stats?.legsWon?.tenToTwelve || 0, 10)}
                  label="10-12 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.thirteenToFifteen || 0}
                  max={Math.max(stats?.legsWon?.thirteenToFifteen || 0, 15)}
                  label="13-15 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.sixteenToTwenty || 0}
                  max={Math.max(stats?.legsWon?.sixteenToTwenty || 0, 20)}
                  label="16-20 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.twentyOneToTwentyFive || 0}
                  max={Math.max(stats?.legsWon?.twentyOneToTwentyFive || 0, 25)}
                  label="21-25 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.twentySixToThirty || 0}
                  max={Math.max(stats?.legsWon?.twentySixToThirty || 0, 30)}
                  label="26-30 darts"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.legsWon?.thirtyPlus || 0}
                  max={Math.max(stats?.legsWon?.thirtyPlus || 0, 35)}
                  label="30+ darts"
                  color={theme.palette.success.main}
                />
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Score fordeling */}
        <Grid item xs={12}>
          <StyledCard title="Score Fordeling">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.oneEighty || 0}
                  max={Math.max(stats?.scoring?.oneEighty || 0, 10)}
                  label="180's"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.oneFortyPlus || 0}
                  max={Math.max(stats?.scoring?.oneFortyPlus || 0, 20)}
                  label="140+"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.oneHundredPlus || 0}
                  max={Math.max(stats?.scoring?.oneHundredPlus || 0, 30)}
                  label="100+"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.sixtyPlus || 0}
                  max={Math.max(stats?.scoring?.sixtyPlus || 0, 40)}
                  label="60+"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.fortyPlus || 0}
                  max={Math.max(stats?.scoring?.fortyPlus || 0, 50)}
                  label="40+"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.twentyPlus || 0}
                  max={Math.max(stats?.scoring?.twentyPlus || 0, 60)}
                  label="20+"
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatBar
                  value={stats?.scoring?.oneToTwenty || 0}
                  max={Math.max(stats?.scoring?.oneToTwenty || 0, 70)}
                  label="1-20"
                  color={theme.palette.primary.main}
                />
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Player Strengths Radar */}
        <Grid item xs={12} md={6}>
          <StyledCard 
            title="Spillerstyrker" 
            tooltip="Din præstation inden for forskellige områder"
          >
            <RadarChart
              data={[
                { label: 'Scoring', value: calculateScoringStrength() },
                { label: 'Checkout', value: stats?.checkouts?.percentage || 0 },
                { label: 'Consistency', value: calculateConsistency() },
                { label: 'Speed', value: calculateSpeedScore() },
                { label: 'Accuracy', value: calculateAccuracy() }
              ]}
            />
          </StyledCard>
        </Grid>

        {/* Best Playing Times */}
        <Grid item xs={12} md={6}>
          <StyledCard 
            title="Bedste Spilletider" 
            tooltip="Hvornår du præsterer bedst"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Weekdays */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map((day, i) => (
                  <HeatmapCell
                    key={day}
                    value={calculateDayPerformance(i)}
                    max={getMaxDayPerformance()}
                  />
                ))}
              </Box>
              {/* Time slots */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {['Morgen', 'Formiddag', 'Eftermiddag', 'Aften'].map((time, i) => (
                  <HeatmapCell
                    key={time}
                    value={calculateTimePerformance(i)}
                    max={getMaxTimePerformance()}
                  />
                ))}
              </Box>
            </Box>
          </StyledCard>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <StyledCard 
            title="Præstationer" 
            tooltip="Dine opnåede og igangværende achievements"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Achievement
                  title="180's Mester"
                  description="Opnå 50 180'ere"
                  progress={stats?.scoring?.oneEighty || 0}
                  target={50}
                />
                <Achievement
                  title="Checkout King"
                  description="Opnå 100 checkouts"
                  progress={stats?.checkouts?.successful || 0}
                  target={100}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Achievement
                  title="Winning Streak"
                  description="Vind 10 spil i træk"
                  progress={calculateCurrentStreak()}
                  target={10}
                />
                <Achievement
                  title="High Scorer"
                  description="Opnå et gennemsnit på 60+"
                  progress={stats?.averages?.overall || 0}
                  target={60}
                />
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>
    );
  };

  const renderHistory = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledCard title="Seneste Spil">
          <List>
            {recentGames.map((game, index) => (
              <React.Fragment key={game.gameId}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {game.gameType}
                        </Typography>
                        <Chip
                          label={game.winner ? 'Vundet' : 'Tabt'}
                          color={game.winner ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Score: {game.score} | Checkout: {game.checkout || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Gennemsnit: {game.averagePerDart.toFixed(2)} | 
                          Checkout %: {game.checkoutPercentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentGames.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </StyledCard>
      </Grid>
    </Grid>
  );

  const renderTrends = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="Tidsperiode"
          >
            <ToggleButton value="day">24 Timer</ToggleButton>
            <ToggleButton value="week">Uge</ToggleButton>
            <ToggleButton value="month">Måned</ToggleButton>
            <ToggleButton value="year">År</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <StyledCard title="Score Udvikling">
          <Box sx={{ p: 2 }}>
            {recentGames.map((game, index) => (
              <Box key={game.gameId} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {new Date(game.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.averagePerDart.toFixed(2)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(game.averagePerDart / (personalBests?.bestAverage || 100)) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.action.hover,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        </StyledCard>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Statistik
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overblik" />
          <Tab label="Historik" />
          <Tab label="Udvikling" />
        </Tabs>
      </Box>

      {tabValue === 0 && renderOverview()}
      {tabValue === 1 && renderHistory()}
      {tabValue === 2 && renderTrends()}
    </Container>
  );
};

export default StatisticsPage; 