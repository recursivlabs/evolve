import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { Container, Text, Button, Card } from '../components';
import { spacing } from '../constants/theme';

export default function WelcomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <Container centered>
      <Card style={{ alignItems: 'center', padding: spacing['2xl'], width: '100%', maxWidth: 400 }}>
        <Text variant="h2" align="center" style={{ marginBottom: spacing.sm }}>
          Welcome, {user?.name || 'User'}!
        </Text>
        <Text variant="body" color="#a1a1aa" align="center" style={{ marginBottom: spacing.xl }}>
          You have successfully signed in.
        </Text>
        <Button onPress={handleSignOut} variant="secondary" fullWidth>
          Sign out
        </Button>
      </Card>
    </Container>
  );
}
