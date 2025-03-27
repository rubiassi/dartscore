import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface AppUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  status?: 'online' | 'offline';
  lastActive?: Date;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  senderName?: string;
  senderPhotoURL?: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  createdAt: Date;
  friendName?: string;
  friendPhotoURL?: string;
  lastActive?: Date;
  status?: 'online' | 'offline';
  rank?: string;
  winRate?: string;
}

// Hent alle venner for en bruger
export const getFriends = async (userId: string): Promise<Friend[]> => {
  const friendsRef = collection(db, 'friends');
  const q = query(friendsRef, where('userId', '==', userId));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Friend));
};

// Hent alle venneanmodninger for en bruger
export const getFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  const requestsRef = collection(db, 'friendRequests');
  const q = query(requestsRef, where('receiverId', '==', userId));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FriendRequest));
};

// Send en venneanmodning
export const sendFriendRequest = async (
  senderId: string, 
  receiverId: string,
  senderName?: string,
  senderPhotoURL?: string
): Promise<void> => {
  const requestsRef = collection(db, 'friendRequests');
  await addDoc(requestsRef, {
    senderId,
    receiverId,
    status: 'pending',
    createdAt: serverTimestamp(),
    senderName,
    senderPhotoURL
  });
};

// Accepter en venneanmodning
export const acceptFriendRequest = async (requestId: string, userId: string, friendId: string): Promise<void> => {
  // Opdater anmodningens status
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, {
    status: 'accepted'
  });

  // Opret venskab for begge brugere
  const friendsRef = collection(db, 'friends');
  await addDoc(friendsRef, {
    userId,
    friendId,
    createdAt: serverTimestamp()
  });

  await addDoc(friendsRef, {
    userId: friendId,
    friendId: userId,
    createdAt: serverTimestamp()
  });
};

// Afvis en venneanmodning
export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, {
    status: 'rejected'
  });
};

// Fjern en ven
export const removeFriend = async (friendshipId: string): Promise<void> => {
  const friendRef = doc(db, 'friends', friendshipId);
  await deleteDoc(friendRef);
};

// Søg efter brugere
export const searchUsers = async (searchTerm: string): Promise<AppUser[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as AppUser));
};

// Opdater brugerens online status
export const updateUserStatus = async (userId: string, status: 'online' | 'offline'): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    status,
    lastActive: serverTimestamp()
  });
};

// Hent online venner
export const getOnlineFriends = async (userId: string): Promise<Friend[]> => {
  const friends = await getFriends(userId);
  return friends.filter(friend => friend.status === 'online');
};

// Hent vennestatistik
export interface FriendStats {
  totalGames: number;
  wins: number;
  losses: number;
  averageScore: number;
  highestCheckout: number;
  lastGameDate?: Date;
}

export const getFriendStats = async (userId: string, friendId: string): Promise<FriendStats> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, 
    where('players', 'array-contains-any', [userId, friendId]),
    where('status', '==', 'completed')
  );
  
  const snapshot = await getDocs(q);
  const games = snapshot.docs.map(doc => doc.data());
  
  const stats: FriendStats = {
    totalGames: 0,
    wins: 0,
    losses: 0,
    averageScore: 0,
    highestCheckout: 0
  };
  
  games.forEach(game => {
    if (game.players.includes(userId) && game.players.includes(friendId)) {
      stats.totalGames++;
      if (game.winner === userId) stats.wins++;
      if (game.winner === friendId) stats.losses++;
      if (game.checkout > stats.highestCheckout) stats.highestCheckout = game.checkout;
      stats.averageScore += game.averageScore || 0;
      if (!stats.lastGameDate || game.completedAt > stats.lastGameDate) {
        stats.lastGameDate = game.completedAt;
      }
    }
  });
  
  stats.averageScore = stats.totalGames > 0 ? stats.averageScore / stats.totalGames : 0;
  
  return stats;
};

// Inviter ven til kamp
export interface GameInvite {
  id: string;
  senderId: string;
  receiverId: string;
  gameType: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  senderName?: string;
  senderPhotoURL?: string;
}

export const sendGameInvite = async (
  senderId: string,
  receiverId: string,
  gameType: string
): Promise<void> => {
  const invitesRef = collection(db, 'gameInvites');
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Udløber efter 30 minutter
  
  await addDoc(invitesRef, {
    senderId,
    receiverId,
    gameType,
    status: 'pending',
    createdAt: serverTimestamp(),
    expiresAt
  });
};

// Hent aktive spilinvitationer
export const getGameInvites = async (userId: string): Promise<GameInvite[]> => {
  const invitesRef = collection(db, 'gameInvites');
  const now = new Date();
  
  const q = query(invitesRef, 
    where('receiverId', '==', userId),
    where('status', '==', 'pending'),
    where('expiresAt', '>', now)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GameInvite));
};

// Besvar spilinvitation
export const respondToGameInvite = async (
  inviteId: string,
  response: 'accepted' | 'rejected'
): Promise<void> => {
  const inviteRef = doc(db, 'gameInvites', inviteId);
  await updateDoc(inviteRef, {
    status: response
  });
};

// Tjek om to brugere er venner
export const checkFriendship = async (userId: string, otherUserId: string): Promise<boolean> => {
  const friendsRef = collection(db, 'friends');
  const q = query(friendsRef, 
    where('userId', '==', userId),
    where('friendId', '==', otherUserId)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Hent fælles venner
export const getMutualFriends = async (userId: string, otherUserId: string): Promise<Friend[]> => {
  const [userFriends, otherUserFriends] = await Promise.all([
    getFriends(userId),
    getFriends(otherUserId)
  ]);
  
  const userFriendIds = userFriends.map(f => f.friendId);
  return otherUserFriends.filter(f => userFriendIds.includes(f.friendId));
};

// Bloker en bruger
export const blockUser = async (userId: string, blockedUserId: string): Promise<void> => {
  const blockedRef = collection(db, 'blockedUsers');
  await addDoc(blockedRef, {
    userId,
    blockedUserId,
    createdAt: serverTimestamp()
  });
  
  // Fjern eventuelle venskaber og anmodninger
  const friendsRef = collection(db, 'friends');
  const requestsRef = collection(db, 'friendRequests');
  
  const [friendshipDocs, requestDocs] = await Promise.all([
    getDocs(query(friendsRef, 
      where('userId', '==', userId),
      where('friendId', '==', blockedUserId)
    )),
    getDocs(query(requestsRef,
      where('senderId', 'in', [userId, blockedUserId]),
      where('receiverId', 'in', [userId, blockedUserId])
    ))
  ]);
  
  // Slet venskaber
  const friendshipDeletes = friendshipDocs.docs.map(doc => 
    deleteDoc(doc.ref)
  );
  
  // Slet anmodninger
  const requestDeletes = requestDocs.docs.map(doc =>
    deleteDoc(doc.ref)
  );
  
  await Promise.all([...friendshipDeletes, ...requestDeletes]);
};

// Tjek om en bruger er blokeret
export const isUserBlocked = async (userId: string, otherUserId: string): Promise<boolean> => {
  const blockedRef = collection(db, 'blockedUsers');
  const q = query(blockedRef,
    where('userId', '==', userId),
    where('blockedUserId', '==', otherUserId)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}; 