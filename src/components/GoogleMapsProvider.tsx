"use client";

import {
  APIProvider,
  APILoadingStatus,
  useApiLoadingStatus,
} from "@vis.gl/react-google-maps";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { googleMapsApiKey, hasGoogleMaps } from "@/lib/maps-config";

const MapsAvailableContext = createContext(false);

export function useMapsAvailable(): boolean {
  return useContext(MapsAvailableContext);
}

function MapsLoadWatcher({ onFailed }: { onFailed: () => void }) {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.FAILED) {
      onFailed();
    }
  }, [status, onFailed]);

  return null;
}

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const keyConfigured = hasGoogleMaps();
  const [available, setAvailable] = useState(false);
  const authFailedRef = useRef(false);
  const apiKey = googleMapsApiKey();

  useLayoutEffect(() => {
    if (!keyConfigured) return;

    const previous = window.gm_authFailure;
    window.gm_authFailure = () => {
      authFailedRef.current = true;
      setAvailable(false);
      if (typeof previous === "function") {
        previous();
      }
    };

    return () => {
      window.gm_authFailure = previous;
    };
  }, [keyConfigured]);

  if (!keyConfigured || !apiKey) {
    return (
      <MapsAvailableContext.Provider value={false}>
        {children}
      </MapsAvailableContext.Provider>
    );
  }

  return (
    <MapsAvailableContext.Provider value={available}>
      <APIProvider
        apiKey={apiKey}
        libraries={["places"]}
        language="en-GB"
        region="GB"
        authReferrerPolicy="origin"
        onLoad={() => {
          if (!authFailedRef.current) {
            setAvailable(true);
          }
        }}
        onError={() => setAvailable(false)}
      >
        <MapsLoadWatcher onFailed={() => setAvailable(false)} />
        {children}
      </APIProvider>
    </MapsAvailableContext.Provider>
  );
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
