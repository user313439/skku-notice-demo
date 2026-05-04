import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';

export function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
});
