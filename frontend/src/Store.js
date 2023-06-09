import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
  order: {
    address: {},
    paymentMethod: {},
  },
  favorites: localStorage.getItem("favItems")
    ? JSON.parse(localStorage.getItem("favItems"))
    : [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    case "REMOVE_FROM_CART": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      localStorage.removeItem("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return { ...state, userInfo: null };
    case "ADD_TO_FAV": {
      const newItem = action.payload;
      const favs = state.favorites.slice();
      const exist = favs.find((item) => item._id === newItem._id);

      if (!exist) favs.push(newItem);

      localStorage.setItem("favItems", JSON.stringify(favs));
      return { ...state, favorites: favs };
    }
    case "REMOVE_FROM_FAV":
      const favs = state.favorites.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("favItems", JSON.stringify(favs));
      return { ...state, favorites: favs };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
