import React, { createContext, useContext, ReactNode } from "react";
import { useViewerInfoQuery, IViewerInfoQuery } from "../queries/ViewerInfo";

interface IViewerContextValue {
  viewer: IViewerInfoQuery["viewer"] | null;
  loading: boolean;
  error?: Error;
}

const ViewerContext = createContext<IViewerContextValue | undefined>(undefined);

export interface IViewerProviderProps {
  children: ReactNode;
}

export const ViewerProvider: React.FC<IViewerProviderProps> = ({ children }) => {
  const { data, loading, error } = useViewerInfoQuery();

  const value: IViewerContextValue = {
    viewer: data?.viewer ?? null,
    loading,
    error: error instanceof Error ? error : undefined
  };

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};

export const useViewer = (): IViewerContextValue => {
  const context = useContext(ViewerContext);
  if (context === undefined) {
    throw new Error("useViewer must be used within a ViewerProvider");
  }
  return context;
};
