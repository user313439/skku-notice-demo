import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell } from '@/src/components/AppShell';
import { SectionHeader } from '@/src/components/SectionHeader';
import { useAppState } from '@/src/state/AppStateProvider';
import { colors } from '@/src/theme/colors';

export default function ProfileScreen() {
  const {
    academicUnits,
    preferences,
    selectedUnitNames,
    notifications,
    bookmarks,
    updateProfile,
    resetDemoState,
  } = useAppState();
  const [editing, setEditing] = useState(false);
  const [profileName, setProfileName] = useState(preferences.profileName);
  const [profileStudentId, setProfileStudentId] = useState(preferences.profileStudentId);
  const [profileEmail, setProfileEmail] = useState(preferences.profileEmail);

  useEffect(() => {
    setProfileName(preferences.profileName);
    setProfileStudentId(preferences.profileStudentId);
    setProfileEmail(preferences.profileEmail);
  }, [preferences.profileName, preferences.profileStudentId, preferences.profileEmail]);

  const selectedShortNames = academicUnits
    .filter((unit) => preferences.selectedUnitIds.includes(unit.id))
    .map((unit) => unit.shortName);

  const saveProfile = () => {
    updateProfile({
      profileName: profileName.trim() || '성균관대 데모 학생',
      profileStudentId: profileStudentId.trim() || '2026310000',
      profileEmail: profileEmail.trim() || 'demo.student@skku.edu',
    });
    setEditing(false);
  };

  return (
    <AppShell>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{preferences.profileName.slice(0, 2)}</Text>
        </View>
        <View style={styles.profileTextBlock}>
          {editing ? (
            <>
              <TextInput value={profileName} onChangeText={setProfileName} style={styles.profileInput} />
              <TextInput
                value={profileStudentId}
                onChangeText={setProfileStudentId}
                style={styles.profileInput}
                keyboardType="number-pad"
              />
              <TextInput
                value={profileEmail}
                onChangeText={setProfileEmail}
                style={styles.profileInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{preferences.profileName}</Text>
              <Text style={styles.meta}>{preferences.profileStudentId} · {preferences.profileEmail}</Text>
              <Text style={styles.meta}>{selectedUnitNames[0] ?? '관심 학과 미설정'}</Text>
            </>
          )}
        </View>
        <Pressable onPress={editing ? saveProfile : () => setEditing(true)} style={styles.editButton}>
          <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.metricRow}>
        <Pressable onPress={() => router.push('/bookmarks')} style={styles.metricCard}>
          <Text style={styles.metricValue}>{bookmarks.length}</Text>
          <Text style={styles.metricLabel}>저장한 공지</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/notifications')} style={styles.metricCard}>
          <Text style={styles.metricValue}>{notifications.filter((item) => !item.read).length}</Text>
          <Text style={styles.metricLabel}>안 읽은 알림</Text>
        </Pressable>
      </View>

      <SectionHeader title="구독 단과대 / 학과" />
      <View style={styles.chipRow}>
        {selectedShortNames.map((name) => (
          <View key={name} style={styles.chip}>
            <Text style={styles.chipText}>{name}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="관심 키워드" />
      <View style={styles.chipRow}>
        {preferences.keywords.map((keyword) => (
          <View key={keyword} style={styles.keywordChip}>
            <Text style={styles.keywordText}>{keyword}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={() => router.push('/settings')} style={styles.linkRow}>
        <Ionicons name="settings-outline" size={21} color={colors.primary} />
        <Text style={styles.linkText}>관심 학과 / 키워드 설정</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
      <Pressable
        onPress={() => {
          resetDemoState();
          router.replace('/onboarding');
        }}
        style={styles.linkRow}>
        <Ionicons name="refresh-circle-outline" size={21} color={colors.primary} />
        <Text style={styles.linkText}>데모 처음 상태로 초기화</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
      <Pressable onPress={() => router.push('/system-status')} style={styles.linkRow}>
        <Ionicons name="analytics-outline" size={21} color={colors.primary} />
        <Text style={styles.linkText}>System Status / Debug</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>앱 정보</Text>
        <Text style={styles.infoBody}>
          성균 공지 통합 알림 서비스 데모 v0.2. 공식 공지 기반 목 데이터, 로컬 저장, 목 크롤러/분류기 상태를 포함합니다.
        </Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginTop: 8,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  profileTextBlock: {
    flex: 1,
    gap: 7,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  profileInput: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    padding: 14,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 14,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  keywordChip: {
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
  linkRow: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  infoCard: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
    padding: 15,
  },
  infoTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  infoBody: {
    color: '#CFE1D7',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
});
