"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ImSpinner10 } from "react-icons/im";

export default function AskDoctor() {
  const mainDivRef = useRef<HTMLDivElement>(null);

  const { dispatch } = useGlobalState();
  const [img, setImg] = useState<File | null>(null);
  const [symp, setSymp] = useState("");
  const [user, isUserLoading] = useAuthState(firebaseAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [sol, setSol] = useState<Partial<MedicalAdvice> | null>(null);

  const askHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      if (!user) {
        dispatch({ type: "SET_LOGIN_COMP_SHOW_STATE", payload: { type: "LOGIN", show: true } });
        setIsLoading(false);
        return;
      }
      setSol(null);
      setSymp((p) => p.trim());

      if (!symp) return toast.warning("Description is required!");
      if (symp.length > 2000 || symp.length < 10)
        return toast.warning("Description length should be between 10 and 2000 characters!");
      if (!img) return toast.warning("Image is required!");

      const token = await user?.getIdToken();

      if (!token) return toast.error("Unable to authorize the request");

      const newFormData = new FormData();

      newFormData.append("symp", symp);
      newFormData.append("avatar", img);

      const res = await fetch("/api/ask-doc", {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          authorization: `Berar ${token}`,
        },
        body: newFormData,
      });

      if (res.status >= 300) {
        console.log(await res.text());
        throw new Error("HTTP error (ask-doctor) statue: " + res.status);
      }

      const bodyTxt = await res.text();
      const body = JSON.parse(bodyTxt);
      console.log({ body });
      const sol = body["data"] as Partial<MedicalAdvice>;
      setSol(sol);

      // mainDivRef.current?.scrollTo({
      //   behavior: "smooth",
      //   top: mainDivRef.current.scrollHeight,
      // });
      console.log(body);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.main} ref={mainDivRef}>
      <div className="header_spacer"></div>
      <form onSubmit={askHandler}>
        <textarea
          title="Describe your disease/problem"
          required
          value={symp}
          onChange={(e) => setSymp(e.currentTarget.value.slice(0, 2000))}
          autoFocus
          placeholder="Describe your disease/problem"
        ></textarea>
        <div className={styles.img_inp_cont}>
          <p>{img?.name ? img.name : "Select an image of the affected area"}</p>
          <input
            title="Select an image of the affected area"
            required
            type="file"
            onChange={(e) => {
              const files = e?.currentTarget?.files;
              if (files) {
                setImg(files[0]);
              }
            }}
          />
        </div>
        {img ? (
          <div className={styles.img_cont}>
            <ImgView file={img} />
          </div>
        ) : null}
        <button>
          {isLoading || isUserLoading ? (
            <ImSpinner10 className={styles.loader_icon} />
          ) : user === null ? (
            "LOG IN"
          ) : (
            "ASK"
          )}
        </button>
      </form>
      {sol ? <ShowMedicalAdvice advice={sol} onClose={() => setSol(null)} /> : null}
    </div>
  );
}

type ImgViewProps = {
  file: File | null;
};

const ImgView = ({ file }: ImgViewProps) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    // If no file, we don't need to call setState if imgUrl is already null
    if (!file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImgUrl(null);

      return;
    }

    const url = URL.createObjectURL(file);

    setImgUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!imgUrl) return null;

  return <img src={imgUrl} alt="Preview" />;
};

type ShowMedicalAdviceProps = {
  advice: Partial<MedicalAdvice>;
  onClose: () => void;
};
const ShowMedicalAdvice = ({ advice, onClose }: ShowMedicalAdviceProps) => {
  return (
    <div className={styles.advice_cont_outer}>
      <div className={styles.advice_cont}>
        <h2>Is Emergency: {advice.is_emergency ? "Yes" : "No"}</h2>
        <div>
          <p>AI confidence {(advice?.confidence === undefined ? 0 : advice.confidence) * 100}%</p>
          <p>{advice.advice}</p>
        </div>
        <button onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
};

// type ImgViewProps = {
//   file: File | null;
// };
// const ImgView = ({ file }: ImgViewProps) => {
//   const [imgUrl, setImgUrl] = useState<null | string>(null);

//   const setImg = useCallback(() => {
//     if (file) {
//       setImgUrl(URL.createObjectURL(file));
//     } else {
//       setImgUrl(null);
//     }
//   }, [file]);

//   useEffect(() => {
//     setImg();

//     return () => {
//       if (imgUrl) URL.revokeObjectURL(imgUrl);
//     };
//   }, [setImg]);

//   if (!imgUrl) return null;

//   return <img src={imgUrl} />;
// };
