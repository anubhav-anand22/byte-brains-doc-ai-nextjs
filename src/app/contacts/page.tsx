"use client";

import styles from "./page.module.css";

export default function Contacts() {
  return (
    <section>
      <div className="header_spacer"></div>
      <div className={styles.main}>
        <div>
          <h2>Byte brains</h2>
          <p>We are a team of four passionate students building AI solutions for healthcare.</p>
        </div>
        <div>
          <h3>Team members</h3>
          <ul>
            <li>Vandita Awasthi - Project Management & PPT</li>
            <li>Gourav - AI integration</li>
            <li>Shereya Verma - PPT & pitch</li>
            <li>Anubhav Anand - Frontend/Backend</li>
          </ul>
        </div>
        <div>
          <h3>Get in Touch</h3>
          <p>Email: anubhav.ak22@gmail.com</p>
          <p>GitHub: https://github.com/anubhav-anand22/byte-brains-doc-ai-nextjs</p>
          <p>We’d love to hear your feedback!</p>
        </div>
      </div>
    </section>
  );
}
