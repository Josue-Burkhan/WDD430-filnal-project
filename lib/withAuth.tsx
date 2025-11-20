'use client';

import React, { useEffect } from 'react';
import { useAuth } from './auth';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Loading...</p>; // Or a proper loading spinner
    }

    return user ? <Component {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
