import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Record: p.createTable({
    id: p.bigint(),
    message: p.string(),
    msgHashSha256: p.string(),
    msgAuthor: p.bytes(),
    msgRevealor: p.bytes(),
    msgHashSignature: p.bytes(),
    bounty: p.bigint(),
    bountyClaimed: p.boolean(),
    block: p.bigint(),
  }),
}));
