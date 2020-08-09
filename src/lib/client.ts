import { SearchRequest, SearchResponse } from "./type";

const API_SEARCH = "_search";

const search = <T>(
  index: string,
  request?: SearchRequest
): Promise<SearchResponse<T> | Error> => {
  return new Promise<SearchResponse<T>>((resolve, reject) => {
    const url = `${process.env.ELASTICSEARCH_NODE_URL}/${index}/${API_SEARCH}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          btoa(
            process.env.ELASTICSEARCH_USERNAME +
              ":" +
              process.env.ELASTICSEARCH_PASSWORD
          ),
        "Content-Type": "application/json",
      },
      body: request ? JSON.stringify(request) : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          const cause = new Error(data.message);
          reject(cause);
          return;
        }
        return resolve(data.results);
      })
      .catch((e: Error) => {
        return reject(e);
      });
  })
    .then((response) => {
      return response as SearchResponse<T>;
    })
    .catch((e: Error) => {
      return e;
    });
};

const client = { search };

export default client;
