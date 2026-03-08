import React, { useMemo, useState } from "react";
import { EmptyState } from "../../shared/components/state/EmptyState";
import { ErrorState } from "../../shared/components/state/ErrorState";
import { LoadingState } from "../../shared/components/state/LoadingState";
import { FormField } from "../../shared/components/ui/FormField";
import { PageShell } from "../../shared/components/ui/PageShell";
import { PaginationControls } from "../../shared/components/ui/PaginationControls";

/**
 * 해당 컴포넌트는 기능 개발한 요소들을 직접 테스트 하기 위한 페이지이다.
 */
const MyTestGround = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  const pageSize = 5;
  const mockItems = useMemo(
    () => Array.from({ length: 23 }, (_, i) => `테스트 항목 ${i + 1}`),
    []
  );
  const totalPages = Math.ceil(mockItems.length / pageSize);
  const pagedItems = useMemo(() => {
    const start = page * pageSize;
    return mockItems.slice(start, start + pageSize);
  }, [mockItems, page]);

  return (
    <PageShell
      title="My Test Ground"
      actions={
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((prev) => Math.max(0, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
        />
      }
    >
      <EmptyState />
      <ErrorState />
      <ErrorState message="에러 났음 뀨" />
      <LoadingState />
      <LoadingState message="로딩 중이니깐 좀만 기다려 뀨" />
      <form>
        <FormField label="이메일" htmlFor="email" error={error}>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              setError(email.includes("@") ? undefined : "이메일 형식이 올바르지 않습니다.");
            }}
            placeholder="example@domain.com"
          />
        </FormField>
      </form>

      <section>
        <h2>페이지네이션 샘플 목록</h2>
        <ul>
          {pagedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
};

export default MyTestGround;
