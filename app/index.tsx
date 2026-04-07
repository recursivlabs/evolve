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
    <Container centered>
      <View
        style={{
          alignItems: 'center',
          maxWidth: 440,
          width: '100%',
          paddingHorizontal: spacing.lg,
        }}
      >
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
                ? { filter: 'blur(80px)' } as any
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
            style={{ marginBottom: spacing['4xl'], maxWidth: 360 }}
          >
            {description}
          </Text>
        ) : (
          <View style={{ height: spacing['3xl'] }} />
        )}

        {/* CTA */}
        <Button
          onPress={() => router.push('/(auth)/sign-up')}
          accentColor={accentColor}
          size="lg"
          fullWidth
        >
          Get started
        </Button>

        <View style={{ height: spacing.md }} />

        <Button
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
          size="sm"
        >
          Already have an account? Sign in
        </Button>
      </View>
    </Container>
  );
}
