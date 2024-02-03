export interface SearchRequest {
    query: string;
    category: string | null;
    source: string | null;
    limit: number | null;
}