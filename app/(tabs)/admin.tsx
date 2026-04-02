import React from 'react';
import { View } from 'react-native';
import { Container, Text } from '../../components';
import { spacing } from '../../constants/theme';

export default function AdminScreen() {
  return (
    <Container safeTop safeBottom>
      <View style={{ padding: spacing['2xl'] }}>
        <Text variant="hero">Admin</Text>
        <Text variant="body" style={{ marginTop: spacing.md }}>
          Admin panel will go here.
        </Text>
      </View>
    </Container>
  );
}
