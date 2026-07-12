"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { CartItem, Order } from "./types";

/* ---------------- Cart ---------------- */
type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: string; spec: string }
  | {
      type: "UPDATE_QTY";
      productId: string;
      spec: string;
      quantity: number;
    }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "HYDRATE":
      return action.items;
    case "ADD_ITEM": {
      const idx = state.findIndex(
        (i) => i.productId === action.item.productId && i.spec === action.item.spec
      );
      if (idx >= 0) {
        const next = [...state];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + action.item.quantity,
        };
        return next;
      }
      return [...state, action.item];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) => !(i.productId === action.productId && i.spec === action.spec)
      );
    case "UPDATE_QTY":
      return state.map((i) =>
        i.productId === action.productId && i.spec === action.spec
          ? { ...i, quantity: Math.max(1, action.quantity) }
          : i
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

/* ---------------- Orders ---------------- */
type OrderAction =
  | { type: "HYDRATE"; orders: Order[] }
  | { type: "ADD_ORDER"; order: Order }
  | { type: "UPDATE_ORDER"; order: Order };

function orderReducer(state: Order[], action: OrderAction): Order[] {
  switch (action.type) {
    case "HYDRATE":
      return action.orders;
    case "ADD_ORDER":
      return [action.order, ...state];
    case "UPDATE_ORDER":
      return state.map((o) => (o.id === action.order.id ? action.order : o));
    default:
      return state;
  }
}

/* ---------------- Context shapes ---------------- */
interface CartStateCtx {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
}

interface CartActionsCtx {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, spec: string) => void;
  updateQty: (productId: string, spec: string, quantity: number) => void;
  clearCart: () => void;
}

interface OrderStateCtx {
  orders: Order[];
}

interface OrderActionsCtx {
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
}

const CartStateContext = createContext<CartStateCtx | null>(null);
const CartActionsContext = createContext<CartActionsCtx | null>(null);
const OrderStateContext = createContext<OrderStateCtx | null>(null);
const OrderActionsContext = createContext<OrderActionsCtx | null>(null);

const CART_KEY = "gnc_cart";
const ORDER_KEY = "gnc_orders";

export function AppProviders({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [orders, dispatchOrder] = useReducer(orderReducer, []);
  const [hydrated, setHydrated] = useState(false);

  // SSR-safe hydration: only read localStorage in the browser.
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) dispatch({ type: "HYDRATE", items: JSON.parse(c) as CartItem[] });
      const o = localStorage.getItem(ORDER_KEY);
      if (o) dispatchOrder({ type: "HYDRATE", orders: JSON.parse(o) as Order[] });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // 监听其他标签页的 storage 变化，保持购物车/订单同步
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      try {
        if (e.key === CART_KEY && e.newValue) {
          dispatch({ type: "HYDRATE", items: JSON.parse(e.newValue) as CartItem[] });
        } else if (e.key === ORDER_KEY && e.newValue) {
          dispatchOrder({ type: "HYDRATE", orders: JSON.parse(e.newValue) as Order[] });
        }
      } catch {
        /* ignore malformed storage */
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders, hydrated]);

  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const totalCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const cartStateValue = useMemo(
    () => ({ items, totalAmount, totalCount }),
    [items, totalAmount, totalCount]
  );

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", item }),
    []
  );
  const removeItem = useCallback(
    (productId: string, spec: string) =>
      dispatch({ type: "REMOVE_ITEM", productId, spec }),
    []
  );
  const updateQty = useCallback(
    (productId: string, spec: string, quantity: number) =>
      dispatch({ type: "UPDATE_QTY", productId, spec, quantity }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const cartActionsValue = useMemo(
    () => ({ addItem, removeItem, updateQty, clearCart }),
    [addItem, removeItem, updateQty, clearCart]
  );

  const orderStateValue = useMemo(() => ({ orders }), [orders]);

  const addOrder = useCallback(
    (order: Order) => dispatchOrder({ type: "ADD_ORDER", order }),
    []
  );
  const updateOrder = useCallback(
    (order: Order) => dispatchOrder({ type: "UPDATE_ORDER", order }),
    []
  );

  const orderActionsValue = useMemo(
    () => ({ addOrder, updateOrder }),
    [addOrder, updateOrder]
  );

  return (
    <CartStateContext.Provider value={cartStateValue}>
      <CartActionsContext.Provider value={cartActionsValue}>
        <OrderStateContext.Provider value={orderStateValue}>
          <OrderActionsContext.Provider value={orderActionsValue}>
            {children}
          </OrderActionsContext.Provider>
        </OrderStateContext.Provider>
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

/** 只订阅购物车状态（items / totalAmount / totalCount） */
export function useCartState(): CartStateCtx {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState must be used within AppProviders");
  return ctx;
}

/** 只订阅购物车操作（add / remove / update / clear） */
export function useCartActions(): CartActionsCtx {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error("useCartActions must be used within AppProviders");
  return ctx;
}

/** 只订阅订单状态 */
export function useOrdersState(): OrderStateCtx {
  const ctx = useContext(OrderStateContext);
  if (!ctx) throw new Error("useOrdersState must be used within AppProviders");
  return ctx;
}

/** 只订阅订单操作 */
export function useOrdersActions(): OrderActionsCtx {
  const ctx = useContext(OrderActionsContext);
  if (!ctx) throw new Error("useOrdersActions must be used within AppProviders");
  return ctx;
}

interface CartCtx extends CartStateCtx, CartActionsCtx {}
interface OrderCtx extends OrderStateCtx, OrderActionsCtx {}

/** 兼容旧用法：同时订阅购物车状态与操作（会随购物车变化重渲染） */
export function useCart(): CartCtx {
  const state = useCartState();
  const actions = useCartActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

/** 兼容旧用法：同时订阅订单状态与操作 */
export function useOrders(): OrderCtx {
  const state = useOrdersState();
  const actions = useOrdersActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
