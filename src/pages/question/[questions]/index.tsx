import { useCallback, useEffect, useState } from "react";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { Question, Questions } from "../../../types/Question";
import { decode, encode } from "js-base64";

const QuestionPage = ({ questions }: { questions: Questions }) => {
  console.log(questions);
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  const answerQuestion = useCallback(() => {
    const encoded = encode(
      JSON.stringify([
        ...questions.slice(0, -1),
        {
          question: questions[questions.length - 1].question,
          answer,
          answerTime: Date.now(),
          name,
        },
        {
          question,
        },
      ]),
      true
    );
    console.log(encoded);
    router.push(`/question/${encoded}`);
    setName("");
    setAnswer("");
    setQuestion("");
  }, [router, questions, answer, name, question]);

  const done = useCallback(() => {
    const encoded = encode(
      JSON.stringify([
        ...questions.slice(0, -1),
        {
          question: questions[questions.length - 1].question,
          answer,
          name,
          answerTime: Date.now(),
        },
      ]),
      true
    );
    router.push(`/question/${encoded}/done`);
  }, [questions, answer, name, router]);

  return (
    <div className="box">
      <h1>
        Question {questions.length}: {questions.slice(-1)[0].question}
      </h1>
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
          <button onClick={() => done()}>Done</button>
          <button className="action" onClick={() => answerQuestion()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;

export const getServerSideProps = (req: NextApiRequest) => {
  const questions: string = req.query.questions as string;

  return {
    props: {
      questions: JSON.parse(decode(questions)),
    },
  };
};