const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const incrementSegment = (segment: string): string => {
  let carry = 1;
  let result = '';
  for (let i = segment.length - 1; i >= 0; i--) {
    if (carry === 0) {
      result = segment[i] + result;
      continue;
    }
    const index = characters.indexOf(segment[i]) + carry;
    result = characters[index % characters.length] + result;
    carry = Math.floor(index / characters.length);
  }
  return result;
};

export const generateInviteCodes = (amount: number, skip = 0): string[] => {
  let segment1 = 'AAA';
  let segment2 = 'AAA';
  let segment3 = 'AAA';
  const codes: string[] = [];

  // Skip the initial codes
  for (let i = 0; i < skip; i++) {
    segment3 = incrementSegment(segment3);
    if (segment3 === 'AAA') {
      segment2 = incrementSegment(segment2);
      if (segment2 === 'AAA') {
        segment1 = incrementSegment(segment1);
      }
    }
  }

  for (let i = 0; i < amount; i++) {
    const code = `${segment1}${segment2}${segment3}`;
    codes.push(code);

    // Increment segments
    segment3 = incrementSegment(segment3);
    if (segment3 === 'AAA') {
      segment2 = incrementSegment(segment2);
      if (segment2 === 'AAA') {
        segment1 = incrementSegment(segment1);
      }
    }
  }

  return codes;
};
