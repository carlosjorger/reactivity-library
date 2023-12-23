import { expect, test } from "vitest";
import { newState, createEffect } from "./reactivity-state";
test("create a state", () => {
  const personState = { name: "Carlos", age: 26 };
  const state = newState(personState);
  state.genre = "male";
  expect(state.name).toEqual(personState.name);
  expect(state.age).toEqual(personState.age);
  expect(state.genre).toEqual("male");
});
test("test sum reactive sum", () => {
  const state = newState({});
  state.a = 1;
  state.b = 2;

  createEffect(() => {
    state.sum = state.a + state.b;
  });
  expect(state.sum).toEqual(3);
  state.a = 5;
  Promise.resolve().then(() => {
    expect(state.sum).toEqual(7);
  });
});
