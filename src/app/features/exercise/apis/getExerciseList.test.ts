import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../shared/apis/http", () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from "../../../shared/apis/http";
import { getExerciseList } from "./getExerciseList";

describe("getExerciseList", () => {
  const getMock = vi.mocked(api.get);

  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({ data: { content: [] } });
  });

  it("serializes pagination/sort query as Spring Pageable format", async () => {
    await getExerciseList({
      hidden: false,
      page: 1,
      size: 10,
      sort: "id,asc",
    });

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock.mock.calls[0][0]).toBe("/api/exercises");

    const requestConfig = getMock.mock.calls[0][1];
    expect(requestConfig).toBeDefined();
    const params = (requestConfig as { params: URLSearchParams }).params;
    expect(params.get("hidden")).toBe("false");
    expect(params.get("page")).toBe("1");
    expect(params.get("size")).toBe("10");
    expect(params.getAll("sort")).toEqual(["id,asc"]);
    expect(params.get("sort[]")).toBeNull();
  });
});
