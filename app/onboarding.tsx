import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { CategoryChip } from '@/src/components/CategoryChip';
import { HorizontalRail } from '@/src/components/HorizontalRail';
import { SectionHeader } from '@/src/components/SectionHeader';
import { suggestedKeywords } from '@/src/data/suggestedKeywords';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export default function OnboardingScreen() {
  const { academicUnits, colleges, preferences, completeOnboarding } = useAppState();
  const [selectedCollegeId, setSelectedCollegeId] = useState('college-sw');
  const [profileName, setProfileName] = useState(preferences.profileName);
  const [profileStudentId, setProfileStudentId] = useState(preferences.profileStudentId);
  const [profileEmail, setProfileEmail] = useState(preferences.profileEmail);
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notificationsEnabled);
  const [selectedIds, setSelectedIds] = useState(preferences.selectedUnitIds);
  const [keywordText, setKeywordText] = useState(preferences.keywords.join(', '));

  useEffect(() => {
    setProfileName(preferences.profileName);
    setProfileStudentId(preferences.profileStudentId);
    setProfileEmail(preferences.profileEmail);
    setNotificationsEnabled(preferences.notificationsEnabled);
    setSelectedIds(preferences.selectedUnitIds);
    setKeywordText(preferences.keywords.join(', '));
  }, [
    preferences.profileName,
    preferences.profileStudentId,
    preferences.profileEmail,
    preferences.notificationsEnabled,
    preferences.selectedUnitIds,
    preferences.keywords,
  ]);

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
  const keywordSet = useMemo(() => new Set(keywords), [keywords]);

  const toggleUnit = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleKeyword = (keyword: string) => {
    const nextKeywords = keywordSet.has(keyword)
      ? keywords.filter((item) => item !== keyword)
      : [...keywords, keyword];
    setKeywordText(nextKeywords.join(', '));
  };

  const startDemo = () => {
    completeOnboarding(selectedIds.length ? selectedIds : preferences.selectedUnitIds, keywords, {
      profileName: profileName.trim() || '성균관대 데모 학생',
      profileStudentId: profileStudentId.trim() || '2026310000',
      profileEmail: profileEmail.trim() || 'demo.student@skku.edu',
      notificationsEnabled,
    });
    router.replace('/home');
  };

  return (
    <AppShell>
      <View style={styles.hero}>
        <Text style={styles.kicker}>SKKU Notice Aggregator</Text>
        <Text style={styles.title}>성균 공지 통합 알림 서비스</Text>
        <Text style={styles.body}>
          사용자 정보를 입력하고 홈 피드와 알림을 받을 단과대학, 학과, 키워드를 설정합니다.
        </Text>
      </View>

      <SectionHeader title="사용자 정보" caption="데모용 회원가입 정보" />
      <View style={styles.formGroup}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            value={profileName}
            onChangeText={setProfileName}
            placeholder="성균관대 데모 학생"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>학번</Text>
          <TextInput
            value={profileStudentId}
            onChangeText={setProfileStudentId}
            placeholder="2026310000"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>이메일</Text>
          <TextInput
            value={profileEmail}
            onChangeText={setProfileEmail}
            placeholder="demo.student@skku.edu"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
      </View>

      <SectionHeader title="피드 / 알림 단과대학 선택" caption="공식 대학·학과 구조를 기반으로 구성" />
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

      <SectionHeader title="알림 받을 학과 / 전공 선택" caption="홈 피드와 신규 공지 알림 범위에 함께 반영" />
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

      <View style={styles.notificationScopeCard}>
        <View style={styles.notificationIconCircle}>
          <Ionicons
            name={notificationsEnabled ? 'notifications' : 'notifications-off'}
            size={22}
            color={colors.primary}
          />
        </View>
        <View style={styles.notificationScopeText}>
          <Text style={styles.notificationScopeTitle}>선택한 단위 알림 받기</Text>
          <Text style={styles.notificationScopeBody}>
            선택한 {selectedIds.length || preferences.selectedUnitIds.length}개 단과대/학과의 신규 공지,
            키워드 매칭, 마감 임박 알림을 표시합니다.
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#D1D5DB', true: colors.secondary }}
          thumbColor={notificationsEnabled ? colors.primary : '#F9FAFB'}
        />
      </View>

      <SectionHeader title="키워드 알림" caption="선택한 단위 안에서 쉼표로 구분해 등록" />
      <TextInput
        value={keywordText}
        onChangeText={setKeywordText}
        placeholder="장학금, 삼성전자, 인턴, 졸업"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <View style={styles.suggestedKeywordBlock}>
        <Text style={styles.suggestedKeywordTitle}>추천 키워드</Text>
        <View style={styles.suggestedKeywordGrid}>
          {suggestedKeywords.map((keyword) => {
            const selected = keywordSet.has(keyword);
            return (
              <Pressable
                key={keyword}
                onPress={() => toggleKeyword(keyword)}
                style={[
                  styles.suggestedKeywordChip,
                  selected && styles.suggestedKeywordChipSelected,
                ]}>
                <Text
                  style={[
                    styles.suggestedKeywordText,
                    selected && styles.suggestedKeywordTextSelected,
                  ]}>
                  {keyword}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
  formGroup: {
    gap: 10,
    marginBottom: 4,
  },
  inputBlock: {
    gap: 6,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
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
  notificationScopeCard: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: colors.primaryDark,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  notificationIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationScopeText: {
    flex: 1,
  },
  notificationScopeTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  notificationScopeBody: {
    color: '#CFE1D7',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
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
  suggestedKeywordBlock: {
    marginTop: 12,
  },
  suggestedKeywordTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  suggestedKeywordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedKeywordChip: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  suggestedKeywordChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  suggestedKeywordText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  suggestedKeywordTextSelected: {
    color: colors.primary,
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
