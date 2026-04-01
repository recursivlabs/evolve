import { View, Linking, Platform } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing } from '../constants/theme';

export function Header() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        backgroundColor: colors.surface,
        ...(Platform.OS === 'web'
          ? {
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }
          : {}),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text variant="h3" style={{ color: colors.text }}>
          Evolve
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            // Future Auth flow routing
          }}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            // Future Auth flow routing
          }}
        >
          Get started
        </Button>
      </View>
    </View>
  );
}
