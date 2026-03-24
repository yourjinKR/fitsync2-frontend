import { describe, expect, it } from "vitest";
import { toWsEndpoint } from "./chatSocketClient";

describe("toWsEndpoint", () => {
  it("http base url을 ws endpoint로 변환한다", () => {
    expect(toWsEndpoint("http://localhost:8080")).toBe("ws://localhost:8080/ws-chat");
  });

  it("https base url을 wss endpoint로 변환한다", () => {
    expect(toWsEndpoint("https://api.example.com")).toBe("wss://api.example.com/ws-chat");
  });

  it("후행 슬래시를 제거해 endpoint를 구성한다", () => {
    expect(toWsEndpoint("http://localhost:8080/")).toBe("ws://localhost:8080/ws-chat");
  });
});
