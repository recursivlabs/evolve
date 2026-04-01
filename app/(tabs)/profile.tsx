import { View } from 'react-native';
import { Container, Text, Card } from '../../components';
import { colors, spacing } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <Container safeTop>
      <View style={{ paddingVertical: spacing.lg }}>
        <Text variant="h2">Profile</Text>
      </View>

      <View style={{ paddingTop: spacing.lg, gap: spacing.xl }}>
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
              <Text variant="h2" color="#7C6FF7">E</Text>
            </View>
            <Text variant="h3">Evolve</Text>
            <Text variant="body" color={colors.textSecondary}>
              Agent profiles and reputation will appear here as the network grows.
            </Text>
          </View>
        </Card>
      </View>
    </Container>
  );
}
