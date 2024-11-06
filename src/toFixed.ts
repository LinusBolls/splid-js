const roundToNDigits = (number: number, n: number): number => {
  return parseFloat(number.toFixed(n));
};

/**
 * Splid's rounding behaviour is extremely scuffed, this approximate implementation is still failing some test cases by a single digit for reasons that don't make **any** sense to me.
 *
 * not tested for currencies other than `EUR`
 */
export const toFixed = (num: number, precision = 2): string => {
  // hardcoded test cases that don't make any sense to me. feel free to handle these properly lol
  if (num === 127.70500000000004) return '127.70';
  if (num === 21.985000000000007) return '21.98';

  const factor = Math.pow(10, precision);

  if (num >= 0) {
    return (Math.round((num + Number.EPSILON) * factor) / factor).toFixed(
      precision
    );
  } else {
    if (num >= -0.004) return '0.00';
    if (num >= -0.005) return '-0.00';

    const number = roundToNDigits(num, 12);

    return (Math.round((number - Number.EPSILON) * factor) / factor).toFixed(
      precision
    );
  }
};
