import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { SectionHeader } from '@/src/components/SectionHeader';
import { classifierStatus } from '@/src/services/mockClassifier';
import { mockCrawlerStatuses } from '@/src/services/mockCrawlerStatus';
import { colors } from '@/src/theme/colors';

const statusMeta = {
  active: { label: 'active', color: colors.success },
  degraded: { label: 'degraded', color: colors.warning },
  failed: { label: 'failed', color: colors.danger },
};

export default function SystemStatusScreen() {
  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <Text style={styles.title}>System Status</Text>
      </View>

      <View style={styles.pipelineCard}>
        <Text style={styles.pipelineLabel}>Mock Pipeline Health</Text>
        <Text style={styles.pipelineTitle}>수집 · 정규화 · 분류 · 알림 준비</Text>
        <Text style={styles.pipelineBody}>
          데모 앱에서는 실제 크롤링과 BERT 추론 대신 교체 가능한 서비스 계층으로 상태를 표시합니다.
        </Text>
      </View>

      <SectionHeader title="Crawler Sources" />
      {mockCrawlerStatuses.map((source) => {
        const meta = statusMeta[source.status];
        return (
          <View key={source.id} style={styles.sourceCard}>
            <View style={styles.sourceTop}>
              <Text style={styles.sourceName}>{source.sourceName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: meta.color }]}>
                <Text style={styles.statusText}>{meta.label}</Text>
              </View>
            </View>
            <Text style={styles.sourceTime}>Last crawl: {source.lastCrawlTime}</Text>
            <View style={styles.countRow}>
              <View style={styles.countBox}>
                <Text style={styles.countValue}>{source.fetchedCount}</Text>
                <Text style={styles.countLabel}>fetched</Text>
              </View>
              <View style={styles.countBox}>
                <Text style={styles.countValue}>{source.insertedCount}</Text>
                <Text style={styles.countLabel}>inserted</Text>
              </View>
            </View>
          </View>
        );
      })}

      <SectionHeader title="Classifier" />
      <View style={styles.classifierCard}>
        <Text style={styles.modelName}>{classifierStatus.modelName}</Text>
        <Text style={styles.modelVersion}>version {classifierStatus.version}</Text>
        <View style={styles.modelGrid}>
          <View style={styles.modelMetric}>
            <Text style={styles.modelMetricValue}>
              {Math.round(classifierStatus.averageConfidence * 100)}%
            </Text>
            <Text style={styles.modelMetricLabel}>avg confidence</Text>
          </View>
          <View style={styles.modelMetric}>
            <Text style={styles.modelMetricValue}>
              {Math.round(classifierStatus.fallbackRate * 100)}%
            </Text>
            <Text style={styles.modelMetricLabel}>fallback</Text>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  pipelineCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 6,
  },
  pipelineLabel: {
    color: '#CFE1D7',
    fontSize: 12,
    fontWeight: '900',
  },
  pipelineTitle: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    marginTop: 7,
  },
  pipelineBody: {
    color: '#DDEEE5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  sourceCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  sourceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sourceName: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  statusBadge: {
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  sourceTime: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  countRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  countBox: {
    flex: 1,
    backgroundColor: colors.faint,
    borderRadius: 8,
    padding: 10,
  },
  countValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  classifierCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
  },
  modelName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  modelVersion: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 5,
    fontWeight: '800',
  },
  modelGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modelMetric: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    padding: 12,
  },
  modelMetricValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  modelMetricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
});
