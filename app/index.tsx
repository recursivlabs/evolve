import { View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProject } from '../lib/project';
import { useAuth } from '../lib/auth';
import { Container, Text, Button } from '../components';
import { colors, spacing } from '../constants/theme';

export default function LandingScreen() {
  const router = useRouter();
  const { name, description, accentColor } = useProject();
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated && !isLoading) {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <Container safeTop safeBottom centered={false} maxWidth={1200}>
      {/* Navigation Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.xl,
        }}
      >
        <Text variant="h3" style={{ fontWeight: 'bold' }}>
          {name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(auth)/sign-in')}
          >
            Log in
          </Button>
          <Button
            variant="primary"
            size="sm"
            accentColor={accentColor}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            Get Started
          </Button>
        </View>
      </View>

      {/* Hero Section */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <View style={{ alignItems: 'center', maxWidth: 600 }}>
          {/* Subtle glow on web */}
          {Platform.OS === 'web' ? (
            <View
              style={{
                position: 'absolute',
                top: -120,
                width: 300,
                height: 300,
                borderRadius: 9999,
                backgroundColor: accentColor,
                opacity: 0.06,
                ...(Platform.OS === 'web'
                  ? ({ filter: 'blur(80px)' } as any)
                  : {}),
              }}
            />
          ) : null}

          {/* Brand */}
          <Text variant="hero" align="center" style={{ marginBottom: spacing.md }}>
            {name}
          </Text>

          {description ? (
            <Text
              variant="body"
              color={colors.textSecondary}
              align="center"
              style={{ marginBottom: spacing['4xl'], maxWidth: 440 }}
            >
              {description}
            </Text>
          ) : (
            <View style={{ height: spacing['3xl'] }} />
          )}

          {/* CTAs */}
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Button
              onPress={() => router.push('/(auth)/sign-up')}
              accentColor={accentColor}
              size="lg"
            >
              Start building for free
            </Button>
            <Button
              onPress={() => router.push('/(auth)/sign-in')}
              variant="secondary"
              size="lg"
            >
              Sign In
            </Button>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.xl,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          marginTop: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md,
        }}
      >
        <Text variant="caption" color={colors.textSecondary}>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap' }}>
          <Text variant="caption" color={colors.textSecondary}>
            Privacy
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            Terms
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            Contact
          </Text>
        </View>
      </View>
    </Container>
  );
}
