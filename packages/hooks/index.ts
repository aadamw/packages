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

function getLocalStorageItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
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

  function getReturnValue() {
    if (!store) return initialValue;
    try {
      return JSON.parse(store);
    } catch (e) {
      return initialValue;
    }
  }

  return [getReturnValue(), setState] as const;
}

function setSessionStorageItem<Val>(key: string, value: Val): void {
  const stringifiedValue = JSON.stringify(value);
  window.sessionStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function removeSessionStorageItem(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
    dispatchStorageEvent(key, null);
  } catch (e) {
    console.warn(e);
  }
}

function getSessionStorageItem(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function useSessionStorageSubscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionStorageServerSnapshot(): never {
  throw Error("useSessionStorage can't be used in server-side");
}

export function useSessionStorage<Value>(key: string, initialValue: Value) {
  const getSnapshot = () => getSessionStorageItem(key);

  const store = React.useSyncExternalStore(
    useSessionStorageSubscribe,
    getSnapshot,
    getSessionStorageServerSnapshot,
  );

  const setState = React.useCallback(
    <Val>(v: Val) => {
      try {
        const nextState =
          typeof v === "function" && store ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeSessionStorageItem(key);
        } else {
          setSessionStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store],
  );

  React.useEffect(() => {
    if (
      getSessionStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setSessionStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  function getReturnValue() {
    if (!store) return initialValue;
    try {
      return JSON.parse(store);
    } catch (e) {
      return initialValue;
    }
  }

  return [getReturnValue(), setState];
}
