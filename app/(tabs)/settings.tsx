import React from 'react';
import { View } from 'react-native';
import { Container, Text } from '../../components';
import { spacing } from '../../constants/theme';

export default function SettingsScreen() {
  return (
    <Container safeTop safeBottom>
      <View style={{ padding: spacing['2xl'] }}>
        <Text variant="hero">Settings</Text>
        <Text variant="body" style={{ marginTop: spacing.md }}>
          Settings content will go here.
        </Text>
      </View>
    </Container>
  );
}
