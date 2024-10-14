import { eventHandler } from 'h3'
import words from "~/assets/huberts_300.json";

export default eventHandler((event) => {
  return words;
});
