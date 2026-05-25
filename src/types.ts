export type AcademicUnitKind = 'college' | 'department' | 'major';

export type NoticeCategory =
  | '전체'
  | '학사'
  | '장학'
  | '취업'
  | '행사/세미나'
  | '모집'
  | '일반';

export type DeadlineStatus = 'upcoming' | 'today' | 'closed' | 'always' | 'none';

export type ReminderOption = 'none' | '1d' | '3d' | '7d';

export type NotificationType = 'new_notice' | 'keyword_match' | 'deadline_reminder' | 'system';

export interface AcademicUnit {
  id: string;
  name: string;
  shortName: string;
  kind: AcademicUnitKind;
  collegeId?: string;
}

export interface AcademicCollege {
  id: string;
  name: string;
  shortName: string;
  campus: '인문사회과학캠퍼스' | '자연과학캠퍼스' | '의학캠퍼스';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  sourceUnit: string;
  sourceBoard: string;
  category: Exclude<NoticeCategory, '전체'>;
  publishedAt: string;
  rawDeadlineText: string;
  deadlineAt: string | null;
  originalUrl: string;
  isImportant: boolean;
  classificationConfidence: number;
  tags: string[];
  summary?: string;
  attachmentTitle?: string;
  attachmentDescription?: string;
}

export interface UserPreference {
  profileName: string;
  profileStudentId: string;
  profileEmail: string;
  selectedUnitIds: string[];
  keywords: string[];
  notificationsEnabled: boolean;
  hasOnboarded: boolean;
}

export interface BookmarkSetting {
  noticeId: string;
  reminderOption: ReminderOption;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  noticeId?: string;
  createdAt: string;
  read: boolean;
}

export interface CrawlerSourceStatus {
  id: string;
  sourceName: string;
  lastCrawlTime: string;
  status: 'active' | 'degraded' | 'failed';
  fetchedCount: number;
  insertedCount: number;
}

export interface ClassifierResult {
  modelName: string;
  version: string;
  averageConfidence: number;
  fallbackRate: number;
}

export interface NoticeFilter {
  query?: string;
  category?: NoticeCategory;
  unitName?: string;
  readStatus?: 'all' | 'read' | 'unread';
  bookmarkOnly?: boolean;
  bookmarkStatus?: 'all' | 'bookmarked' | 'notBookmarked';
  deadlineStatus?: 'all' | DeadlineStatus;
}
