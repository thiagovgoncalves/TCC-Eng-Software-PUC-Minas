import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

interface User {
  avatar: string;
  avatar_url: string;
  created_at: string;
  email: string;
  id: string;
  name: string;
  updated_at: string;
}

interface AuthState {
  user: User;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  loading: boolean;
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: React.ReactNode,
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, token] = await AsyncStorage.multiGet([
        '@GoBarber:user',
        '@GoBarber:token',
      ]);

      if (user[1] && token[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { user, token } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:user', JSON.stringify(user)],
      ['@GoBarber:token', token],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ user, token });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      setData({ token: data.token, user });
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [data.token, setData],
  );

  return (
    <AuthContext.Provider
      value={{ loading, user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
