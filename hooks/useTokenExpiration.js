import { useEffect } from 'react';
import { tokenManager } from '../config/api';

export const useTokenExpiration = (
  navigation
) => {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        const token =
          await tokenManager.getToken();

        if (!token) {
          navigation.replace('Login');
        }
      },
      60000
    );

    return () => clearInterval(interval);
  }, []);
};