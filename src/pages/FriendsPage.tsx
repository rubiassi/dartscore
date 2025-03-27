import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../contexts/AuthContext';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  Friend,
  FriendRequest,
  AppUser
} from '../services/friendsService';

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StyledSearchBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadFriendsData();
    }
  }, [currentUser]);

  const loadFriendsData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [friendsData, requestsData] = await Promise.all([
        getFriends(currentUser.uid),
        getFriendRequests(currentUser.uid)
      ]);
      
      setFriends(friendsData);
      setFriendRequests(requestsData);
    } catch (err) {
      console.error('Error loading friends data:', err);
      setError('Der opstod en fejl ved indlæsning af venner');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearchLoading(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results.filter(user => user.uid !== currentUser?.uid));
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Der opstod en fejl ved søgning efter brugere');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId: string, displayName?: string, photoURL?: string) => {
    if (!currentUser) return;
    
    try {
      await sendFriendRequest(currentUser.uid, userId, currentUser.displayName || undefined, currentUser.photoURL || undefined);
      setSearchDialogOpen(false);
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Der opstod en fejl ved afsendelse af venneanmodning');
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!currentUser) return;
    
    try {
      await acceptFriendRequest(request.id, currentUser.uid, request.senderId);
      await loadFriendsData();
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Der opstod en fejl ved accept af venneanmodning');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      await loadFriendsData();
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      setError('Der opstod en fejl ved afvisning af venneanmodning');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await removeFriend(friendshipId);
      await loadFriendsData();
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Der opstod en fejl ved fjernelse af ven');
    }
  };

  const renderFriendsList = () => (
    <List>
      {friends.map((friend) => (
        <ListItem
          key={friend.id}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemAvatar>
            {friend.status === 'online' ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar src={friend.friendPhotoURL}>{friend.friendName?.[0]}</Avatar>
              </StyledBadge>
            ) : (
              <Avatar src={friend.friendPhotoURL}>{friend.friendName?.[0]}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1" component="span">
                {friend.friendName}
              </Typography>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={friend.rank || 'Rookie'}
                  color="primary"
                  sx={{ height: 20 }}
                />
                <Typography variant="body2" color="text.secondary">
                  • Win Rate: {friend.winRate || '0%'}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Udfordr til kamp">
              <IconButton size="small" color="primary">
                <SportsEsportsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send besked">
              <IconButton size="small">
                <MessageIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  const renderFriendRequests = () => (
    <List>
      {friendRequests.map((request) => (
        <ListItem
          key={request.id}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <ListItemAvatar>
            <Avatar src={request.senderPhotoURL}>{request.senderName?.[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={request.senderName}
            secondary="Vil gerne være venner"
          />
          <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Acceptér">
              <IconButton 
                color="success" 
                size="small"
                onClick={() => handleAcceptRequest(request)}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Afvis">
              <IconButton 
                color="error" 
                size="small"
                onClick={() => handleRejectRequest(request.id)}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  const renderSearchDialog = () => (
    <Dialog 
      open={searchDialogOpen} 
      onClose={() => setSearchDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Søg efter venner</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Søg efter brugernavn"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </Box>
        {searchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ mt: 2 }}>
            {searchResults.map((user) => (
              <ListItem key={user.uid}>
                <ListItemAvatar>
                  <Avatar src={user.photoURL}>{user.displayName?.[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.displayName} secondary={user.email} />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSendFriendRequest(user.uid, user.displayName, user.photoURL)}
                  >
                    Tilføj ven
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSearchDialogOpen(false)}>Luk</Button>
        <Button variant="contained" onClick={handleSearch} disabled={!searchQuery.trim()}>
          Søg
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Venner
      </Typography>

      <StyledSearchBox>
        <SearchIcon color="action" />
        <TextField
          fullWidth
          variant="standard"
          placeholder="Søg blandt dine venner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setSearchDialogOpen(true)}
        >
          Tilføj ven
        </Button>
      </StyledSearchBox>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<GroupIcon />} label="Alle venner" />
          <Tab 
            icon={<PersonAddIcon />} 
            label={`Anmodninger ${friendRequests.length ? `(${friendRequests.length})` : ''}`} 
          />
          <Tab icon={<SportsEsportsIcon />} label="Online" />
          <Tab icon={<EmojiEventsIcon />} label="Statistik" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderFriendsList()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderFriendRequests()}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderFriendsList()}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fælles præstationer
                </Typography>
                {/* Implementer statistik indhold her */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kamphistorik
                </Typography>
                {/* Implementer kamphistorik her */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {renderSearchDialog()}
    </Container>
  );
};

export default FriendsPage; 