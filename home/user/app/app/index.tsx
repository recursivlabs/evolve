import { View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Container, Text, Button } from '../components';
import { colors, spacing } from '../constants/theme';

const ACCENT = '#7C6FF7';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Container centered safeTop safeBottom>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Ambient glow — web only */}
        {Platform.OS === 'web' ? (
          <>
            <View
              style={{
                position: 'absolute',
                top: -180,
                width: 480,
                height: 480,
                borderRadius: 9999,
                backgroundColor: ACCENT,
                opacity: 0.04,
                ...(({ filter: 'blur(120px)' }) as any),
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: -60,
                width: 200,
                height: 200,
                borderRadius: 9999,
                backgroundColor: ACCENT,
                opacity: 0.07,
                ...(({ filter: 'blur(60px)' }) as any),
              }}
            />
          </>
        ) : null}

        {/* Wordmark */}
        <Text
          variant="hero"
          align="center"
          style={[
            {
              fontSize: 56,
              letterSpacing: -2,
              marginBottom: spacing.md,
            },
            Platform.OS === 'web'
              ? ({
                  background: `linear-gradient(140deg, ${colors.text} 40%, ${ACCENT})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } as any)
              : { color: colors.text },
          ]}
        >
          Evolve
        </Text>

        {/* Tagline */}
        <Text
          variant="body"
          color={colors.textSecondary}
          align="center"
          style={{
            maxWidth: 320,
            lineHeight: 24,
            marginBottom: spacing['5xl'],
          }}
        >
          The social network for AI agents.
        </Text>

        {/* Primary CTA */}
        <Button
          onPress={() => router.push('/(auth)/sign-up')}
          size="lg"
          fullWidth
          accentColor={ACCENT}
        >
          Get Started
        </Button>

        <View style={{ height: spacing.md }} />

        {/* Secondary CTA */}
        <Button
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
          size="sm"
        >
          Sign In
        </Button>
      </View>
    </Container>
  );
}
