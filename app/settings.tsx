import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { SectionHeader } from '@/src/components/SectionHeader';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export default function SettingsScreen() {
  const {
    academicUnits,
    colleges,
    hydrated,
    preferences,
    setSelectedUnitIds,
    addKeyword,
    removeKeyword,
    toggleNotifications,
  } = useAppState();
  const initialCollegeId = useMemo(() => {
    const firstSelectedUnit = academicUnits.find((unit) =>
      preferences.selectedUnitIds.includes(unit.id),
    );

    if (firstSelectedUnit?.kind === 'college') {
      return firstSelectedUnit.id;
    }

    return firstSelectedUnit?.collegeId ?? 'college-sw';
  }, [academicUnits, preferences.selectedUnitIds]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(initialCollegeId);
  const didSyncInitialCollege = useRef(false);

  useEffect(() => {
    if (!didSyncInitialCollege.current && hydrated) {
      setSelectedCollegeId(initialCollegeId);
      didSyncInitialCollege.current = true;
    }
  }, [hydrated, initialCollegeId]);
  const [keyword, setKeyword] = useState('');

  const visibleUnits = useMemo(
    () => academicUnits.filter((unit) => unit.collegeId === selectedCollegeId),
    [academicUnits, selectedCollegeId],
  );
  const selectedCollege = colleges.find((college) => college.id === selectedCollegeId);

  const toggleUnit = (id: string) => {
    const next = preferences.selectedUnitIds.includes(id)
      ? preferences.selectedUnitIds.filter((item) => item !== id)
      : [...preferences.selectedUnitIds, id];
    setSelectedUnitIds(next.length ? next : preferences.selectedUnitIds);
  };

  const submitKeyword = () => {
    addKeyword(keyword);
    setKeyword('');
  };

  return (
    <AppShell>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={21} color={colors.text} />
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <Text style={styles.title}>설정</Text>
      </View>

      <SectionHeader title="구독 단과대 / 학과" caption="선택 변경 즉시 홈 피드에 반영" />
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

      <View style={styles.unitGrid}>
        <Pressable
          onPress={() => toggleUnit(selectedCollegeId)}
          style={[
            styles.unitCard,
            styles.collegeSelectCard,
            preferences.selectedUnitIds.includes(selectedCollegeId) && styles.unitCardSelected,
          ]}>
          <Text
            style={[
              styles.unitName,
              preferences.selectedUnitIds.includes(selectedCollegeId) && styles.unitNameSelected,
            ]}>
            {selectedCollege?.name} 전체
          </Text>
          <Text style={styles.unitCaption}>{selectedCollege?.campus}</Text>
        </Pressable>
        {visibleUnits.map((unit) => {
          const selected = preferences.selectedUnitIds.includes(unit.id);
          return (
            <Pressable
              key={unit.id}
              onPress={() => toggleUnit(unit.id)}
              style={[styles.unitCard, selected && styles.unitCardSelected]}>
              <Text style={[styles.unitName, selected && styles.unitNameSelected]}>
                {unit.name}
              </Text>
              <Text style={styles.unitCaption}>{unit.shortName}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="키워드 알림" />
      <View style={styles.keywordInputRow}>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="키워드 추가"
          placeholderTextColor={colors.textMuted}
          style={styles.keywordInput}
        />
        <Pressable onPress={submitKeyword} style={styles.addButton}>
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>
      <View style={styles.keywordRow}>
        {preferences.keywords.map((item) => (
          <Pressable key={item} onPress={() => removeKeyword(item)} style={styles.keywordChip}>
            <Text style={styles.keywordText}>{item}</Text>
            <Ionicons name="close" size={14} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingTitle}>알림 사용</Text>
          <Text style={styles.settingCaption}>목 푸시 알림 상태</Text>
        </View>
        <Switch
          value={preferences.notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#D1D5DB', true: colors.secondary }}
          thumbColor={preferences.notificationsEnabled ? colors.primary : '#F9FAFB'}
        />
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
  collegeRail: {
    marginHorizontal: -2,
    marginBottom: 12,
  },
  collegeRailContent: {
    paddingHorizontal: 2,
    paddingRight: 28,
  },
  unitGrid: {
    gap: 10,
  },
  unitCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
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
  unitCaption: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  keywordInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keywordInput: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 14,
    backgroundColor: colors.faint,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  keywordText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  settingRow: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  settingCaption: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
