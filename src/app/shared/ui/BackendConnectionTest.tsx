import React, { useEffect, useState } from 'react';
import { http } from '../api/http';

type HealthCheck = {
  connected : string
};

const BackendConnectionTest = () => {

  const [healthCheck, setHealthCheck] = useState<HealthCheck>();

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await http.get("/check");
        setHealthCheck(data);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  return (
    <div>      
      isConnected API Server : {healthCheck?.connected}
    </div>
  );
};

export default BackendConnectionTest;