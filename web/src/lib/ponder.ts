import { Address } from "viem";
export type PonderResponse<T> = {
  data: T;
  errors: {
    message: string;
    locations: any[];
  }[];
};

export type Record = {
  id: number;
  message: string;
  msgHashSha256: string;
  msgAuthor: Address;
  msgRevealor: Address;
  msgHashSignature: string;
  bounty: string; // in ether
};

export const ponderUrl = "http://localhost:42069";

export async function getRecrodById(id: number) {
  const res = await fetch(ponderUrl, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          profile (id: "${id}") {
            id
            message
            msgHashSha256
            msgAuthor
            msgRevealor
            msgHashSignature
            bounty
          }
        }
      `,
    }),
  });

  const { data } = (await res.json()) as PonderResponse<{ record: Record }>;
  const { record } = data;

  return record;
}
