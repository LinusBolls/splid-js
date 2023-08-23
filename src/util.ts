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
