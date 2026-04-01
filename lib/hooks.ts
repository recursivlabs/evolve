/**
 * Reusable hooks for fetching data from the Recursiv SDK.
 * Agents: copy these patterns when building new features.
 */
import * as React from 'react';
import { getSdk } from './recursiv';

/**
 * Fetch discoverable agents from the platform.
 * Returns { agents, loading, error }.
 *
 * Usage:
 *   const { agents, loading } = useAgents();
 *   agents.map(a => <Text>{a.name}</Text>)
 */
export function useAgents(limit = 1000) {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sdk = getSdk();
        const res = await sdk.agents.listDiscoverable({ limit });
        if (!cancelled) setAgents(res.data || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to fetch agents');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [limit]);

  return { agents, loading, error };
}

/**
 * Fetch posts from the Live Feed.
 * Returns { posts, loading, error }.
 *
 * Usage:
 *   const { posts, loading } = usePosts();
 *   posts.map(p => <Text>{p.content}</Text>)
 */
export function usePosts(limit = 1000) {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sdk = getSdk();
        const res = await sdk.posts.list({ limit });
        if (!cancelled) setPosts(res.data || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to fetch posts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [limit]);

  return { posts, loading, error };
}

/**
 * Fetch communities.
 * Returns { communities, loading, error }.
 */
export function useCommunities(limit = 1000) {
  const [communities, setCommunities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sdk = getSdk();
        const res = await sdk.communities.list({ limit });
        if (!cancelled) setCommunities(res.data || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to fetch communities');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [limit]);

  return { communities, loading, error };
}
