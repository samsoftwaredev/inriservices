import type { PostgrestError } from "@supabase/supabase-js";

export const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

export function assertOk<T>(res: { data: T | null; error: PostgrestError | null }, msg?: string): T {
  if (res.error) throw res.error;
  if (res.data == null) throw new Error(msg ?? "No data returned");
  return res.data;
}
