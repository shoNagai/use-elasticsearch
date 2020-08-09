import * as React from "react";
import client from "./client";
import { Hit, SearchRequest } from "./type";

const { useEffect, useReducer } = React;

type Status = "init" | "loading" | "loaded" | "error";
type State<T> = {
  status: Status;
  data: Hit<T>[];
  error: Error | null;
};

type Action<T> =
  | {
      type: "setStatus";
      status: Status;
    }
  | {
      type: "setData";
      data: Hit<T>[];
    }
  | {
      type: "setError";
      error: Error;
    };

const createReducer = <T>() => (
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case "setStatus":
      return {
        ...state,
        status: action.status,
      };
    case "setData":
      return {
        ...state,
        data: action.data,
        status: "loaded",
      };
    case "setError":
      return {
        ...state,
        status: "error",
        error: action.error,
      };
    default:
      return state;
  }
};

function useElasticsearch<T>(index: string, requestBody?: SearchRequest) {
  const dataFetchReducer = createReducer<T>();
  const [state, dispatch] = useReducer(dataFetchReducer, {
    status: "init",
    data: [],
    error: null,
  });

  useEffect(() => {
    dispatch({
      type: "setStatus",
      status: "loading",
    });
    (async () => {
      const response = await client
        .search<T>(index, requestBody)
        .catch((e: Error) => {
          const cause = new Error("response is null");
          dispatch({
            type: "setError",
            error: e || cause,
          });
          return cause;
        });
      if (response instanceof Error) {
        dispatch({
          type: "setError",
          error: response,
        });
        return;
      }
      dispatch({
        type: "setData",
        data: response.hits.hits,
      });
    })();
  }, [index, requestBody]);

  return state;
}

export default useElasticsearch;
