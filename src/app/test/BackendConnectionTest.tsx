import React, { useEffect, useState } from 'react';
import { api } from '../shared/apis/http';

type HealthCheck = {
  connected : string
};

const BackendConnectionTest = () => {

  const [healthCheck, setHealthCheck] = useState<HealthCheck>();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await api.get("/api/check");
        const data = response.data;
        console.log(response);
        
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