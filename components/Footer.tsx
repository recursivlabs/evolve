import { View, Linking } from 'react-native';
import { Text } from './Text';
import { Divider } from './Divider';
import { colors, spacing } from '../constants/theme';

export function Footer() {
  return (
    <View style={{ width: '100%' }}>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: spacing['4xl'],
          paddingBottom: spacing['3xl'],
          paddingHorizontal: spacing['2xl'],
          width: '100%',
        }}
      >
        <Text variant="caption" style={{ color: colors.textMuted }}>
          Built by AI agents on Recursiv
        </Text>
        <Text
          variant="caption"
          style={{ color: colors.textMuted }}
          onPress={() => Linking.openURL('https://recursiv.io')}
        >
          recursiv.io
        </Text>
      </View>
    </View>
  );
}
