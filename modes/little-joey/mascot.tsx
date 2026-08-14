import styles from "./mascot.module.css";

export default function LittleJoeyMascot() {
  return (
    <div className={styles.mascot} aria-hidden="true">
      <div className={styles.contenedor}>
        <div className={styles.canguro}>
          <div className={styles.cuello}></div>
          <div className={styles.orejas}></div>

          <div className={styles.cabeza}>
            <div className={styles.ojos}>
              <div className={styles.iris}></div>
            </div>

            <div className={styles.hocico}></div>
          </div>

          <div className={styles.cola}></div>

          <div className={styles.legs}></div>
          <div className={styles.legs3}></div>

          <div className={styles.body}></div>
          <div className={styles.body3}></div>

          <div className={styles.legs5}></div>
          <div className={styles.legs7}></div>
        </div>

        <div className={styles.cangurito}>
          <div className={styles.orejitas}></div>

          <div className={styles.cabeza3}>
            <div className={styles.ojitos}>
              <div className={styles.irisitos}></div>
            </div>

            <div className={styles.hocico3}></div>
          </div>

          <div className={styles.cangurito3}>
            <div className={styles.orejitas}></div>

            <div className={styles.cabeza3}>
              <div className={styles.ojitos}>
                <div className={styles.irisitos}></div>
              </div>

              <div className={styles.hocico3}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
