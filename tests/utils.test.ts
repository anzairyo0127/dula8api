import * as utils from "../src/utils";

describe("utls.ts test.", () => {
  describe("class Wrapper", () => {
    test("値をWrapして出力できる", () => {
      const numValue = 1;
      const add = (n:number) => {return n + 1;}
      const numMonad = new utils.Wrapper(numValue);
      expect(2).toBe(add(1));
      expect(numMonad.map()).toBe(numValue);
      expect(numMonad.fmap(add).map()).toBe(2);
    });
  });
});
