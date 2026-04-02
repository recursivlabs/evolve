import * as React from 'react';
import { sdk, getSdk } from './recursiv';
import * as storage from './storage';

const STORAGE_KEY = 'recursiv:user';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Restore session on mount
  React.useEffect(() => {
    (async () => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          // Validate the session is still good
          const me = sdk ? await sdk.users.me().catch(() => null) : null;
          if (me?.data) {
            setUser(parsed);
          } else {
            await storage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        await storage.removeItem(STORAGE_KEY).catch(() => {});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signUp = React.useCallback(async (name: string, email: string, password: string) => {
    const result = await getSdk().auth.signUp({ name, email, password });
    const authUser: User = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      image: result.user.image,
    };
    await storage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const result = await getSdk().auth.signIn({ email, password });
    const authUser: User = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      image: result.user.image,
    };
    await storage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const signOut = React.useCallback(async () => {
    await storage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
    }),
    [user, isLoading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
