"use client";

import { useGlobalState } from "@/context/GlobalStateContext";
import styles from "./Header.module.css";
import { firebaseAuth } from "@/lib/firebase-client";
import Link from "next/link";
import { ROUTES, ROUTES_ARR } from "@/const/routes";
import { usePathname } from "next/navigation";

const Header = () => {
  const { state, dispatch } = useGlobalState();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
      
      <div className={styles.header_back}></div>
      <header className={styles.header}>
        <h1>Aarogyaveda</h1>
        <nav>
          <ul>
            {ROUTES_ARR.map((e) => (
              <LinkComp key={e.name} route={e} pathname={pathname} />
            ))}
          </ul>
          {state.user !== null ? (
            <button
              onClick={() => {
                firebaseAuth.signOut();
                console.log("Log out");
                dispatch({
                  type: "LOGOUT",
                });
              }}
            >
              LOG OUT
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_LOGIN_COMP_SHOW_STATE",
                    payload: { show: true, type: "LOGIN" },
                  })
                }
              >
                LOG IN
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_LOGIN_COMP_SHOW_STATE",
                    payload: { show: true, type: "SIGNUP" },
                  })
                }
              >
                SIGN UP
              </button>{" "}
            </>
          )}
        </nav>
      </header>
    </>
  );
};

type LinkCompProps = {
  route: ClientLinkRouteObj;
  pathname: string;
};
const LinkComp = ({ route, pathname }: LinkCompProps) => {
  return (
    <Link href={route.path} className={`${pathname === route.path ? styles.current : ""}`}>
      <li>{route.name}</li>
    </Link>
  );
};

export default Header;
