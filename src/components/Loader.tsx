import styles from './Loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.prism}>
                <div className={styles.face}></div>
                <div className={styles.face}></div>
                <div className={styles.face}></div>
            </div>
            <p className={styles.text}>Initializing Prizm AI...</p>
        </div>
    );
};

export default Loader;
