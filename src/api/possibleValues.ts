import { api } from "./client";

export type PossibleValuesField =
  | "genres.name"
  | "countries.name"
  | "type"
  | "typeNumber"
  | "status";

export interface PossibleValue {
  name: string | null;
  slug: string | null;
}

export async function fetchPossibleValues(field: PossibleValuesField): Promise<PossibleValue[]> {
  const { data } = await api.get<PossibleValue[]>("/v1/movie/possible-values-by-field", {
    params: { field },
  });
  return Array.isArray(data) ? data : [];
}
