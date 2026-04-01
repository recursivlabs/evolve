import { View, Platform } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../lib/auth';

export function Header() {
  const { isAuthenticated, user, signIn, signUp, signOut } = useAuth();

  return (
    <View
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        backgroundColor: colors.surface,
      }, Platform.OS === 'web' && {
        position: 'sticky' as any,
        top: 0,
        zIndex: 50,
      }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text variant="h3" style={{ color: colors.text }}>
          Evolve
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        {isAuthenticated ? (
          <>
            {user?.name && <Text style={{ marginRight: spacing.md }}>{user.name}</Text>}
            <Button
              variant="ghost"
              size="sm"
              onPress={() => signOut()}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => signIn('demo@recursiv.dev', 'password123')}
            >
              Sign in
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={() => signUp('Demo User', 'demo@recursiv.dev', 'password123')}
            >
              Get started
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
