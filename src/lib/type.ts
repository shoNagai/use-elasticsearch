export type QueryType = "must" | "filter" | "should" | "must_not";

export type QueryClauses = "match" | "term" | "range";

export type QueryContext = { [field: string]: string };

export type Query = {
  bool: {
    [key in QueryType]?: { [key in QueryClauses]?: QueryContext }[];
  };
};

export interface SearchRequest {
  docvalue_fields?: string | string[];
  explain?: boolean;
  from?: number;
  query?: Query;
  seq_no_primary_term?: boolean;
  size?: number;
  _source?: string | string[];
  terminate_after?: number;
  timeout?: string;
  version?: boolean;
}

export interface Hit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: "eq" | "gte";
    };
    max_score: number;
    hits: Hit<T>[];
  };
}
