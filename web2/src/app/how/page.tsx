"use client";

export default function HowItWorks() {
  return (
    <main className="flex min-h-screen flex-col  max-w-3xl w-full mx-auto px-1">
      <div className="my-8 p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">How It Works</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Make a Prediction</h2>
          <p>
            Begin by making a prediction about the future. This could be
            anything from a sports event outcome to a personal goal. Write down
            your prediction in a clear and precise manner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. SHA-256 Hashing</h2>
          <p>
            Once your prediction is ready, we use the SHA-256 hashing algorithm
            to convert your prediction into a unique, fixed-size string of
            characters. This hash is a one-way cryptographic function, meaning
            it&apos;s nearly impossible to reverse-engineer the original
            prediction from the hash.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            3. Signing and Smart Contract Submission
          </h2>
          <p>
            After generating the hash, it is signed digitally to ensure
            authenticity and non-repudiation. The signed hash is then submitted
            to a blockchain-based smart contract for secure, tamper-proof
            storage. This ensures that the prediction, in its hashed form, is
            safely stored and cannot be altered.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Prediction Reveal</h2>
          <p>
            At the predetermined time or upon meeting certain conditions, anyone
            can reveal the original prediction. To do so, they need to submit
            the correct message. The smart contract compares this message&apos;s
            hash with the stored one. If they match, the original prediction is
            revealed, validating the accuracy and timing of the initial
            prediction.
          </p>
        </section>
      </div>
    </main>
  );
}
