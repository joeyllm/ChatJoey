import styles from "./mascot.module.css";

const FIRE_PARTICLE_COUNT = 30;
// Deterministic pseudo-random spread (not Math.random) so server and
// client render the same delays — avoids a hydration mismatch.
const FIRE_PARTICLES = Array.from({ length: FIRE_PARTICLE_COUNT }, (_, i) => ({
  left: `${(i / FIRE_PARTICLE_COUNT) * 100}%`,
  delay: `${((i * 37) % 100) / 100}s`,
}));

export default function EvilJoeyMascot() {
  return (
    <div className={styles.mascot} aria-hidden="true">
      <div className={styles.fire}>
        {FIRE_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className={styles.particle}
            style={{ left: particle.left, animationDelay: particle.delay }}
          ></span>
        ))}
      </div>
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
            <span className={styles.hornLeft}></span>
            <span className={styles.hornRight}></span>
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
