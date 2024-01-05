import { Record, PonderResponse, ponderUrl } from "@/lib/ponder";
import { useState } from "react";
import { useFetch } from "usehooks-ts";

// Key is used to trigger a re-fetch
export function usePonder() {
  //export function usePonder(start: number = 0, owner?: string) {
  //const [skip, setSkip] = useState(start);
  const [cacheKey, setCacheKey] = useState("");

  const graphQlQuery = `
  query RecordsQuery($first: Int!) {
    records (orderBy: "id", orderDirection: "desc", first: $first) {
        id
        message
        msgHashSha256
        msgAuthor
        msgRevealor
        msgHashSignature
        bounty
        originalBounty
        
    }
  }
`;

  const variables = {
    first: 1000, // set the value of 'first' here
    // skip: start,
    // owner: owner,
  };

  const { data, error } = useFetch<PonderResponse<{ records: Record[] }>>(
    ponderUrl + "?key=" + cacheKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: graphQlQuery,
        variables: variables, // include the variables in the request
      }),
    }
  );

  function refetch() {
    setCacheKey(Date.now().toString());
  }

  return {
    records: data?.data?.records,
    error,
    isLoading: !data && !error,
    refetch,
  };
}
