import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useWorkoutListQuery } from "../../../features/workout/hooks/useWorkoutListQuery";
import { EmptyState } from "../../../shared/components/state/EmptyState";
import { ErrorState } from "../../../shared/components/state/ErrorState";
import { LoadingState } from "../../../shared/components/state/LoadingState";
import { FormField } from "../../../shared/components/ui/FormField";
import { PageShell } from "../../../shared/components/ui/PageShell";
import { PaginationControls } from "../../../shared/components/ui/PaginationControls";

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export function WorkoutListPage() {
  const [ownerIdInput, setOwnerIdInput] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("id,desc");

  const ownerId = ownerIdInput ? Number(ownerIdInput) : undefined;
  const { data, isLoading, isError, error } = useWorkoutListQuery({
    ownerId,
    page,
    size,
    sort,
  });

  return (
    <PageShell title="운동 기록 목록">
      <Row>
        <Link to="/test/workouts/new">운동 기록 생성</Link>
        <Link to="/">홈으로</Link>
      </Row>

      <Row>
        <FormField label="ownerId 필터" htmlFor="workout-owner-id">
          <input id="workout-owner-id" type="number" value={ownerIdInput} onChange={(e) => { setOwnerIdInput(e.target.value); setPage(0); }} placeholder="예: 1" />
        </FormField>

        <FormField label="size" htmlFor="workout-size">
          <select id="workout-size" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </FormField>

        <FormField label="sort" htmlFor="workout-sort">
          <select id="workout-sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}>
            <option value="id,desc">id desc</option>
            <option value="id,asc">id asc</option>
          </select>
        </FormField>

        <PaginationControls page={page} totalPages={data?.totalPages ?? 1} onPrev={() => setPage((prev) => Math.max(0, prev - 1))} onNext={() => setPage((prev) => prev + 1)} />
      </Row>

      {isLoading ? <LoadingState message="운동 기록 목록 조회 중..." /> : null}
      {isError ? <ErrorState message="운동 기록 목록 조회 실패" error={error} /> : null}

      {!isLoading && !isError ? (
        data?.content.length ? (
          <ul>
            {data.content.map((item) => (
              <li key={item.id}>
                <Link to={`/test/workouts/${item.id}`}>#{item.id}</Link> createdAt: {item.createdAt}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="조회된 운동 기록이 없습니다." />
        )
      ) : null}
    </PageShell>
  );
}
