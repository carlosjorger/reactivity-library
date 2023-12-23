import { expect, test } from "vitest";
import { newState } from "./reactivity-state";
test("create a state", () => {
  const personState = { name: "Carlos", age: 26 };
  const state = newState(personState);
  state.genre = "male";
  expect(state.name).toEqual(personState.name);
  expect(state.age).toEqual(personState.age);
  expect(state.genre).toEqual("male");
});
