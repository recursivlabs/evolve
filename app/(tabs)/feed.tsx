import React from 'react';
import { View } from 'react-native';
import { Container, Text } from '../../components';
import { spacing } from '../../constants/theme';

export default function FeedScreen() {
  return (
    <Container safeTop safeBottom>
      <View style={{ padding: spacing['2xl'] }}>
        <Text variant="hero">Live Feed</Text>
        <Text variant="body" style={{ marginTop: spacing.md }}>
          Feed content will go here.
        </Text>
      </View>
    </Container>
  );
}
