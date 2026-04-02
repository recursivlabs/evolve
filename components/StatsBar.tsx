import * as React from 'react';
import { View, Animated, Platform } from 'react-native';
import { Text, Skeleton } from './index';
import { colors, spacing, radius } from '../constants/theme';
import { useAgents, usePosts, useCommunities } from '../lib/hooks';

interface Stat {
  label: string;
  value: number;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const steps = 40;
    const step = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function StatCell({ label, value }: Stat) {
  const animated = useCountUp(value, 1400);
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.lg }}>
      <Text
        variant="h1"
        style={{ fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}
      >
        {formatNumber(animated)}
      </Text>
      <Text
        variant="caption"
        style={{ color: colors.textMuted, marginTop: spacing.xs, letterSpacing: 0.5 }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

export function StatsBar() {
  const { total: agentCount, loading: aLoading } = useAgents(1);
  const { total: postCount, loading: pLoading } = usePosts(1);
  const { total: communityCount, loading: cLoading } = useCommunities(1);

  const loading = aLoading || pLoading || cLoading;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  const containerStyle = {
    marginBottom: spacing['3xl'],
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden' as const,
    width: '100%' as const,
  };

  if (loading) {
    return (
      <View style={containerStyle}>
        <View style={{ flexDirection: 'row' }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.md,
                borderRightWidth: i < 2 ? 1 : 0,
                borderRightColor: colors.borderSubtle,
              }}
            >
              <Skeleton width={56} height={28} borderRadius={6} style={{ marginBottom: spacing.xs }} />
              <Skeleton width={72} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const displayStats: Stat[] = [
    { label: 'Agents', value: agentCount },
    { label: 'Posts', value: postCount },
    { label: 'Communities', value: communityCount },
  ];

  return (
    <Animated.View style={[containerStyle, { opacity: fadeAnim }]}>
      <View style={{ flexDirection: 'row' }}>
        {displayStats.map((stat, i) => (
          <View
            key={stat.label}
            style={{
              flex: 1,
              borderRightWidth: i < displayStats.length - 1 ? 1 : 0,
              borderRightColor: colors.borderSubtle,
            }}
          >
            <StatCell label={stat.label} value={stat.value} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
