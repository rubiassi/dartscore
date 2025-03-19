import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

interface FriendDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectFriend?: (friend: Friend) => void;
}

const FriendDialog = ({ open, onClose, onSelectFriend }: FriendDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  // Simulerer at hente venner
  useEffect(() => {
    // Her ville vi normalt hente venner fra en API
    const mockFriends: Friend[] = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Mike Johnson' }
    ];
    setFriends(mockFriends);
  }, []);

  // Simulerer søgning efter venner
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setSearching(true);
      try {
        // Simulerer API kald med timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filtrer eksisterende venner og tilføj mock søgeresultater
        const results = [
          ...friends.filter(friend => 
            friend.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          // Tilføj mock søgeresultater hvis der søges
          { id: 'new1', name: `${searchQuery} Player 1` },
          { id: 'new2', name: `${searchQuery} Player 2` }
        ];
        
        setSearchResults(results);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, friends]);

  const handleSelectFriend = (friend: Friend) => {
    if (onSelectFriend) {
      onSelectFriend(friend);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#1a1f2e',
          color: 'white',
          minWidth: 400
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Search player
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search player"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
            endAdornment: searching && (
              <InputAdornment position="end">
                <CircularProgress size={20} sx={{ color: 'white' }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
          }}
        />

        <Box sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.2)', 
          borderRadius: 1,
          mb: 3,
          maxHeight: 300,
          overflow: 'auto'
        }}>
          {searchQuery && searchResults.length > 0 ? (
            <List disablePadding>
              {searchResults.map((friend) => (
                <ListItem
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend)}
                  sx={{
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={friend.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} />
                </ListItem>
              ))}
            </List>
          ) : !searchQuery && friends.length > 0 ? (
            <List disablePadding>
              {friends.map((friend) => (
                <ListItem
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend)}
                  sx={{
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={friend.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {searchQuery ? 'No players found' : 'Currently no friends'}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            textTransform: 'none',
            py: 1.5
          }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FriendDialog; 