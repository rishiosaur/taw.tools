import { encode } from "js-base64";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const submitQuestion = useCallback(() => {
    router.push(
      `/question/${encode(
        JSON.stringify([
          {
            question,
          },
        ]),
        true
      )}`
    );
  }, [question, router]);

  return (
    <div className="box">
      <div className="group">
        <h1>taw.tools</h1>
        <p>Tools for Accelerated Whimsy</p>
      </div>

      <div className="row">
        <input
          placeholder="Start a question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={() => {
            submitQuestion();
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
