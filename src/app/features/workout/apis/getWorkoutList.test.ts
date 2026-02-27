import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../shared/apis/http", () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from "../../../shared/apis/http";
import { getWorkoutList } from "./getWorkoutList";

describe("getWorkoutList", () => {
  const getMock = vi.mocked(api.get);

  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({ data: { content: [] } });
  });

  it("serializes pagination/sort query as Spring Pageable format", async () => {
    await getWorkoutList({
      ownerId: 3,
      page: 0,
      size: 5,
      sort: "id,desc",
    });

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock.mock.calls[0][0]).toBe("/api/workouts");

    const requestConfig = getMock.mock.calls[0][1];
    expect(requestConfig).toBeDefined();
    const params = (requestConfig as { params: URLSearchParams }).params;
    expect(params.get("ownerId")).toBe("3");
    expect(params.get("page")).toBe("0");
    expect(params.get("size")).toBe("5");
    expect(params.getAll("sort")).toEqual(["id,desc"]);
    expect(params.get("sort[]")).toBeNull();
  });
});
