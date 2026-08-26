import { describe, expect, it } from "vitest";
import { getVapiErrorMessage } from "../useVapiCall";

describe("getVapiErrorMessage", () => {
  it("keeps the provider message when Vapi emits the event itself", () => {
    expect(getVapiErrorMessage({ errorMsg: "Assistant is not available for this origin." }))
      .toBe("Assistant is not available for this origin.");
  });

  it("reads nested provider error payloads", () => {
    expect(getVapiErrorMessage({ error: { message: "Invalid public key." } }))
      .toBe("Invalid public key.");
  });
});
