"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./Login.module.css";
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { BLOOD_GROUP } from "@/const/bloodGroup";
import { GENDER } from "@/const/gender";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase-client";
import { FIREBASE } from "@/const/firebase";
import { useGlobalState } from "@/context/GlobalStateContext";
import { toast } from "react-toastify";
import { ImSpinner10 } from "react-icons/im";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const { state, dispatch } = useGlobalState();
  const [firebaseUserObj] = useAuthState(firebaseAuth);

  const isLogin = state.loginType === "LOGIN";

  const [isPassShow, setIsPassShow] = useState(false);
  // const [isLogin, setIsLogin] = useState(true);
  const [isSignUpWithGoogle, setIsSignUpWithGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>(GENDER[0]);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(BLOOD_GROUP[0]);
  const [previousIllness, setPreviousIllness] = useState("");

  // const [avatar, setAvatar] = useState<File | null>(null);

  // useEffect(() => {
  //   setIsLogin(state.loginType === "LOGIN");
  // }, [state.loginType]);

  const loadUser = useCallback(
    async (firebaseUserObj: User | null | undefined) => {
      if (firebaseUserObj) {
        const userDocRef = doc(firebaseDb, FIREBASE.COLLECTIONS.USER, firebaseUserObj.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.log("No such document!");
          return null;
        }

        const userObj = (await userDocSnap.data()) as UserObj;
        console.log(userObj);
        dispatch({ type: "SET_USER", payload: userObj });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadUser(firebaseUserObj);
  }, [firebaseUserObj, loadUser]);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isLoading) return;
      setIsLoading(true);

      if (isLogin) {
        if (isSignUpWithGoogle) {
          await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
        } else {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        }

        dispatch({ type: "SET_LOGIN_COMP_SHOW_STATE", payload: { show: false, type: "LOGIN" } });
        toast.success("Login success");
      } else {
        const ageInt = parseInt(age);
        if (
          // !avatar ||
          !name ||
          name.length < 4 ||
          !email ||
          !gender ||
          !age ||
          isNaN(ageInt) ||
          ageInt < 3 ||
          ageInt > 150 ||
          !bloodGroup ||
          !previousIllness ||
          previousIllness.length < 10
        ) {
          toast.warning("All required fields are not filled properly");
          return console.log("wrong data in input");
        }

        let user: UserCredential;

        if (isSignUpWithGoogle) {
          user = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
        } else {
          user = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        }

        const token = await user.user.getIdToken();

        const authType: AuthType = isSignUpWithGoogle ? "GOOGLE" : "EMAIL_PASSWORD";
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("gender", gender);
        formData.append("age", age);
        formData.append("blood_group", bloodGroup);
        formData.append("previous_illness", previousIllness);
        formData.append("auth_type", authType);
        // formData.append("avatar", avatar);

        const res = await fetch("/api/signup", {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        });
        if (res.status >= 300) {
          throw new Error(`Https error (signup) status: ${res.status}`);
        }
        const bodyTxt = await res.text();
        const body = JSON.parse(bodyTxt);
        const data = body["data"] as UserObj;
        dispatch({ type: "SET_USER", payload: data });
        dispatch({ type: "SET_LOGIN_COMP_SHOW_STATE", payload: { show: false, type: "LOGIN" } });
        console.log({ data });
        console.log(body);

        toast.success("Signup success");
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.main} ${state.isLoginCompVisible ? styles.visible : styles.invisible}`}
      onClick={(e) => {
        if (e.currentTarget === e.target && !isLoading) {
          dispatch({ type: "SET_LOGIN_COMP_SHOW_STATE", payload: { show: false, type: "LOGIN" } });
        }
      }}
    >
      <form onSubmit={submitHandler}>
        <h1>{isLogin ? "Log In" : "Sign Up"}</h1>
        {isSignUpWithGoogle ? null : (
          <>
            <input
              autoFocus
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <span className={styles.pass_cont}>
              <input
                type={isPassShow ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              {isPassShow ? (
                <FaEyeSlash onClick={() => setIsPassShow(false)} className={styles.icon} />
              ) : (
                <FaEye onClick={() => setIsPassShow(true)} className={styles.icon} />
              )}
            </span>
          </>
        )}

        {isLogin ? null : (
          <>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              disabled={isLoading}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <input
              type="number"
              placeholder="Age"
              required
              max={150}
              min={3}
              value={age}
              disabled={isLoading}
              onChange={(e) => setAge(e.currentTarget.value)}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.currentTarget.value as Gender)}
              disabled={isLoading}
            >
              {GENDER.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <select
              disabled={isLoading}
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.currentTarget.value as BloodGroup)}
            >
              {BLOOD_GROUP.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <textarea
              disabled={isLoading}
              placeholder="Previous illness"
              value={previousIllness}
              onChange={(e) => setPreviousIllness(e.currentTarget.value)}
            ></textarea>
            {/* <div className={styles.avatar_btn_cont}>
              <p>{avatar ? avatar.name : "Select your profile picture"}</p>
              <input
                type="file"
                onChange={({ currentTarget: { files } }) =>
                  setAvatar(files && files.length !== 0 ? files[0] : null)
                }
              />
            </div> */}
          </>
        )}
        {isLogin ? null : (
          <div className={styles.signup_type_cont}>
            <p>Sign up with:</p>
            <span
              onClick={() => {
                if (isLoading) return;
                setIsSignUpWithGoogle(true);
              }}
            >
              <input
                type="radio"
                checked={isSignUpWithGoogle}
                onChange={(e) => setIsSignUpWithGoogle(e.currentTarget.checked)}
              />
              Google
            </span>
            <span
              onClick={() => {
                if (isLoading) return;
                setIsSignUpWithGoogle(false);
              }}
            >
              <input
                type="radio"
                checked={!isSignUpWithGoogle}
                onChange={(e) => setIsSignUpWithGoogle(e.currentTarget.checked)}
              />
              Email & password
            </span>
          </div>
        )}
        <button disabled={isLoading} className={styles.submit_btn}>
          {isLoading ? (
            <ImSpinner10 className={styles.loader_icon} />
          ) : (
            <>
              {isSignUpWithGoogle ? <FaGoogle /> : <FaEnvelope />}
              {isLogin ? "LOG IN" : "SIGN UP"}
            </>
          )}
        </button>
        {isLogin ? (
          <button disabled={isLoading} type="button">
            {isLoading ? <ImSpinner10 className={styles.loader_icon} /> : "LOG IN WITH GOOGLE"}
          </button>
        ) : null}

        {isLogin ? (
          <p className={styles.txt_btn}>
            {"Don't"} have an account?{" "}
            <span
              onClick={() => {
                if (isLoading) return;
                // setIsLogin(false);
                dispatch({ type: "SET_LOGIN_TYPE", payload: "SIGNUP" });
                setIsSignUpWithGoogle(false);
              }}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className={styles.txt_btn}>
            Already have an account?{" "}
            <span
              onClick={() => {
                if (isLoading) return;
                // setIsLogin(false);
                dispatch({ type: "SET_LOGIN_TYPE", payload: "LOGIN" });
                setIsSignUpWithGoogle(false);
              }}
            >
              Log in
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
