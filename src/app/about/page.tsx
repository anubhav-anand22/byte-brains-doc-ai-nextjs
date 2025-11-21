import styles from "./page.module.css";

const About = () => {
  return (
    <section className={styles.main} id="about">
      <div className="header_spacer"></div>
      <div className={styles.sec_one}>
        {/* <img
          src="/assets/health-care-modern-family-doctor-medical-examination-health-care-modern-family-doctor-medical-examination-smiling-friendly-210027460.webp"
          alt="intro"
        /> */}
        <p>{`Aarogyaveda, meaning "the science of life," is an ancient holistic system of medicine
            originating from India over 5,000 years ago. It emphasizes the natural balance between
            the body, mind, and spirit to promote overall well-being. Based on the principles of
            nature’s five elements – Earth, Water, Fire, Air, and Ether – Aarogyaveda seeks to
            understand individual constitution, known as "Prakriti," and addresses health by
            harmonizing these elements.`}</p>
        <p>{`Our platform is dedicated to helping you find natural and effective solutions for your
            health problems through the wisdom of Aarogyaveda. In today’s fast-paced world, many
            face common health issues like stress, digestive problems, skin disorders, joint pain,
            and fatigue. Instead of just masking symptoms, our Aarogyaveda-based system focuses on
            identifying the root causes of these problems and providing personalized guidance to
            restore balance in your body and mind.`}</p>
        <p>{`Our goal is to empower you to take control of your well-being by combining ancient
            Ayurvedic principles with modern technology. All solutions are easy to follow, safe, and
            designed to fit your daily routine. Experience holistic healing, prevent future health
            issues, and lead a healthier life with our trusted Aarogyaveda care system.`}</p>
      </div>

      <div className={styles.sec_two}>
        <h2>🌿 Our Medical Services</h2>
        <h4>Providing quality healthcare solutions for a healthier life</h4>
        <div className="heartbeat-background"> </div>
        <div className={styles.card_cont}>
          <div className="card">
            <h3>General Health Checkup</h3>
            {/* <img
              src="/assets/young-male-psysician-with-patient-measuring-blood-pressure-1.jpg"
              alt="health"
            /> */}
            <p className="short-text">
              A complete health examination to ensure your overall well-being and early detection of
              any health issues.
            </p>
            <button className="read-btn">
              Read More <span className="arrow">➔</span>
            </button>
          </div>

          <div className="card">
            <h3>Emergency Services</h3>
            {/* <img src="/assets/OIP.jpg" alt="health" /> */}
            <p className="short-text">
              24/7 emergency care with experienced doctors and advanced medical equipment for
              critical situations.
            </p>
            <button className="read-btn">
              Read More <span className="arrow">➔</span>
            </button>
          </div>

          <div className="card">
            <h3>Online Consultations</h3>
            {/* <img src="/assets/virtual-doctor.webp" alt="health" height="220px" /> */}
            <p className="short-text">
              Consult top doctors from the comfort of your home through video or chat, saving time
              and ensuring quick advice.
            </p>
            <button className="read-btn">
              Read More <span className="arrow">➔</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
