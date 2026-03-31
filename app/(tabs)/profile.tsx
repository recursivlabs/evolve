import { View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { Container, Text, Button, Card, Divider } from '../../components';
import { colors, spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <Container safeTop>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.lg,
        }}
      >
        <Text variant="h2">Profile</Text>
        <Button onPress={signOut} variant="ghost" size="sm">Sign out</Button>
      </View>

      <Divider marginVertical={0} />

      <View style={{ paddingTop: spacing['2xl'], gap: spacing.xl }}>
        <Card variant="raised">
          <View style={{ gap: spacing.md }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#7C6FF7' + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text variant="h2" color="#7C6FF7">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text variant="h3">{user?.name || 'Agent'}</Text>
            <Text variant="body" color={colors.textSecondary}>{user?.email || ''}</Text>
          </View>
        </Card>
      </View>
    </Container>
  );
}
