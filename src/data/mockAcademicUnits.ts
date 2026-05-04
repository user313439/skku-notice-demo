import type { AcademicCollege, AcademicUnit } from '@/src/types';

export const mockColleges: AcademicCollege[] = [
  { id: 'college-confucian', name: '유학대학', shortName: '유학', campus: '인문사회과학캠퍼스' },
  { id: 'college-liberal', name: '문과대학', shortName: '문과', campus: '인문사회과학캠퍼스' },
  { id: 'college-social', name: '사회과학대학', shortName: '사회과학', campus: '인문사회과학캠퍼스' },
  { id: 'college-econ', name: '경제대학', shortName: '경제', campus: '인문사회과학캠퍼스' },
  { id: 'college-business', name: '경영대학', shortName: '경영', campus: '인문사회과학캠퍼스' },
  { id: 'college-education', name: '사범대학', shortName: '사범', campus: '인문사회과학캠퍼스' },
  { id: 'college-art', name: '예술대학', shortName: '예술', campus: '인문사회과학캠퍼스' },
  { id: 'college-nature', name: '자연과학대학', shortName: '자연과학', campus: '자연과학캠퍼스' },
  { id: 'college-ice', name: '정보통신대학', shortName: '정보통신', campus: '자연과학캠퍼스' },
  { id: 'college-sw', name: '소프트웨어융합대학', shortName: '소융대', campus: '자연과학캠퍼스' },
  { id: 'college-engineering', name: '공과대학', shortName: '공과', campus: '자연과학캠퍼스' },
  { id: 'college-pharmacy', name: '약학대학', shortName: '약학', campus: '자연과학캠퍼스' },
  { id: 'college-biotech', name: '생명공학대학', shortName: '생명공학', campus: '자연과학캠퍼스' },
  { id: 'college-sport', name: '스포츠과학대학', shortName: '스포츠과학', campus: '자연과학캠퍼스' },
  { id: 'college-medicine', name: '의과대학', shortName: '의과', campus: '의학캠퍼스' },
];

const collegeUnits: AcademicUnit[] = mockColleges.map((college) => ({
  id: college.id,
  name: college.name,
  shortName: college.shortName,
  kind: 'college',
}));

const departmentUnits: AcademicUnit[] = [
  { id: 'dept-confucian', collegeId: 'college-confucian', name: '유학·동양학과', shortName: '유학동양', kind: 'department' },

  { id: 'dept-korean', collegeId: 'college-liberal', name: '국어국문학과', shortName: '국문', kind: 'department' },
  { id: 'dept-english', collegeId: 'college-liberal', name: '영어영문학과', shortName: '영문', kind: 'department' },
  { id: 'dept-french', collegeId: 'college-liberal', name: '프랑스어문학과', shortName: '프랑스어문', kind: 'department' },
  { id: 'dept-chinese', collegeId: 'college-liberal', name: '중어중문학과', shortName: '중문', kind: 'department' },
  { id: 'dept-german', collegeId: 'college-liberal', name: '독어독문학과', shortName: '독문', kind: 'department' },
  { id: 'dept-russian', collegeId: 'college-liberal', name: '러시아어문학과', shortName: '러시아어문', kind: 'department' },
  { id: 'dept-hanmun', collegeId: 'college-liberal', name: '한문학과', shortName: '한문', kind: 'department' },
  { id: 'dept-history', collegeId: 'college-liberal', name: '사학과', shortName: '사학', kind: 'department' },
  { id: 'dept-philosophy', collegeId: 'college-liberal', name: '철학과', shortName: '철학', kind: 'department' },
  { id: 'dept-library', collegeId: 'college-liberal', name: '문헌정보학과', shortName: '문헌정보', kind: 'department' },

  { id: 'dept-public-admin', collegeId: 'college-social', name: '행정학과', shortName: '행정', kind: 'department' },
  { id: 'dept-politics', collegeId: 'college-social', name: '정치외교학과', shortName: '정외', kind: 'department' },
  { id: 'dept-media', collegeId: 'college-social', name: '미디어커뮤니케이션학과', shortName: '미컴', kind: 'department' },
  { id: 'dept-sociology', collegeId: 'college-social', name: '사회학과', shortName: '사회', kind: 'department' },
  { id: 'dept-social-welfare', collegeId: 'college-social', name: '사회복지학과', shortName: '사회복지', kind: 'department' },
  { id: 'dept-psychology', collegeId: 'college-social', name: '심리학과', shortName: '심리', kind: 'department' },
  { id: 'dept-consumer', collegeId: 'college-social', name: '소비자학과', shortName: '소비자', kind: 'department' },
  { id: 'dept-child', collegeId: 'college-social', name: '아동·청소년학과', shortName: '아동청소년', kind: 'department' },
  { id: 'dept-global-leader', collegeId: 'college-social', name: '글로벌리더학부', shortName: '글로벌리더', kind: 'department' },

  { id: 'dept-economics', collegeId: 'college-econ', name: '경제학과', shortName: '경제', kind: 'department' },
  { id: 'dept-statistics', collegeId: 'college-econ', name: '통계학과', shortName: '통계', kind: 'department' },
  { id: 'dept-global-econ', collegeId: 'college-econ', name: '글로벌경제학과', shortName: '글로벌경제', kind: 'department' },

  { id: 'dept-business', collegeId: 'college-business', name: '경영학과', shortName: '경영', kind: 'department' },
  { id: 'dept-global-business', collegeId: 'college-business', name: '글로벌경영학과', shortName: '글로벌경영', kind: 'department' },

  { id: 'dept-education', collegeId: 'college-education', name: '교육학과', shortName: '교육', kind: 'department' },
  { id: 'dept-hanmun-edu', collegeId: 'college-education', name: '한문교육과', shortName: '한문교육', kind: 'department' },
  { id: 'dept-math-edu', collegeId: 'college-education', name: '수학교육과', shortName: '수학교육', kind: 'department' },
  { id: 'dept-computer-edu', collegeId: 'college-education', name: '컴퓨터교육과', shortName: '컴교', kind: 'department' },

  { id: 'dept-fine-art', collegeId: 'college-art', name: '미술학과', shortName: '미술', kind: 'department' },
  { id: 'dept-design', collegeId: 'college-art', name: '디자인학과', shortName: '디자인', kind: 'department' },
  { id: 'dept-dance', collegeId: 'college-art', name: '무용학과', shortName: '무용', kind: 'department' },
  { id: 'dept-film', collegeId: 'college-art', name: '영상학과', shortName: '영상', kind: 'department' },
  { id: 'dept-acting', collegeId: 'college-art', name: '연기예술학과', shortName: '연기예술', kind: 'department' },
  { id: 'dept-fashion', collegeId: 'college-art', name: '의상학과', shortName: '의상', kind: 'department' },

  { id: 'dept-biology', collegeId: 'college-nature', name: '생명과학과', shortName: '생명과학', kind: 'department' },
  { id: 'dept-math', collegeId: 'college-nature', name: '수학과', shortName: '수학', kind: 'department' },
  { id: 'dept-physics', collegeId: 'college-nature', name: '물리학과', shortName: '물리', kind: 'department' },
  { id: 'dept-chemistry', collegeId: 'college-nature', name: '화학과', shortName: '화학', kind: 'department' },

  { id: 'dept-ee', collegeId: 'college-ice', name: '전자전기공학부', shortName: '전자전기', kind: 'department' },
  { id: 'dept-semiconductor-system', collegeId: 'college-ice', name: '반도체시스템공학과', shortName: '반도체시스템', kind: 'department' },

  { id: 'dept-sw', collegeId: 'college-sw', name: '소프트웨어학과', shortName: '소프트웨어', kind: 'department' },
  { id: 'dept-intelligent-sw', collegeId: 'college-sw', name: '지능형소프트웨어학과', shortName: '지능형SW', kind: 'department' },
  { id: 'dept-global-convergence', collegeId: 'college-sw', name: '글로벌융합학부', shortName: '글로벌융합', kind: 'department' },
  { id: 'major-ai', collegeId: 'college-sw', name: '인공지능융합전공', shortName: 'AI융합', kind: 'major' },
  { id: 'major-ds', collegeId: 'college-sw', name: '데이터사이언스융합전공', shortName: '데이터사이언스', kind: 'major' },
  { id: 'major-culture-tech', collegeId: 'college-sw', name: '컬처앤테크놀로지융합전공', shortName: '컬처테크', kind: 'major' },

  { id: 'dept-chemical-engineering', collegeId: 'college-engineering', name: '화학공학/고분자공학부', shortName: '화공고분자', kind: 'department' },
  { id: 'dept-materials', collegeId: 'college-engineering', name: '신소재공학부', shortName: '신소재', kind: 'department' },
  { id: 'dept-mechanical', collegeId: 'college-engineering', name: '기계공학부', shortName: '기계', kind: 'department' },
  { id: 'dept-civil', collegeId: 'college-engineering', name: '건설환경공학부', shortName: '건설환경', kind: 'department' },
  { id: 'dept-system-management', collegeId: 'college-engineering', name: '시스템경영공학과', shortName: '시스템경영', kind: 'department' },
  { id: 'dept-nano', collegeId: 'college-engineering', name: '나노공학과', shortName: '나노', kind: 'department' },
  { id: 'dept-architecture', collegeId: 'college-engineering', name: '건축학과', shortName: '건축', kind: 'department' },
  { id: 'dept-gbme', collegeId: 'college-engineering', name: '글로벌바이오메디컬공학과', shortName: 'GBME', kind: 'department' },
  { id: 'dept-semiconductor-convergence', collegeId: 'college-engineering', name: '반도체융합공학과', shortName: '반도체융합', kind: 'department' },

  { id: 'dept-pharmacy', collegeId: 'college-pharmacy', name: '약학과', shortName: '약학', kind: 'department' },

  { id: 'dept-food-biotech', collegeId: 'college-biotech', name: '식품생명공학과', shortName: '식품생명', kind: 'department' },
  { id: 'dept-biomechatronics', collegeId: 'college-biotech', name: '바이오메카트로닉스학과', shortName: '바이오메카', kind: 'department' },
  { id: 'dept-integrative-biotech', collegeId: 'college-biotech', name: '융합생명공학과', shortName: '융합생명', kind: 'department' },

  { id: 'dept-sport', collegeId: 'college-sport', name: '스포츠과학과', shortName: '스포츠과학', kind: 'department' },

  { id: 'dept-premed', collegeId: 'college-medicine', name: '의예과', shortName: '의예', kind: 'department' },
  { id: 'dept-medicine', collegeId: 'college-medicine', name: '의학과', shortName: '의학', kind: 'department' },
];

export const mockAcademicUnits: AcademicUnit[] = [...collegeUnits, ...departmentUnits];

export const defaultAcademicUnitIds = ['college-sw', 'dept-sw', 'major-ai', 'major-ds'];
