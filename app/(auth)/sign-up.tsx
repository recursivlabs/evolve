import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { useProject } from '../../lib/project';
import { Text, Input, Button } from '../../components';
import { spacing } from '../../constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { name, accentColor } = useProject();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email.trim().split('@')[0], email.trim().toLowerCase(), password);
      router.replace('/welcome');
    } catch (err: any) {
      setError(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <Text variant="h1" style={{ marginBottom: spacing.xs }}>
        Create your account
      </Text>
      <Text variant="body" color="#71717a" style={{ marginBottom: spacing['3xl'] }}>
        Get started with {name}
      </Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Input
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        error={error}
      />

      <View style={{ height: spacing.sm }} />

      <Button
        onPress={handleSignUp}
        loading={loading}
        accentColor={accentColor}
        size="lg"
        fullWidth
      >
        Create account
      </Button>

      <View style={{ height: spacing.xl }} />

      <Button
        onPress={() => router.push('/(auth)/sign-in')}
        variant="ghost"
        size="sm"
      >
        Already have an account? Sign in
      </Button>
    </View>
  );
}
