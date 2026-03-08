// @vitest-environment jsdom
import { AxiosError } from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../../shared/apis/http";
import { WorkoutCreatePage } from "./WorkoutCreatePage";

const mocks = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  mutateAsyncMock: vi.fn(),
  useExerciseListQueryMock: vi.fn(),
  useCreateWorkoutMutationMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigateMock,
  };
});

vi.mock("../../../features/exercise/hooks/useExerciseListQuery", () => ({
  useExerciseListQuery: () => mocks.useExerciseListQueryMock(),
}));

vi.mock("../../../features/workout/hooks/useCreateWorkoutMutation", () => ({
  useCreateWorkoutMutation: () => mocks.useCreateWorkoutMutationMock(),
}));

const createApiError = () => {
  const axiosError = new AxiosError("Request failed", undefined, undefined, undefined, {
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: {} as never,
    data: {
      code: "INVALID_PARAMETER",
      message: "Invalid parameter included",
      errors: [{ field: "writerId", message: "must be positive" }],
    },
  });

  return new ApiError(axiosError);
};

describe("WorkoutCreatePage", () => {
  beforeEach(() => {
    mocks.navigateMock.mockReset();
    mocks.mutateAsyncMock.mockReset();
    mocks.useExerciseListQueryMock.mockReset();
    mocks.useCreateWorkoutMutationMock.mockReset();

    mocks.useExerciseListQueryMock.mockReturnValue({
      data: {
        content: [{ id: 1, name: "벤치프레스", category: "FITNESS", hidden: false, detailParts: [] }],
      },
      isLoading: false,
    });

    mocks.useCreateWorkoutMutationMock.mockReturnValue({
      mutateAsync: mocks.mutateAsyncMock,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it("TS-FE-WORKOUT-001: 생성 성공 시 상세 페이지로 이동한다", async () => {
    mocks.mutateAsyncMock.mockResolvedValue({ id: 33 });

    render(
      <MemoryRouter>
        <WorkoutCreatePage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/writerId/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/ownerId/i), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));
    fireEvent.click(screen.getByRole("button", { name: "생성" }));

    expect(mocks.mutateAsyncMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mocks.navigateMock).toHaveBeenCalledWith("/test/workouts/33");
    });
  });

  it("TS-FE-WORKOUT-004: API 오류 메시지와 필드 오류를 표시한다", () => {
    mocks.useCreateWorkoutMutationMock.mockReturnValue({
      mutateAsync: mocks.mutateAsyncMock,
      isPending: false,
      isError: true,
      error: createApiError(),
    });

    render(
      <MemoryRouter>
        <WorkoutCreatePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("오류: Invalid parameter included")).toBeTruthy();
    expect(screen.getByText("writerId: must be positive")).toBeTruthy();
  });
});
