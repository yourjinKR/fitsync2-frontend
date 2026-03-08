import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useExerciseListQuery } from "../../../features/exercise/hooks/useExerciseListQuery";
import type { ExerciseCategory } from "../../../features/exercise/types/exercise";
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

export function ExerciseListPage() {
  const [category, setCategory] = useState<ExerciseCategory | "">("");
  const [hidden, setHidden] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("id,desc");

  const { data, isLoading, isError, error } = useExerciseListQuery({
    category: category || undefined,
    hidden,
    page,
    size,
    sort: [sort],
  });

  return (
    <PageShell title="운동 목록">
      <Row>
        <Link to="/test/exercises/new">운동 생성</Link>
        <Link to="/">홈으로</Link>
      </Row>

      <Row>
        <FormField label="카테고리" htmlFor="exercise-category">
          <select id="exercise-category" value={category} onChange={(e) => { setCategory(e.target.value as ExerciseCategory | ""); setPage(0); }}>
            <option value="">전체</option>
            <option value="FITNESS">FITNESS</option>
            <option value="CROSSFIT">CROSSFIT</option>
            <option value="YOGA">YOGA</option>
            <option value="PILATES">PILATES</option>
            <option value="REHAB">REHAB</option>
          </select>
        </FormField>

        <FormField label="숨김 포함" htmlFor="exercise-hidden">
          <input id="exercise-hidden" type="checkbox" checked={hidden} onChange={(e) => { setHidden(e.target.checked); setPage(0); }} />
        </FormField>
      </Row>

      <Row>
        <FormField label="size" htmlFor="exercise-size">
          <select id="exercise-size" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </FormField>

        <FormField label="sort" htmlFor="exercise-sort">
          <select id="exercise-sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}>
            <option value="id,desc">id desc</option>
            <option value="id,asc">id asc</option>
          </select>
        </FormField>

        <PaginationControls page={page} totalPages={data?.totalPages ?? 1} onPrev={() => setPage((prev) => Math.max(0, prev - 1))} onNext={() => setPage((prev) => prev + 1)} />
      </Row>

      {isLoading ? <LoadingState message="운동 목록 조회 중..." /> : null}
      {isError ? <ErrorState message="운동 목록 조회 실패" error={error} /> : null}

      {!isLoading && !isError ? (
        data?.content.length ? (
          <ul>
            {data.content.map((item) => (
              <li key={item.id}>
                <Link to={`/test/exercises/${item.id}`}>{item.name}</Link> ({item.category})
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="조건에 맞는 운동이 없습니다." />
        )
      ) : null}
    </PageShell>
  );
}
