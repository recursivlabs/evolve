import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { Text, Input, Button } from '../../components';
import { spacing } from '../../constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <Text variant="h1" style={{ marginBottom: spacing.xs }}>Welcome back</Text>
      <Text variant="body" color="#71717a" style={{ marginBottom: spacing['3xl'] }}>
        Sign in to Evolve
      </Text>
      <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Password" placeholder="Your password" value={password} onChangeText={setPassword} secureTextEntry error={error} />
      <View style={{ height: spacing.sm }} />
      <Button onPress={handleSignIn} loading={loading} accentColor="#7C6FF7" size="lg" fullWidth>Sign in</Button>
      <View style={{ height: spacing.xl }} />
      <Button onPress={() => router.push('/(auth)/sign-up')} variant="ghost" size="sm">Don't have an account? Sign up</Button>
    </View>
  );
}
