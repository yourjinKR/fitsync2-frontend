import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useWorkoutListQuery } from "../../../features/workout/hooks/useWorkoutListQuery";

const Wrap = styled.main`
  padding: 24px;
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
    <Wrap>
      <h1>운동 기록 목록</h1>
      <p>
        <Link to="/test/workouts/new">운동 기록 생성</Link> | <Link to="/">홈으로</Link>
      </p>
      <p>
        <label htmlFor="workout-owner-id">ownerId 필터 </label>
        <input
          id="workout-owner-id"
          type="number"
          value={ownerIdInput}
          onChange={(e) => {
            setOwnerIdInput(e.target.value);
            setPage(0);
          }}
          placeholder="예: 1"
        />
      </p>
      <p>
        <label htmlFor="workout-size">size </label>
        <select
          id="workout-size"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        {"  "}
        <label htmlFor="workout-sort">sort </label>
        <select
          id="workout-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="id,desc">id desc</option>
          <option value="id,asc">id asc</option>
        </select>
      </p>
      <p>
        <button type="button" onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>
          이전
        </button>{" "}
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={data ? page >= Math.max(0, data.totalPages - 1) : false}
        >
          다음
        </button>{" "}
        <span>
          page {page + 1} / {Math.max(1, data?.totalPages ?? 1)}
        </span>
      </p>
      {isLoading && <p>목록 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && (
        <ul>
          {data?.content.map((item) => (
            <li key={item.id}>
              <Link to={`/test/workouts/${item.id}`}>#{item.id}</Link> createdAt:{item.createdAt}
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}
