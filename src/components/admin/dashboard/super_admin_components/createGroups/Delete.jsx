import React from 'react'
import api, { getAccessToken } from '../../../../../services/api'
import styles from '../../../../../styles/addData.module.scss'
import toast from "react-hot-toast";

const Delete = ({ setToggleDelete, toggleDelete, data, valueProp, setValueProp }) => {

    const confirmDelete = async () => {

        const req_id = {
            group_id: data.id
        }

        if (data.header === "Student Group") {
            try {
                const res = await api.delete("/student-group/delete", {
                    headers: {
                        Authorization: getAccessToken()
                    },
                    data: req_id
                })


                const newGroup = valueProp.filter((item) => {
                    return item._id !== data.id
                })
                setValueProp(newGroup)
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
                setToggleDelete(false)
            } catch (err) {
                // setLoading(false)
                const error = err?.response
                let message = ""
                if (error) {
                    if (error.status === 422) {
                        const len = error.data.validationError.length
                        error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
                    }
                    else if (error.status === 403) {
                        message = error.data.message
                    }
                    else if (error.status === 409) {
                        message = error.data.message
                    }
                }
                if (message) {
                    toast.error(message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                } else {
                    toast.error(err.message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                }
            }
        } else if (data.header === "Admin Group") {
            try {
                const res = await api.delete("/admin-group/delete", {
                    headers: {
                        Authorization: getAccessToken()
                    },
                    data: req_id
                })


                const newGroup = valueProp.filter((item) => {
                    return item._id !== data.id
                })
                setValueProp(newGroup)
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
                setToggleDelete(false)
            } catch (err) {
                // setLoading(false)
                const error = err?.response
                let message = ""
                if (error) {
                    if (error.status === 422) {
                        const len = error.data.validationError.length
                        error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
                    }
                    else if (error.status === 403) {
                        message = error.data.message
                    }
                    else if (error.status === 409) {
                        message = error.data.message
                    }
                }
                if (message) {
                    toast.error(message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                } else {
                    toast.error(err.message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                }
            }
        } else {
            try {
                const res = await api.delete("/tutor-group/delete", {
                    headers: {
                        Authorization: getAccessToken()
                    },
                    data: req_id
                })


                const newGroup = valueProp.filter((item) => {
                    return item._id !== data.id
                })
                setValueProp(newGroup)
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
                setToggleDelete(false)
            } catch (err) {
                // setLoading(false)
                const error = err?.response
                let message = ""
                if (error) {
                    if (error.status === 422) {
                        const len = error.data.validationError.length
                        error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
                    }
                    else if (error.status === 403) {
                        message = error.data.message
                    }
                    else if (error.status === 409) {
                        message = error.data.message
                    }
                }
                if (message) {
                    toast.error(message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                } else {
                    toast.error(err.message, {
                        duration: 4000,
                        position: "top-center",
                        style: { border: "2px solid var(--danger-color)" },
                    })
                }
            }
        }
    }

    return (
        <div className={`${styles.deleteModalWrapper} ${toggleDelete === true && styles.deleteModalWrapperClass}`}>
            <div className={`${styles.deleteBackground} ${toggleDelete === true && styles.deleteModalWrapperClass}`}></div>
            <div className={styles.deleteContainer}>
                <div className={styles.dangerContainer}></div>
                <h3 className={styles.deleteHeader}>Delete {data.header}</h3>
                <p className={styles.deletePara}>Are You Sure You Want to Delete Group "{data.name}"</p>
                <div className={styles.BtnContainer}>
                    <button
                        onClick={confirmDelete}
                        className={styles.btnConfirm}>
                        Confirm
                    </button>
                    <button
                        onClick={() => setToggleDelete(false)}
                        className={styles.btnCancle}>
                        Cancle
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Delete
