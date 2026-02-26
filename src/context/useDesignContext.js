import { createContext, useContext } from 'react';

// Create and export the context to avoid Fast Refresh warning when mixed with component exports
export const DesignContext = createContext();

export const useDesign = () => useContext(DesignContext);
