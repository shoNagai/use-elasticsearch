import * as React from "react";
import client from "./client";
import { Hit, SearchRequest } from "./typings";

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

const useElasticsearch = <T>(index: string, requestBody: SearchRequest) => {
  const reducer = createReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    status: "init",
    data: [],
    error: null,
  });

  useEffect(() => {
    dispatch({
      type: "setStatus",
      status: "loading",
    });
    client.search<T>(index, requestBody).then(([response, error]) => {
      if (error || !response) {
        dispatch({
          type: "setError",
          error: error || new Error("response is null"),
        });
        return;
      }
      dispatch({
        type: "setData",
        data: response.hits.hits,
      });
    });
  }, []);

  return state;
};

export default useElasticsearch;
