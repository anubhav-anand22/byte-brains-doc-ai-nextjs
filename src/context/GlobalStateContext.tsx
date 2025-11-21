"use client";
import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";

// 1) ------- State Type -------
export interface GlobalState {
  user: UserObj | null;
  isLoginCompVisible: boolean;
  loginType: "LOGIN" | "SIGNUP";
}

export interface LoginPageState {
  show: GlobalState["isLoginCompVisible"];
  type: GlobalState["loginType"];
}

// 2) ------- Actions Type -------
export type Action =
  | { type: "SET_USER"; payload: GlobalState["user"] }
  | { type: "LOGOUT" }
  | { type: "SET_LOGIN_TYPE"; payload: GlobalState["loginType"] }
  | { type: "SET_LOGIN_COMP_SHOW_STATE"; payload: LoginPageState };

// 3) ------- Initial State -------
const initialState: GlobalState = {
  user: null,
  isLoginCompVisible: false,
  loginType: "LOGIN",
};

// 4) ------- Reducer -------
function globalReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "LOGOUT": {
      console.log("Log out2");
      return { ...state, user: null };
    }

    case "SET_LOGIN_COMP_SHOW_STATE":
      return { ...state, isLoginCompVisible: action.payload.show, loginType: action.payload.type };

    case "SET_LOGIN_TYPE":
      return { ...state, loginType: action.payload };

    default:
      return state;
  }
}

// 5) ------- Context Types -------
interface GlobalStateContextValue {
  state: GlobalState;
  dispatch: Dispatch<Action>;
}

// 6) ------- Create Context -------
const GlobalStateContext = createContext<GlobalStateContextValue | undefined>(undefined);

// 7) ------- Provider -------
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// 8) ------- Hook -------
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used inside GlobalStateProvider");
  }
  return context;
}
