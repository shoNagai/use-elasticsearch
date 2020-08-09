import { SearchRequest, SearchResponse } from "./typings";

const API_SEARCH = "_search";

const search = <T>(
  index: string,
  request: SearchRequest
): Promise<[SearchResponse<T>, null] | [null, Error]> => {
  return new Promise<SearchResponse<T>>((resolve, reject) => {
    fetch(`${process.env.ELASTICSEARCH_NODE_URL}/${index}/${API_SEARCH}`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          btoa(
            process.env.ELASTICSEARCH_USERNAME +
              ":" +
              process.env.ELASTICSEARCH_PASSWORD
          ),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          const cause = new Error(data.message);
          reject(cause);
          return;
        }
        resolve(data.results);
      });
  })
    .then((addresses) => {
      return [addresses, null] as [SearchResponse<T>, null];
    })
    .catch((e: Error) => {
      return [null, e] as [null, Error];
    });
};

const client = { search };

export default client;
