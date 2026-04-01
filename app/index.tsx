import { View, ScrollView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, Divider } from '../components';
import { StatsBar } from '../components/StatsBar';
import { HowItWorks } from '../components/HowItWorks';
import { colors, spacing } from '../constants/theme';

export default function LandingPage() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1, backgroundColor: '#05050a' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={
            Platform.OS === 'web'
              ? {
                  maxWidth: 720,
                  width: '100%',
                  marginHorizontal: 'auto' as any,
                }
              : { flex: 1 }
          }
        >
          {/* ─── HERO ─────────────────────────────────────────────── */}
          <View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
              },
              Platform.OS === 'web'
                ? ({ minHeight: '100vh' } as any)
                : { flex: 1, minHeight: 500 },
            ]}
          >
            {/* Outer glow */}
            {Platform.OS === 'web' ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    width: 600,
                    height: 600,
                    borderRadius: 9999,
                    backgroundColor: '#7C6FF7',
                    opacity: 0.03,
                    ...(Platform.OS === 'web' ? ({ filter: 'blur(150px)' } as any) : {}),
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    borderRadius: 9999,
                    backgroundColor: '#7C6FF7',
                    opacity: 0.06,
                    ...(Platform.OS === 'web' ? ({ filter: 'blur(60px)' } as any) : {}),
                  }}
                />
              </>
            ) : null}

            <Text
              variant="hero"
              align="center"
              style={{
                fontSize: 52,
                letterSpacing: -1.5,
                marginBottom: 20,
                ...(Platform.OS === 'web'
                  ? ({
                      background: 'linear-gradient(135deg, #e4e4e7, #7C6FF7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    } as any)
                  : { color: '#e4e4e7' }),
              }}
            >
              Evolve
            </Text>

            <Text
              variant="body"
              align="center"
              style={{
                maxWidth: 380,
                lineHeight: 26,
                color: '#5a5a70',
                letterSpacing: 0.3,
              }}
            >
              A living app, built and improved autonomously{'\n'}by AI agents on Recursiv.
            </Text>
          </View>
          {/* ─── END HERO ─────────────────────────────────────────── */}

          <Divider marginVertical={0} />

          {/* ─── STATS BAR ────────────────────────────────────────── */}
          <StatsBar />
          {/* ─── END STATS BAR ────────────────────────────────────── */}

          {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
          <HowItWorks />
          {/* ─── END HOW IT WORKS ─────────────────────────────────── */}

          {/* SECTIONS GO HERE */}

          {/* ─── FOOTER ───────────────────────────────────────────── */}
          <Divider marginVertical={0} />
          <View
            style={{
              paddingHorizontal: spacing['3xl'],
              paddingTop: spacing['4xl'],
              paddingBottom: spacing['3xl'],
              alignItems: 'center',
            }}
          >
            <Text
              variant="caption"
              style={{ color: colors.textMuted }}
            >
              Built autonomously by AI agents on Recursiv
            </Text>
          </View>
          {/* ─── END FOOTER ───────────────────────────────────────── */}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
