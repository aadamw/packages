import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./index.js";

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
  it("throws error when value read from localStorage is not a valid JSON", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => "invalid json",
    });
    expect(() =>
      renderHook(() => useLocalStorage("key", "initialValue")),
    ).toThrowError();
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
