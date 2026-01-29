declare module "papaparse" {
  export interface ParseResult<T = unknown> {
    data: T[];
    errors: Array<{ type: string; code: string; message: string }>;
    meta: Record<string, unknown>;
  }

  export function parse<T = unknown>(
    input: string | File,
    config?: { header?: boolean; dynamicTyping?: boolean; skipEmptyLines?: boolean }
  ): ParseResult<T>;

  const Papa: {
    parse: typeof parse;
  };

  export default Papa;
}
