import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.mark} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 18,
  },
  mark: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.secondary,
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
