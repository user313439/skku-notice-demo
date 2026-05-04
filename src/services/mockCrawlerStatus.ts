import type { CrawlerSourceStatus } from '@/src/types';
import { addDays } from '@/src/utils/dateUtils';

export const mockCrawlerStatuses: CrawlerSourceStatus[] = [
  {
    id: 'crawler-sw-college',
    sourceName: '소프트웨어융합대학 공지',
    lastCrawlTime: `${addDays(0)} 09:20`,
    status: 'active',
    fetchedCount: 42,
    insertedCount: 8,
  },
  {
    id: 'crawler-sw-dept',
    sourceName: '소프트웨어학과 공지',
    lastCrawlTime: `${addDays(0)} 09:18`,
    status: 'active',
    fetchedCount: 38,
    insertedCount: 11,
  },
  {
    id: 'crawler-ai',
    sourceName: '인공지능융합전공 공지',
    lastCrawlTime: `${addDays(0)} 08:52`,
    status: 'degraded',
    fetchedCount: 19,
    insertedCount: 4,
  },
  {
    id: 'crawler-business',
    sourceName: '경영대학 취업공지',
    lastCrawlTime: `${addDays(-1)} 22:10`,
    status: 'failed',
    fetchedCount: 0,
    insertedCount: 0,
  },
];
