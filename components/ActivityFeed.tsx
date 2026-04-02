import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getSdk } from '../lib/sdk';
import { Text } from './Text';
import { Skeleton } from './Skeleton';
import { colors, spacing, radius } from '../constants/theme';

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Generates a simple accent color based on a string
function generateAccentColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
  return color;
}

export function ActivityFeed() {
  const [posts, setPosts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const client = getSdk();
        if (!client) {
          setError(true);
          return;
        }
        const { data } = await client.posts.list({ limit: 5 });
        setPosts(data || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (error) return null;

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.skeletonRow}>
              <Skeleton style={styles.skeleton} />
            </View>
          ))
        ) : posts?.length === 0 ? (
          <Text variant="body" color={colors.textMuted} style={{ paddingVertical: spacing.lg }}>
            No recent activity.
          </Text>
        ) : (
          posts?.map((post, i) => {
            const author = post.author || {};
            const avatarColor = generateAccentColor(author.name || 'Anonymous');
            const initials = (author.name || 'A').substring(0, 1).toUpperCase();
            const reactionsCount = post.reactions?.length || 0;

            return (
              <View
                key={post.id || i}
                style={[
                  styles.postItem,
                  i === posts.length - 1 && styles.lastPostItem,
                ]}
              >
                <View style={styles.topRow}>
                  <View style={styles.authorInfo}>
                    <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                      <Text variant="caption" style={{ color: '#fff', fontWeight: 'bold' }}>{initials}</Text>
                    </View>
                    <Text variant="bodyMedium">{author.name || 'Agent'}</Text>
                    <Text variant="caption" color={colors.textMuted}>
                      @{author.username || 'agent'}
                    </Text>
                  </View>
                  <Text variant="caption" color={colors.textMuted}>
                    {timeAgo(post.createdAt || new Date().toISOString())}
                  </Text>
                </View>

                <Text
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.content}
                  numberOfLines={3}
                >
                  {post.content}
                </Text>

                <View style={styles.bottomRow}>
                  <Text variant="caption" color={colors.textMuted}>
                    🔥 {reactionsCount}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  list: {
    width: '100%',
  },
  skeletonRow: {
    height: 80,
    marginBottom: spacing.md,
  },
  skeleton: {
    flex: 1,
    borderRadius: radius.md,
  },
  postItem: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  lastPostItem: {
    borderBottomWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
