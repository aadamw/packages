import { renderHook, act } from "@testing-library/react";
import {
  useLocalStorage,
  useLockBodyScroll,
  useSessionStorage,
} from "./index.js";

describe("useLocalStorage", () => {
  it("returns the initial value when the key is not present in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));
    expect(result.current[0]).toBe("initialValue");
  });
  it("returns the value from localStorage when the key is present", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify("value"),
    });
    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));

    expect(result.current[0]).toBe("value");
  });
  it("returns initialValue when value read from localStorage is not a valid JSON", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => "invalid json",
    });

    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));

    expect(result.current[0]).toBe("initialValue");
  });
  it('removes the key from localStorage when the value is set to "null" and returns initialValue', () => {
    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));
    const [value, setValue] = result.current;
    act(() => {
      setValue(null);
    });

    expect(value).toBe("initialValue");
    expect(window.localStorage.getItem("key")).toBeNull();
  });
  it('removes the key from localStorage when the value is set to "undefined" and returns initialValue', () => {
    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));
    const [value, setValue] = result.current;
    act(() => {
      setValue(undefined);
    });

    expect(value).toBe("initialValue");
    expect(window.localStorage.getItem("key")).toBeNull();
  });
  it("sets new value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initialValue"));
    act(() => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
  });
  it("throws error when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    try {
      expect(() =>
        renderHook(() => useLocalStorage("key", "initialValue")),
      ).toThrowError();
    } catch (e) {}
  });
});

describe("useSessionStorage", () => {
  it("returns the initial value when the key is not present in sessionStorage", () => {
    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );
    expect(result.current[0]).toBe("initialValue");
  });

  it("returns the value from useSessionStorage when the key is present", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => JSON.stringify("value"),
    });
    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );

    expect(result.current[0]).toBe("value");
  });
  it("returns initialValue when value read from sessionStorage is not a valid JSON", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => "invalid json",
    });

    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );

    expect(result.current[0]).toBe("initialValue");
  });
  it('removes the key from sessionStorage when the value is set to "null" and returns initialValue', () => {
    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );
    const [value, setValue] = result.current;
    act(() => {
      setValue(null);
    });

    expect(value).toBe("initialValue");
    expect(window.sessionStorage.getItem("key")).toBeNull();
  });

  it('removes the key from sessionStorage when the value is set to "undefined" and returns initialValue', () => {
    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );
    const [value, setValue] = result.current;
    act(() => {
      setValue(undefined);
    });

    expect(value).toBe("initialValue");
    expect(window.sessionStorage.getItem("key")).toBeNull();
  });
  it("sets new value to sessionStorage", () => {
    const { result } = renderHook(() =>
      useSessionStorage("key", "initialValue"),
    );
    act(() => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
  });
  it("throws error when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    try {
      expect(() =>
        renderHook(() => useSessionStorage("key", "initialValue")),
      ).toThrowError();
    } catch (e) {}
  });
});

describe("useLockBodyScroll", () => {
  it('adds "overflow: hidden" to body called without prop', () => {
    renderHook(() => useLockBodyScroll());

    expect(document.body.style.overflow).toBe("hidden");
  });
  it('adds "overflow: hidden" to body called with true', () => {
    renderHook(() => useLockBodyScroll(true));

    expect(document.body.style.overflow).toBe("hidden");
  });
  it("doesn't adds 'overflow: hidden' to body called with true", () => {
    renderHook(() => useLockBodyScroll(false));

    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
