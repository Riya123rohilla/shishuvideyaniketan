const ROMAN_CLASS_MAP = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
};

const ANNUAL_FEE_BY_CLASS = {
  1: '13,100/-',
  2: '13,100/-',
  3: '14,550/-',
  4: '14,550/-',
  5: '14,550/-',
  6: '16,200/-',
  7: '16,200/-',
  8: '16,200/-',
  9: '21,400/-',
  10: '22,600/-',
  11: '24,000/-',
  12: '24,000/-',
};

const parseClassFromText = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const numericMatch = text.match(/(?:class|कक्षा)?\s*(\d{1,2})/i);
  if (numericMatch && numericMatch[1]) {
    const classNumber = Number(numericMatch[1]);
    if (classNumber >= 1 && classNumber <= 12) {
      return classNumber;
    }
  }

  const romanMatch = text.toUpperCase().match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/);
  if (romanMatch && romanMatch[1]) {
    return ROMAN_CLASS_MAP[romanMatch[1]] || null;
  }

  return null;
};

const getClassNumber = (course = {}) => {
  const candidates = [
    course.grade,
    course.gradeHi,
    course.title,
    course.titleHi,
    course.code,
  ];

  for (const candidate of candidates) {
    const classNumber = parseClassFromText(candidate);
    if (classNumber) {
      return classNumber;
    }
  }

  return null;
};

export const getDisplayAnnualFee = (course = {}, isHindi = false) => {
  const classNumber = getClassNumber(course);
  if (classNumber && ANNUAL_FEE_BY_CLASS[classNumber]) {
    return ANNUAL_FEE_BY_CLASS[classNumber];
  }

  if (isHindi) {
    return course.feeHi || course.fee || '';
  }

  return course.fee || course.feeHi || '';
};
