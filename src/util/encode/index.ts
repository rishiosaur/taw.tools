import { QuestionState } from "@/types/Question";
import { decode, encode } from "js-base64";

export const encodeState = (state: QuestionState) =>
  encode(JSON.stringify(state), true);

export const decodeState = (str: string) =>
  JSON.parse(decode(str)) as QuestionState;
