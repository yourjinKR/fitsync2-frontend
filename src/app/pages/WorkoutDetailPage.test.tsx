// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkoutDetailPage } from "./WorkoutDetailPage";

const mocks = vi.hoisted(() => ({
  useWorkoutDetailQueryMock: vi.fn(),
}));

vi.mock("../features/workout/hooks/useWorkoutDetailQuery", () => ({
  useWorkoutDetailQuery: (id: number) => mocks.useWorkoutDetailQueryMock(id),
}));

describe("WorkoutDetailPage", () => {
  beforeEach(() => {
    mocks.useWorkoutDetailQueryMock.mockReset();
    mocks.useWorkoutDetailQueryMock.mockReturnValue({
      data: {
        id: 5,
        ownerId: 1,
        writerId: 1,
        memo: "테스트",
        createdAt: "2026-02-23T00:00:00",
        workoutExercises: [
          {
            id: 100,
            exercise: { id: 10, name: "벤치프레스" },
            memo: "첫 운동",
            workoutSets: [{ id: 1, weightKg: 40, reps: 10 }],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("TS-FE-WORKOUT-003: renders workout/exercise/set structure", () => {
    render(
      <MemoryRouter initialEntries={["/test/workouts/5"]}>
        <Routes>
          <Route path="/test/workouts/:workoutId" element={<WorkoutDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("ID: 5")).toBeTruthy();
    expect(screen.getByText("exerciseId=10, name=벤치프레스, memo=첫 운동")).toBeTruthy();
    expect(screen.getByText("sets: 1")).toBeTruthy();
    expect(screen.getByText("weightKg=40, reps=10, distanceM=-, durationSec=-, speedKmh=-, rpe=-, restTimeSec=-")).toBeTruthy();
  });
});

