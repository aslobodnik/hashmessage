import { ponder } from "@/generated";

ponder.on("ExampleContract:RecordAdded", async ({ event, context }) => {
  const db = context.db.Record;

  await db.create({
    id: event.transaction.hash,
    data: {
      message: "",
      msgHashSha256: event.args.msgHashSha256,
      msgAuthor: event.args.msgAuthor,
      msgRevealor: "0x",
      msgHashSignature: event.args.msgHashSignature,
    },
  });
});

ponder.on("ExampleContract:RevealMsg", async ({ event, context }) => {
  const db = context.db.Record;

  await db.update({
    id: event.transaction.hash,
    data: {
      message: event.args.message,
      //msgHashSha256: event.args.msgHashSha256,
      //msgAuthor: event.args.msgAuthor,
      msgRevealor: event.args.msgRevealor,
      //msgHashSignature: event.args.msgHashSignature,
    },
  });
});
