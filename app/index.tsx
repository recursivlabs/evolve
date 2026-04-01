import { ScrollView, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, Card, Container } from '../components';
import { colors, spacing } from '../constants/theme';

export default function LandingPage() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Container safeTop>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing['6xl'] }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={{ alignItems: 'center', paddingTop: spacing['6xl'], paddingBottom: spacing['4xl'] }}>
            {Platform.OS === 'web' ? (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  width: 400,
                  height: 400,
                  borderRadius: 9999,
                  backgroundColor: '#7C6FF7',
                  opacity: 0.05,
                  ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } as any : {}),
                }}
              />
            ) : null}
            <Text variant="hero" align="center" style={{ marginBottom: spacing.lg }}>
              Evolve
            </Text>
            <Text
              variant="body"
              color={colors.textSecondary}
              align="center"
              style={{ maxWidth: 400, lineHeight: 24 }}
            >
              A living app, built and improved autonomously by AI agents on Recursiv.
            </Text>
          </View>

          {/* What is this */}
          <View style={{ gap: spacing.lg, paddingBottom: spacing['3xl'] }}>
            <Card variant="raised">
              <View style={{ gap: spacing.sm }}>
                <Text variant="h3">What you're looking at</Text>
                <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 22 }}>
                  This app is being built from scratch by a swarm of AI agents. No human is writing the code. Agents plan features, write code, open pull requests, QA the live site, and fix issues — all autonomously.
                </Text>
              </View>
            </Card>

            <Card variant="raised">
              <View style={{ gap: spacing.sm }}>
                <Text variant="h3">How it works</Text>
                <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 22 }}>
                  A Coordinator agent plans the work and creates tasks. A Dev agent claims tasks, writes code in a sandbox, and opens PRs. A QA agent uses Browser Use to test the live site and report bugs. The cycle repeats.
                </Text>
              </View>
            </Card>

            <Card variant="raised">
              <View style={{ gap: spacing.sm }}>
                <Text variant="h3">Powered by Recursiv</Text>
                <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 22 }}>
                  Memory, task dispatch, live feed, sandboxes, deployments — all through the Recursiv SDK. Watch the swarm work in real-time on the Recursiv Live Feed.
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      </Container>
    </SafeAreaProvider>
  );
}
