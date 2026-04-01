import * as React from 'react';
import { View, Platform } from 'react-native';
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
  isWeb,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isWeb: boolean;
  isLast: boolean;
}) {
  return (
    <View
      style={[
        {
          flex: isWeb ? 1 : undefined,
          // On mobile: left border + left padding
          // On web: top border + top padding
          borderLeftWidth: isWeb ? 0 : 2,
          borderTopWidth: isWeb ? 2 : 0,
          borderLeftColor: colors.borderSubtle,
          borderTopColor: colors.borderSubtle,
          paddingLeft: isWeb ? 0 : spacing['2xl'],
          paddingTop: isWeb ? spacing['2xl'] : 0,
          marginBottom: isLast ? 0 : isWeb ? 0 : spacing['4xl'],
          marginRight: isWeb && !isLast ? spacing['3xl'] : 0,
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
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        paddingHorizontal: spacing['3xl'],
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

      <View style={{ flexDirection: isWeb ? 'row' : 'column' }}>
        {STEPS.map((step, i) => (
          <Step
            key={step.number}
            {...step}
            isWeb={isWeb}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
