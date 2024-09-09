import { act, renderHook } from "@testing-library/react";

import { useGroupStore } from "../group/store/useGroupStore";
import { useItemStore } from "../item/store/useItemStore";

describe("Group Store", () => {
  test("selectGroup", () => {
    const { result } = renderHook(() => useGroupStore());

    act(() => {
      result.current.selectGroup({
        id: "1",
        title: "Group 1",
        list: [],
        createdAt: "2023-01-01",
      });
    });

    expect(result.current.selectedGroup).toEqual({
      id: "1",
      title: "Group 1",
      list: [],
      createdAt: "2023-01-01",
    });
  });

  test("editGroup", () => {
    const { result } = renderHook(() => useGroupStore());

    act(() => {
      result.current.editGroup({
        id: "1",
        title: "Group 1",
        list: [],
        createdAt: "2023-01-01",
      });
    });

    expect(result.current.editingGroup).toEqual({
      id: "1",
      title: "Group 1",
      list: [],
      createdAt: "2023-01-01",
    });
  });
});

describe("Item Store", () => {
  test("editItem", () => {
    const { result } = renderHook(() => useItemStore());

    act(() => {
      result.current.editItem({
        id: "1",
        title: "Item 1",
        createdAt: "2023-01-01",
      });
    });

    expect(result.current.editingItem).toEqual({
      id: "1",
      title: "Item 1",
      createdAt: "2023-01-01",
    });
  });
});
