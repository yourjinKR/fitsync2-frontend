// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkoutListPage } from "./WorkoutListPage";
import type { WorkoutListRequest, WorkoutListResponse } from "../../../features/workout/types/workout";

const useWorkoutListQueryMock = vi.fn();

vi.mock("../../../features/workout/hooks/useWorkoutListQuery", () => ({
  useWorkoutListQuery: (params?: WorkoutListRequest) => useWorkoutListQueryMock(params),
}));

const pageResponse: WorkoutListResponse = {
  content: [{ id: 1, createdAt: "2026-02-23T00:00:00" }],
  totalElements: 20,
  totalPages: 2,
  size: 10,
  number: 0,
  numberOfElements: 1,
  first: true,
  last: false,
  empty: false,
};

describe("WorkoutListPage", () => {
  beforeEach(() => {
    useWorkoutListQueryMock.mockReset();
    useWorkoutListQueryMock.mockReturnValue({
      data: pageResponse,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("정렬/페이지 변경 시 쿼리 파라미터를 갱신한다", () => {
    render(
      <MemoryRouter>
        <WorkoutListPage />
      </MemoryRouter>,
    );

    expect(useWorkoutListQueryMock).toHaveBeenLastCalledWith({
      ownerId: undefined,
      page: 0,
      size: 10,
      sort: "id,desc",
    });

    fireEvent.change(screen.getByLabelText("sort"), { target: { value: "id,asc" } });
    expect(useWorkoutListQueryMock).toHaveBeenLastCalledWith({
      ownerId: undefined,
      page: 0,
      size: 10,
      sort: "id,asc",
    });

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(useWorkoutListQueryMock).toHaveBeenLastCalledWith({
      ownerId: undefined,
      page: 1,
      size: 10,
      sort: "id,asc",
    });
  });
});
