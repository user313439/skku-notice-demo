import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { SectionHeader } from '@/src/components/SectionHeader';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export default function OnboardingScreen() {
  const { academicUnits, colleges, preferences, completeOnboarding } = useAppState();
  const [selectedCollegeId, setSelectedCollegeId] = useState('college-sw');
  const [selectedIds, setSelectedIds] = useState(preferences.selectedUnitIds);
  const [keywordText, setKeywordText] = useState(preferences.keywords.join(', '));

  useEffect(() => {
    setSelectedIds(preferences.selectedUnitIds);
    setKeywordText(preferences.keywords.join(', '));
  }, [preferences.selectedUnitIds, preferences.keywords]);

  const visibleUnits = useMemo(
    () => academicUnits.filter((unit) => unit.collegeId === selectedCollegeId),
    [academicUnits, selectedCollegeId],
  );
  const selectedCollege = colleges.find((college) => college.id === selectedCollegeId);

  const keywords = useMemo(
    () =>
      keywordText
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    [keywordText],
  );

  const toggleUnit = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const startDemo = () => {
    completeOnboarding(selectedIds.length ? selectedIds : preferences.selectedUnitIds, keywords);
    router.replace('/home');
  };

  return (
    <AppShell>
      <View style={styles.hero}>
        <Text style={styles.kicker}>SKKU Notice Aggregator</Text>
        <Text style={styles.title}>성균 공지 통합 알림 서비스</Text>
        <Text style={styles.body}>
          단과대학을 먼저 고른 뒤 학과와 융합전공을 선택하면 맞춤형 공지 피드가 구성됩니다.
        </Text>
      </View>

      <SectionHeader title="단과대학 선택" caption="공식 대학·학과 구조를 기반으로 구성" />
      <HorizontalRail contentContainerStyle={styles.collegeRailContent} style={styles.collegeRail}>
        {colleges.map((college) => (
          <CategoryChip
            key={college.id}
            label={college.shortName}
            selected={selectedCollegeId === college.id}
            onPress={() => setSelectedCollegeId(college.id)}
          />
        ))}
      </HorizontalRail>

      <View style={styles.selectedCollegeCard}>
        <Text style={styles.selectedCollegeName}>{selectedCollege?.name}</Text>
        <Text style={styles.selectedCollegeMeta}>{selectedCollege?.campus}</Text>
      </View>

      <SectionHeader title="학과 / 전공 선택" caption="단과대 전체 또는 세부 학과를 함께 선택 가능" />
      <View style={styles.unitGrid}>
        <Pressable
          onPress={() => toggleUnit(selectedCollegeId)}
          style={[
            styles.unitCard,
            styles.collegeSelectCard,
            selectedIds.includes(selectedCollegeId) && styles.unitCardSelected,
          ]}>
          <Text
            style={[
              styles.unitName,
              selectedIds.includes(selectedCollegeId) && styles.unitNameSelected,
            ]}>
            {selectedCollege?.name} 전체
          </Text>
          <Text style={styles.unitKind}>단과대 전체 공지 포함</Text>
        </Pressable>
        {visibleUnits.map((unit) => {
          const selected = selectedIds.includes(unit.id);
          return (
            <Pressable
              key={unit.id}
              onPress={() => toggleUnit(unit.id)}
              style={[styles.unitCard, selected && styles.unitCardSelected]}>
              <Text style={[styles.unitName, selected && styles.unitNameSelected]}>
                {unit.name}
              </Text>
              <Text style={[styles.unitKind, selected && styles.unitKindSelected]}>
                {unit.kind === 'major' ? '융합전공' : '학과'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="키워드 알림" caption="쉼표로 구분해 등록" />
      <TextInput
        value={keywordText}
        onChangeText={setKeywordText}
        placeholder="장학금, 삼성전자, 인턴, 졸업"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <View style={styles.keywordRow}>
        {keywords.map((keyword) => (
          <View key={keyword} style={styles.keywordChip}>
            <Text style={styles.keywordText}>{keyword}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={startDemo} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>데모 앱 시작</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 14,
    paddingBottom: 18,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '900',
  },
  body: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  collegeRail: {
    marginHorizontal: -2,
    marginBottom: 10,
  },
  collegeRailContent: {
    paddingHorizontal: 2,
    paddingRight: 28,
  },
  selectedCollegeCard: {
    borderRadius: 8,
    backgroundColor: colors.secondary,
    padding: 13,
  },
  selectedCollegeName: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  selectedCollegeMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  unitGrid: {
    gap: 10,
  },
  unitCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 15,
  },
  collegeSelectCard: {
    borderStyle: 'dashed',
  },
  unitCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  unitName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  unitNameSelected: {
    color: colors.primary,
  },
  unitKind: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  unitKindSelected: {
    color: colors.primary,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  keywordChip: {
    borderRadius: 14,
    backgroundColor: colors.faint,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  keywordText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});
