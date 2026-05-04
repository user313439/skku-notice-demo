import type { ClassifierResult, Notice } from '@/src/types';

export const classifierStatus: ClassifierResult = {
  modelName: 'KoBERT Notice Classifier Mock',
  version: 'demo-v0.1',
  averageConfidence: 0.89,
  fallbackRate: 0.08,
};

export function explainClassification(notice: Notice) {
  const percent = Math.round(notice.classificationConfidence * 100);
  if (notice.classificationConfidence >= 0.92) {
    return `분류 신뢰도 ${percent}%로 ${notice.category} 카테고리에 자동 배정되었습니다.`;
  }
  if (notice.classificationConfidence >= 0.84) {
    return `분류 신뢰도 ${percent}%입니다. 데모에서는 원문 태그와 함께 검토 가능한 상태로 표시합니다.`;
  }
  return `분류 신뢰도 ${percent}%로 낮아 관리자 검토 대상에 포함됩니다.`;
}
