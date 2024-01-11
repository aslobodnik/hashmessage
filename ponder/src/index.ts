import { ponder } from "@/generated";

ponder.on("ExampleContract:RecordAdded", async ({ event, context }) => {
  const db = context.db.Record;

  await db.create({
    id: event.args.id,
    data: {
      message: "",
      msgHashSha256: event.args.msgHashSha256,
      msgAuthor: event.args.msgAuthor,
      msgRevealor: "0x",
      msgHashSignature: event.args.msgHashSignature,
      bounty: event.args.bounty,
      bountyClaimed: false,
      block: event.block.number,
    },
  });
});

ponder.on(
  "ExampleContract:RevealAndClaimBounty",
  async ({ event, context }) => {
    const db = context.db.Record;

    await db.update({
      id: event.args.id,
      data: {
        message: event.args.message,
        msgRevealor: event.args.msgRevealor,
        bountyClaimed: true,
      },
    });
  }
);
