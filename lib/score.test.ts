import { test, expect } from "vitest";
import { CellStatus, calculateScore } from "./score";

const buildEmptyBoard = (): CellStatus[] =>
  Array(25)
    .fill(null)
    .map(() => CellStatus.notDaubed);

test("Empty board", () => {
  const input = buildEmptyBoard();
  const expected = 0;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("One daub without image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithoutImage;
  const expected = 1;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("Two daubs without image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithoutImage;
  input[10] = CellStatus.daubedWithoutImage;
  const expected = 2;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("One daub with image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithImage;
  const expected = 3;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo row without image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithoutImage;
  input[1] = CellStatus.daubedWithoutImage;
  input[2] = CellStatus.daubedWithoutImage;
  input[3] = CellStatus.daubedWithoutImage;
  input[4] = CellStatus.daubedWithoutImage;
  const expected = 10;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo column without image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithoutImage;
  input[5] = CellStatus.daubedWithoutImage;
  input[10] = CellStatus.daubedWithoutImage;
  input[15] = CellStatus.daubedWithoutImage;
  input[20] = CellStatus.daubedWithoutImage;
  const expected = 10;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo diagonal with image", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithImage;
  input[6] = CellStatus.daubedWithImage;
  input[12] = CellStatus.daubedWithImage;
  input[18] = CellStatus.daubedWithImage;
  input[24] = CellStatus.daubedWithImage;
  const expected = 5 + 15;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo diagonal without image", () => {
  const input = buildEmptyBoard();
  input[4] = CellStatus.daubedWithoutImage;
  input[8] = CellStatus.daubedWithoutImage;
  input[12] = CellStatus.daubedWithoutImage;
  input[16] = CellStatus.daubedWithoutImage;
  input[20] = CellStatus.daubedWithoutImage;
  const expected = 5 + 5;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo diagonal with some image", () => {
  const input = buildEmptyBoard();
  input[4] = CellStatus.daubedWithoutImage;
  input[8] = CellStatus.daubedWithoutImage;
  input[12] = CellStatus.daubedWithoutImage;
  input[16] = CellStatus.daubedWithImage;
  input[20] = CellStatus.daubedWithImage;
  const expected = 5 + 1 * 3 + 3 * 2;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});

test("A bingo row and a bingo column", () => {
  const input = buildEmptyBoard();
  input[0] = CellStatus.daubedWithoutImage;
  input[1] = CellStatus.daubedWithoutImage;
  input[2] = CellStatus.daubedWithoutImage;
  input[3] = CellStatus.daubedWithoutImage;
  input[4] = CellStatus.daubedWithoutImage;

  input[7] = CellStatus.daubedWithoutImage;
  input[12] = CellStatus.daubedWithoutImage;
  input[17] = CellStatus.daubedWithoutImage;
  input[22] = CellStatus.daubedWithoutImage;

  const expected = 5 * 2 + 1 * 9;
  const actual = calculateScore(input);

  expect(actual).toEqual(expected);
});
