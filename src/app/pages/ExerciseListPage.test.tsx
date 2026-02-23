// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExerciseListPage } from "./ExerciseListPage";
import type { ExerciseListRequest, ExerciseListResponse } from "../features/exercise/types/exercise";

const useExerciseListQueryMock = vi.fn();

vi.mock("../features/exercise/hooks/useExerciseListQuery", () => ({
  useExerciseListQuery: (params?: ExerciseListRequest) => useExerciseListQueryMock(params),
}));

const pageResponse: ExerciseListResponse = {
  content: [{ id: 1, name: "벤치프레스", category: "FITNESS", hidden: false }],
  totalElements: 20,
  totalPages: 2,
  size: 10,
  number: 0,
  first: true,
  last: false,
};

describe("ExerciseListPage", () => {
  beforeEach(() => {
    useExerciseListQueryMock.mockReset();
    useExerciseListQueryMock.mockReturnValue({
      data: pageResponse,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("updates query params when sort/page controls change", () => {
    render(
      <MemoryRouter>
        <ExerciseListPage />
      </MemoryRouter>,
    );

    expect(useExerciseListQueryMock).toHaveBeenLastCalledWith({
      category: undefined,
      hidden: false,
      page: 0,
      size: 10,
      sort: ["id,desc"],
    });

    fireEvent.change(screen.getByLabelText("sort"), { target: { value: "id,asc" } });
    expect(useExerciseListQueryMock).toHaveBeenLastCalledWith({
      category: undefined,
      hidden: false,
      page: 0,
      size: 10,
      sort: ["id,asc"],
    });

    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(useExerciseListQueryMock).toHaveBeenLastCalledWith({
      category: undefined,
      hidden: false,
      page: 1,
      size: 10,
      sort: ["id,asc"],
    });
  });
});

