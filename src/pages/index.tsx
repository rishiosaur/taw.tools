import { encodeState } from "@/util/encode";
import { encode } from "js-base64";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();

  const submitQuestion = useCallback(() => {
    router.push(
      `/question/${encodeState({
        questions: [
          {
            question,
            askTime: Date.now(),
          },
        ],
        title,
      })}`
    );
  }, [question, router, title]);

  return (
    <div className="box">
      <div className="group">
        <h1>taw.tools</h1>
        <p>
          <em>Tooling for Accelerated Whimsy</em>
        </p>
        <p>
          Recommended usage: go up to strangers on the street with a question
          loaded from here—and strike up a conversation!
        </p>
      </div>

      <div className="row">
        <input
          placeholder="Chain Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
          }}
        />
        <input
          placeholder="Initial question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            flex: 5,
          }}
        />
        <button
          onClick={() => {
            submitQuestion();
          }}
          className="action"
          style={{
            flex: 1,
          }}
        >
          Go!
        </button>
      </div>
    </div>
  );
}
