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
test("reactivity with two or more states", () => {
  const state1 = newState({});
  state1.a = 1;
  const state2 = newState({});
  state2.b = 2;
  const state3 = newState({});
  createEffect(() => {
    state3.sum = state1.a + state2.b;
  });
  state2.b = 4;
  Promise.resolve().then(() => {
    expect(state3.sum).toEqual(5);
  });
});
test("reactivity with method", () => {
  const sum = (a: number, b: number) => a + b;
  const state = newState({});
  state.a = 1;
  state.b = 2;
  createEffect(() => {
    state.sum = sum(state.a, state.b);
  });
  Promise.resolve().then(() => {
    expect(state.sum).toEqual(3);
  });
});
