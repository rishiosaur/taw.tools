import { useCallback, useState } from "react";
import { NextApiRequest } from "next";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import {
  Question,
  Questions,
  AnsweredQuestions,
  QuestionState,
} from "../../../types/Question";
import { decode, encode } from "js-base64";
import { decodeState } from "@/util/encode";
import { sampleArray } from "@/util/sample";

function Card({
  q,
  pq,
  first = false,
}: {
  q: Question;
  first: boolean;
  pq?: Question;
}) {
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
          {first ? (
            <>
              <p>
                At{" "}
                <em>
                  {new Date(q.answerTime).getHours()}:
                  {new Date(q.answerTime).getMinutes()}
                </em>
                , <b>a question</b>{" "}
                {sampleArray([
                  "drops from the sky",
                  "comes into existence",
                  "is asked",
                  "manifests",
                ])}
                :
              </p>
              <h2>"{q.question}"</h2>
            </>
          ) : (
            <>
              <p>
                <em>
                  {(q?.answerTime - (pq?.answerTime as number)) / 1000 / 60 > 1
                    ? Math.round(
                        q?.answerTime - (pq?.answerTime as number) / 1000 / 60
                      )
                    : Math.round(
                        q?.answerTime - (pq?.answerTime as number) / 1000
                      )}
                  {(q?.answerTime - (pq?.answerTime as number)) / 1000 / 60 > 1
                    ? "m"
                    : "s"}{" "}
                  later,{" "}
                </em>
                <b>{pq?.name}</b> {sampleArray(["asks", "inquires"])}:
              </p>
              <h2>"{q.question}"</h2>
            </>
          )}
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

const QuestionPage = ({
  state: { questions, title, id },
}: {
  state: QuestionState;
}) => {
  const filteredQuestions = (() => {
    // remove the last question if its unanswered
    let qs = [
      ...questions.slice(0, -1),
      (questions[questions.length - 1] as Question).answer
        ? questions[questions.length - 1]
        : null,
    ].filter(Boolean) as AnsweredQuestions;

    console.log(qs);
    return qs;
  })();

  return (
    <>
      {/* <div
        style={{
          textAlign: "center",
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div> */}
      <div
        className="card"
        style={{
          textAlign: "center",
          marginLeft: "35vw",
          width: "30vw",
          marginTop: "4vh",
        }}
      >
        <h1>"{title}"</h1>
        <p>
          A whimsical thread on{" "}
          {new Date((questions[0] as Question).answerTime).toLocaleDateString()}
        </p>
        <small>
          Permalink: <a href={`/${id}`}>taw.tools/{id}</a>
        </small>
      </div>
      <div style={{ display: "flex" }}>
        <div className="card-column">
          {filteredQuestions
            .filter((_, i) => i % 2 === 0)
            .map((q, i, arr) => (
              <Card
                first={i === 0}
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
                first={i === 0}
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

export const getServerSideProps = async (req: NextApiRequest) => {
  const questions: string = req.query.questions as string;

  const parsedQuestions = decodeState(questions);
  console.log("hi", parsedQuestions);

  if (!parsedQuestions.id) {
    const f = await fetch("https://tawtools-2695.restdb.io/rest/threads", {
      method: "POST",
      body: JSON.stringify({
        // _id: id,
        data: questions,
      }),
      headers: {
        "cache-control": "no-cache",
        "x-apikey": process.env.key as string,
        "content-type": "application/json",
      },
    }).then((z) => z.json());

    parsedQuestions.id = f._id;
  }

  return {
    props: {
      state: parsedQuestions,
    },
  };
};
