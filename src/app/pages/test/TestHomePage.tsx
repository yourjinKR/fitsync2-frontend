import { useNavigate } from 'react-router-dom';

const TestHomePage = () => {
  const nav = useNavigate();
  return (
    <div>
      <button onClick={() => nav("/test/my")}>커스텀 테스트</button>
    </div>
  );
};

export default TestHomePage;
