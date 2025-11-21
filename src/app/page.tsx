// import Image from "next/image";
import Login from "@/Components/Login/Login";
import styles from "./page.module.css";
import Header from "@/Components/Header/Header";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { ROUTES } from "@/const/routes";
import Image from "next/image";

export default function Home() {
  return (
    <section className={styles.page} id="home">
      <div className="header_spacer"></div>

      <div className={styles.main_cont}>
        <div className={styles.main}>
          <h1>
            <b>Your Health, Our Promise</b>
          </h1>
          <p></p>
          <p>
            From prevention to cure, and from guidance to support, our promise is to stand beside
            you at every stage of your healthcare journey.
          </p>
          <p>
            With trust, dedication, and compassion, our mission is to provide care that goes beyond
            medicine.
          </p>
          <p></p>

          {/* <p>
            From prevention to cure, from guidance to support our promise is to stand beside you at
            every stage of your healthcare journey
          </p>
          <p>with trust and dedication.</p>
          <p>Our mission is to provide care that goes beyond medicines.</p>
          <h3>
            <br />
            our promise is to stand beside you at every stage of your healthcare journey,
            <br /> with trust and dedication.
            <br />
            Our mission is to provide care that goes beyond medicines.
          </h3> */}

          <div className={styles.btn_cont}>
            <Link href={ROUTES.ASK_DOCTOR.path}>
              <button>START CONSULTATION</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
