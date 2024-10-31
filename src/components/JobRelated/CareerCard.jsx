import React, {useState, useEffect} from 'react'
import styles from '../../styles/jobcard.module.scss'
import { MdAccessTimeFilled, MdLocationPin } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

const CareerCard = ({ id, title, description, experience, salary, role, location, postedOn, vacancies }) => {

    const navigate = useNavigate()
    const [time, setTime] = useState('')

    const calculateTime = () => {
        let sentTime = moment(postedOn).fromNow();
        setTime(sentTime)
    }

    useEffect(() => {
        calculateTime()
    }, [])

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.left}>
                <Link to={`/jobDescription/${id}`}><h3>{title}</h3></Link>
                <div className={styles.descWrapper}>
                    <p>
                        {description.length >= 180 ? description.slice(0, 180) : description}
                    </p>
                </div>
                <div className={styles.infoWrapper}>
                    <div className={styles.locationWrapper}>
                        <MdLocationPin />
                        <span style={{ textTransform: 'capitalize' }}>{location}</span>
                    </div>
                    <div className={styles.timeWrapper}>
                        <MdAccessTimeFilled />
                        <span>{time}</span>
                    </div>
                </div>
                <div className={styles.countWrapper}>
                    No. of Vaccancies: <span>{vacancies}</span>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.stipendWrapper}>
                    <span>Stipend</span>
                    <h5>Rs. {salary}</h5>
                </div>
                <button
                    onClick={() => navigate(`/jobDescription/${id}`)}
                    className="btnPrimary btn--large"
                >
                    View Job
                </button>
            </div>
        </div>
    )
}

export default CareerCard
