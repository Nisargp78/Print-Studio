import React from 'react';
import { DesignProvider } from './context/DesignContext';
import MainLayout from './layout/MainLayout';

export default function App() {
  return (
    <DesignProvider>
      <MainLayout />
    </DesignProvider>
  );
}
