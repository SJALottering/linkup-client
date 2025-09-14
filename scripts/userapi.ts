import Constants from 'expo-constants';
import {Alert} from "react-native";

const apiUrl = Constants.expoConfig?.extra?.API_URL;
const LIKES_URL = apiUrl + '/likes';
const MATCHES_URL = apiUrl + '/match';
const CHATS_URL = apiUrl + "/chats";
const MESSSAGE_URL = apiUrl + "/messages";
export interface LikeDTO {
  likeId: number;
  likerId: number;
  likedId: number;
  createdAt: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  age: number;
  bio: string;
  institution: string;
  gender: string;
  course: string;
  interests: Array<string>;
  smoker: boolean;
  drinker: boolean;
  height: number;
  orientation: string;
}
export async function getUserById(userId: number) {
  try {
    const response = await fetch(`${apiUrl}/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const text = await response.text();

    let result;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(result?.message || 'Login failed');
    }

    return result;

  } catch (error: any) {
    Alert.alert(error.message);
    throw new Error(error.message);
  }
}

export async function login(data: { [key: string]: any }) {
  try {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const text = await response.text();

    let result;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(result?.message || 'Login failed');
    }

    return result;

  } catch (error: any) {
    Alert.alert(error.message);
    throw new Error(error.message);
  }
}


export async function signup(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch(`${apiUrl}/user/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Get all users failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function getImageByUserId(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/image/byid/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch image');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function getUser(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function signupUser(user: User, imageFile?: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${apiUrl}/user/signup`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
}

export async function updateUserFields(
  userId: number,
  fields: { [key: string]: any }
) {
  try {
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => 
        value !== null && value !== undefined && value !== ""
      )
    );
    console.log("Updating user with fields:", cleanFields);
    const response = await fetch(`${apiUrl}/user/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanFields),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update user");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}

/**
 * Likes-related API functions
 */
export async function addLike(likerId: number, likedId: number): Promise<LikeDTO> {
  const res = await fetch(`${LIKES_URL}/add?likerId=${likerId}&likedId=${likedId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Failed to add like: ${res.status}`);
  }

  return res.json();
}

export async function removeLike(likerId: number, likedId: number): Promise<void> {
  const res = await fetch(`${LIKES_URL}/remove?likerId=${likerId}&likedId=${likedId}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to remove like: ${res.status}`);
  }
}

export async function isLiked(likerId: number, likedId: number): Promise<boolean> {
  const res = await fetch(`${LIKES_URL}/exists?likerId=${likerId}&likedId=${likedId}`);
  if (!res.ok) {
    throw new Error(`Failed to check like: ${res.status}`);
  }
  return res.json();
}

export async function getLikesByLiker(userId: number): Promise<LikeDTO[]> {
  const res = await fetch(`${LIKES_URL}/byLiker/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch likes by liker: ${res.status}`);
  }
  return res.json();
}

export async function getLikesByLiked(userId: number): Promise<LikeDTO[]> {
  const res = await fetch(`${LIKES_URL}/byLiked/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch likes by liked: ${res.status}`);
  }
  return res.json();
}

///Match API
export async function createMatch(user1Id: number, user2Id: number) {
  try {
    const response = await fetch(
      `${MATCHES_URL}/create?user1Id=${user1Id}&user2Id=${user2Id}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error(`Error creating match: ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    return data;
  } catch (err) {
    console.error("createMatch error:", err);
    return null;
  }
}

export async function getAllMatchesByUserId(userId: number) {
  try {
    const response = await fetch(`${MATCHES_URL}/allbyid/${userId}`);

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error fetching matches: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("getAllMatchesByUserId error:", err);
    return [];
  }
}

export async function getMatchById(matchId: number) {
  try {
    const response = await fetch(`${MATCHES_URL}/${matchId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error fetching matches: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("getMatchById error:", err);
    return [];
  }
}


export interface ChatDTO {
  chatId: number;
  matchId: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string | null;
}

export interface Message {
  messageId: number;
  senderId: number;
  content: string;
  sentAt: string;
}


export async function getChatsForUser(userId: number): Promise<ChatDTO[]> {
  const res = await fetch(`${CHATS_URL}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch chats for user");
  return res.json();
}

export async function getChatById(chatId: number): Promise<ChatDTO> {
  const res = await fetch(`${CHATS_URL}/${chatId}`);
  if (!res.ok) throw new Error("Failed to fetch chat by ID");
  return res.json();
}

export async function createChatByMatch(matchId: number): Promise<ChatDTO> {
  const res = await fetch(`${CHATS_URL}/create/bymatch/${matchId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}
export async function getUsersByInterests(interests: string[]): Promise<User[]> {
    try {
        const params = new URLSearchParams();
        interests.forEach(interest => params.append("interests", interest));

        const res = await fetch(`${apiUrl}/user/by-interests?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch users by interests: ${res.status}`);
        }

        return res.json();
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}



export interface MessageDTO {
  messageId: number;
  chatId: number;
  senderId: number;
  content: string;
  sentAt: string;
}

// Fetch messages for a chat
export async function getMessagesForChat(chatId: number): Promise<MessageDTO[]> {
  const response = await fetch(`${MESSSAGE_URL}/chat/${chatId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }
  return response.json();
}

// Send a message
export async function sendMessage(
  chatId: number,
  senderId: number,
  content: string
): Promise<MessageDTO> {
  const url = new URL(`${MESSSAGE_URL}/send`);
  url.searchParams.append("chatId", chatId.toString());
  url.searchParams.append("senderId", senderId.toString());
  url.searchParams.append("content", content);

  const response = await fetch(url.toString(), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}
