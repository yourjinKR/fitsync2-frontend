// @vitest-environment jsdom
import { AxiosError } from "axios";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../shared/apis/http";
import { ExerciseCreatePage } from "./ExerciseCreatePage";

const mocks = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  mutateAsyncMock: vi.fn(),
  useBodyDetailPartListQueryMock: vi.fn(),
  useCreateExerciseMutationMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigateMock,
  };
});

vi.mock("../features/exercise/hooks/useBodyDetailPartListQuery", () => ({
  useBodyDetailPartListQuery: () => mocks.useBodyDetailPartListQueryMock(),
}));

vi.mock("../features/exercise/hooks/useCreateExerciseMutation", () => ({
  useCreateExerciseMutation: () => mocks.useCreateExerciseMutationMock(),
}));

const createApiError = () => {
  const axiosError = new AxiosError(
    "Request failed",
    undefined,
    undefined,
    undefined,
    {
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
      data: {
        code: "INVALID_PARAMETER",
        message: "Invalid parameter included",
        errors: [{ field: "name", message: "must not be blank" }],
      },
    },
  );
  return new ApiError(axiosError);
};

describe("ExerciseCreatePage", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mocks.navigateMock.mockReset();
    mocks.mutateAsyncMock.mockReset();
    mocks.useBodyDetailPartListQueryMock.mockReset();
    mocks.useCreateExerciseMutationMock.mockReset();

    mocks.useBodyDetailPartListQueryMock.mockReturnValue({
      data: [{ id: 1, detailPartName: "Chest", partName: "Upper" }],
      isLoading: false,
      isError: false,
      error: null,
    });

    mocks.useCreateExerciseMutationMock.mockReturnValue({
      mutateAsync: mocks.mutateAsyncMock,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it("TS-FE-EXERCISE-000: renders body-detail-parts options", () => {
    render(
      <MemoryRouter>
        <ExerciseCreatePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Upper / Chest (id:1)")).toBeTruthy();
  });

  it("TS-FE-EXERCISE-001: navigates to detail after successful create", async () => {
    mocks.mutateAsyncMock.mockResolvedValue({ id: 77 });

    const view = render(
      <MemoryRouter>
        <ExerciseCreatePage />
      </MemoryRouter>,
    );

    const page = within(view.container);
    const nameInput = view.container.querySelector<HTMLInputElement>("input[required]");
    const descriptionInput = view.container.querySelector<HTMLTextAreaElement>("textarea[required]");

    expect(nameInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();

    fireEvent.change(nameInput as HTMLInputElement, { target: { value: "Bench Press" } });
    fireEvent.change(descriptionInput as HTMLTextAreaElement, { target: { value: "Chest movement" } });

    fireEvent.click(page.getAllByLabelText("STRENGTH")[0]);
    fireEvent.click(page.getAllByLabelText("BARBELL")[0]);
    fireEvent.click(page.getAllByLabelText("WEIGHT")[0]);

    const targetSelect = view.container.querySelector<HTMLSelectElement>("select[required]");
    expect(targetSelect).toBeTruthy();
    fireEvent.change(targetSelect as HTMLSelectElement, { target: { value: "1" } });

    const form = view.container.querySelector("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form as HTMLFormElement);

    expect(mocks.mutateAsyncMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mocks.navigateMock).toHaveBeenCalledWith("/test/exercises/77");
    });
  });

  it("TS-FE-EXERCISE-004: shows API error message and field errors", () => {
    mocks.useCreateExerciseMutationMock.mockReturnValue({
      mutateAsync: mocks.mutateAsyncMock,
      isPending: false,
      isError: true,
      error: createApiError(),
    });

    render(
      <MemoryRouter>
        <ExerciseCreatePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Invalid parameter included/)).toBeTruthy();
    expect(screen.getByText("name: must not be blank")).toBeTruthy();
  });
});
