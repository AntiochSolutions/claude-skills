import { describe, expect, it } from "vitest";
import { APP } from "./index";

describe("smoke", () => {
  it("suite runs", () => {
    expect(APP).toBe("parkpal");
  });
});
