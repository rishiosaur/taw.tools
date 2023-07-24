import { useCallback, useState } from "react";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import {
  Question,
  Questions,
  AnsweredQuestions,
} from "../../../types/Question";
import { decode, encode } from "js-base64";

function ProfilePicture({}) {
  return <div className="profile-picture"></div>;
}

function Card({ q, pq }: { q: Question; pq?: Question }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "600px",
      }}
    >
      <div className="card" key={q.question}>
        <p className="annotation">Q</p>
        <div className="group">
          <p>
            <b>{pq?.name}</b> asks,
          </p>
          <h2>"{q.question}"</h2>
        </div>
      </div>
      <div
        className="card"
        key={q.question}
        style={{
          borderTop: "none",
        }}
      >
        <p className="annotation">A</p>
        {q.answer && (
          <p>
            <b>{q.name}</b> responds, "{q.answer}"
          </p>
        )}
      </div>
    </div>
  );
}

const QuestionPage = ({ questions }: { questions: AnsweredQuestions }) => {
  const filteredQuestions = (() => {
    // remove the last question if its unanswered
    let qs = [
      ...questions.slice(0, -1),
      questions[questions.length - 1].answer
        ? questions[questions.length - 1]
        : null,
    ].filter(Boolean) as AnsweredQuestions;

    console.log(qs);
    return qs;
  })();

  const [title, setTitle] = useState("");

  return (
    <>
      {/* <div
        style={{
          textAlign: "center",
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div> */}
      <div style={{ display: "flex" }}>
        <div className="card-column">
          {filteredQuestions
            .filter((_, i) => i % 2 === 0)
            .map((q, i, arr) => (
              <Card
                q={q}
                pq={filteredQuestions[Math.max(0, i * 2 - 1)]}
                key={q.question}
              />
            ))}
        </div>

        <div
          className="card-column"
          style={{ paddingTop: "10em", justifyContent: "left" }}
        >
          {filteredQuestions
            .filter((_, i) => i % 2 === 1)
            .map((q, i, arr) => (
              <Card
                q={q}
                pq={
                  filteredQuestions.filter((_, i) => i % 2 === 0)[
                    Math.max(0, i)
                  ]
                }
                key={q.question}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default QuestionPage;

export const getServerSideProps = (req: NextApiRequest) => {
  const questions: string = req.query.questions as string;

  const parsedQuestions = JSON.parse(decode(questions));

  return {
    props: {
      questions: parsedQuestions,
    },
  };
};
