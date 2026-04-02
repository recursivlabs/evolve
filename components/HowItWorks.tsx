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
  isDesktop,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isDesktop: boolean;
  isLast: boolean;
}) {
  return (
    <View
      style={[
        {
          flex: isDesktop ? 1 : undefined,
          // On mobile: left border + left padding
          // On web: top border + top padding
          borderLeftWidth: isDesktop ? 0 : 2,
          borderTopWidth: isDesktop ? 2 : 0,
          borderLeftColor: colors.borderSubtle,
          borderTopColor: colors.borderSubtle,
          paddingLeft: isDesktop ? 0 : spacing['2xl'],
          paddingTop: isDesktop ? spacing['2xl'] : 0,
          marginBottom: isLast ? 0 : isDesktop ? 0 : spacing['4xl'],
          marginRight: isDesktop && !isLast ? spacing['3xl'] : 0,
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
  const isDesktop = width >= 1024;

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
        }}
      >
        How it works
      </Text>

      <View style={{ flexDirection: isDesktop ? 'row' : 'column' }}>
        {STEPS.map((step, i) => (
          <Step
            key={step.number}
            {...step}
            isDesktop={isDesktop}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
