type Tail<T extends any[]> = ((...args: T) => any) extends (
  arg: any,
  ...rest: infer U
) => any
  ? U
  : never;

export type ArgsWithoutConfig<F extends (...args: any[]) => any> = Tail<
  Parameters<F>
>;

export type FuncWithoutConfigArg<F extends (...args: any[]) => any> = (
  ...args: ArgsWithoutConfig<F>
) => ReturnType<F>;

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((i) => i[0])
    .join('') ?? '';

/**
 * there are edge cases in the Splid API where it will return multiple copies of the same entry, which is not desired.
 *
 * this function de-duplicates these entries by their `GlobalId`.
 */
export const dedupeByGlobalId = <T extends { GlobalId: string }>(
  entries: T[]
): T[] =>
  entries.filter((i, idx, arr) => {
    if (!i.GlobalId)
      throw new Error(
        `SplidClient.dedupeByGlobalId: item is missing "GlobalId" field`
      );

    return arr.findIndex((j) => j.GlobalId === i.GlobalId) === idx;
  });
