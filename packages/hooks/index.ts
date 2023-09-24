import * as React from "react";

function dispatchStorageEvent(key: string, newValue: string | null): void {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

function setLocalStorageItem<Val>(key: string, value: Val): void {
  const stringifiedValue = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
  } catch (e) {
    console.warn(e);
  }
}

function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
  } catch (e) {
    console.warn(e);
  }
}

function getLocalStorageItem(key: string): string | undefined {
  try {
    return window.localStorage.getItem(key) as string;
  } catch (e) {
    return undefined;
  }
}

function useLocalStorageSubscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getLocalStorageServerSnapshot(): never {
  throw Error("useLocalStorage can't be used in server-side");
}

export function useLocalStorage<Value>(key: string, initialValue?: Value) {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = React.useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot,
  );

  const setState = React.useCallback(
    <Val>(v: Val) => {
      try {
        const nextState =
          typeof v === "function" && store ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store],
  );

  React.useEffect(() => {
    const storedValue = getLocalStorageItem(key);
    if (storedValue === null && typeof initialValue !== "undefined") {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState] as const;
}
