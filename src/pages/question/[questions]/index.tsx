import { useCallback, useEffect, useRef, useState } from "react";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { Question, QuestionState, Questions } from "../../../types/Question";
import { decode, encode } from "js-base64";
import { decodeState, encodeState } from "@/util/encode";

const QuestionPage = ({
  state: { questions, title, id },
}: {
  state: QuestionState;
}) => {
  console.log(questions);
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const answerRef = useRef<HTMLTextAreaElement | null>(null);

  const answerQuestion = useCallback(() => {
    if (![name, answer, question].includes("")) {
      const encoded = encodeState({
        questions: [
          ...questions.slice(0, -1),
          {
            ...questions[questions.length - 1],
            question: questions[questions.length - 1].question,
            answer,
            answerTime: Date.now(),
            name,
          },
          {
            question,
            askTime: Date.now(),
          },
        ],
        title,
        id,
      });
      console.log(encoded);
      router.push(`/question/${encoded}`);
      setName("");
      setAnswer("");
      setQuestion("");
      answerRef.current?.focus();
    }
  }, [questions, answer, name, question, title, id, router]);

  const done = useCallback(() => {
    const encoded = encodeState({
      questions: [
        ...questions.slice(0, -1),
        {
          question: questions[questions.length - 1].question,
          answer,
          name,
          answerTime: Date.now(),
        },
      ],
      title,
      id,
    });
    console.log(title, id);
    router.push(`/question/${encoded}/done`);
  }, [questions, answer, name, title, id, router]);

  return (
    <div className="box">
      {/* {JSON.stringify(questions)} */}
      <h1>
        Question {questions.length}: {questions.slice(-1)[0].question}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answer && name && question) {
            answerQuestion();
            return;
          }
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <textarea
            value={answer}
            placeholder="Answer"
            onChange={(e) => setAnswer(e.target.value)}
            ref={answerRef}
          />
          <input
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            value={question}
            placeholder="Next Question"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="row submit-row">
            <button onClick={() => done()} type="button">
              Done
            </button>
            <button
              className={answer && name && question ? "action" : ""}
              type="submit"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionPage;

export const getServerSideProps = (req: NextApiRequest) => {
  const questions: string = req.query.questions as string;
  console.log("mo", decodeState(questions));

  return {
    props: {
      state: decodeState(questions),
    },
  };
};
