// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExerciseDetailPage } from "./ExerciseDetailPage";

const mocks = vi.hoisted(() => ({
  useExerciseDetailQueryMock: vi.fn(),
}));

vi.mock("../features/exercise/hooks/useExerciseDetailQuery", () => ({
  useExerciseDetailQuery: (id: number) => mocks.useExerciseDetailQueryMock(id),
}));

describe("ExerciseDetailPage", () => {
  beforeEach(() => {
    mocks.useExerciseDetailQueryMock.mockReset();
    mocks.useExerciseDetailQueryMock.mockReturnValue({
      data: {
        id: 10,
        name: "벤치프레스",
        category: "FITNESS",
        description: "가슴 운동",
        details: { tip: "어깨 고정" },
        hidden: false,
        targets: [{ id: 1, bodyDetailPart: { id: 1, partName: "상체", detailPartName: "가슴" }, targetRole: "MAIN" }],
        effects: ["STRENGTH"],
        equipments: ["BARBELL"],
        requiredMetrics: ["WEIGHT", "REPS"],
      },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("TS-FE-EXERCISE-003: renders detail metadata", () => {
    render(
      <MemoryRouter initialEntries={["/test/exercises/10"]}>
        <Routes>
          <Route path="/test/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("이름: 벤치프레스")).toBeTruthy();
    expect(screen.getByText("카테고리: FITNESS")).toBeTruthy();
    expect(screen.getByText("효과: STRENGTH")).toBeTruthy();
    expect(screen.getByText("장비: BARBELL")).toBeTruthy();
    expect(screen.getByText("지표: WEIGHT, REPS")).toBeTruthy();
  });
});

