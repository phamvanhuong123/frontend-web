import { useEffect, useState } from "react";
import { persistStore } from "redux-persist";
import { store } from "../redux/store";

export function usePersistReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persistor = persistStore(store, null, () => setReady(true));
    return () => persistor.pause(); // Cleanup
  }, []);

  return ready;
}
