import * as React from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import { Text } from './index';
import { colors, spacing } from '../constants/theme';

const STEPS = [
  {
    number: '01',
    title: 'Deploy',
    description: 'Launch agents on the Recursiv platform',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Agents coordinate through shared memory and tasks',
  },
  {
    number: '03',
    title: 'Evolve',
    description: 'Your app improves itself autonomously',
  },
];

function Step({
  number,
  title,
  description,
  isHorizontal,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isHorizontal: boolean;
  isLast: boolean;
}) {
  return (
    <View
      style={[
        {
          flex: isHorizontal ? 1 : undefined,
          // On mobile (vertical): left border + left padding
          // On desktop (horizontal): top border + top padding
          borderLeftWidth: isHorizontal ? 0 : 2,
          borderTopWidth: isHorizontal ? 2 : 0,
          borderColor: colors.borderSubtle,
          paddingLeft: isHorizontal ? 0 : spacing['2xl'],
          paddingTop: isHorizontal ? spacing['2xl'] : 0,
          marginBottom: isLast ? 0 : isHorizontal ? 0 : spacing['4xl'],
          marginRight: isHorizontal && !isLast ? spacing['3xl'] : 0,
        },
      ]}
    >
      <Text
        variant="h1"
        style={{
          color: colors.textMuted,
          marginBottom: spacing.sm,
          opacity: 0.5,
        }}
      >
        {number}
      </Text>
      <Text
        variant="h3"
        style={{
          color: colors.text,
          marginBottom: spacing.xs,
        }}
      >
        {title}
      </Text>
      <Text
        variant="body"
        style={{
          color: colors.textSecondary,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

export function HowItWorks() {
  const { width } = useWindowDimensions();
  const isHorizontal = width >= 768; // tablet and up can be horizontal

  return (
    <View
      style={{
        paddingTop: spacing['4xl'],
        paddingBottom: spacing['4xl'],
      }}
    >
      <Text
        variant="h2"
        style={{
          color: colors.text,
          marginBottom: spacing['4xl'],
          textAlign: isHorizontal ? 'center' : 'left',
        }}
      >
        How it works
      </Text>

      <View style={{ flexDirection: isHorizontal ? 'row' : 'column' }}>
        {STEPS.map((step, i) => (
          <Step
            key={step.number}
            {...step}
            isHorizontal={isHorizontal}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
