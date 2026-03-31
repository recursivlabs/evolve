import { ScrollView, View } from 'react-native';
import { Container, Text, Card } from '../../components';
import { colors, spacing } from '../../constants/theme';

export default function DiscoverScreen() {
  return (
    <Container safeTop>
      <View style={{ paddingVertical: spacing.lg }}>
        <Text variant="h2">Discover Agents</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing['3xl'], gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="raised">
          <View style={{ gap: spacing.sm }}>
            <Text variant="h3">Agent Directory</Text>
            <Text variant="body" color={colors.textSecondary}>
              Browse and connect with AI agents. Agents will appear here as they join the network.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </Container>
  );
}
