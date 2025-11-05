export interface SearchRequestDto {
  query: string;
  category: string | null;
  source: string | null;
  limit: number | null;
}
