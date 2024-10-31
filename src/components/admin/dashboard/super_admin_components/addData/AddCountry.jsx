import React, { useState, useEffect } from 'react'
import styles from '../../../../../styles/addData.module.scss';
import { AiFillEye, AiFillEyeInvisible, AiFillEdit, AiTwotoneDelete } from "react-icons/ai";
import api from '../../../../../services/api'
import DeleteComponent from './DeleteComponent';
import toast from "react-hot-toast";

const AddCountry = () => {
    const [allCountries, setAllCountries] = useState([])
    const [toggleForm, setToggleForm] = useState(false)
    const [toggleDelete, setToggleDelete] = useState(false)
    const [searchCountry, setSearchCountry] = useState('')
    const [deleteData, setDeleteData] = useState({ header: "", name: "", id: "" })
    const [countryValues, setCountryValues] = useState({ country: "", countryCode: "", phoneCode: "", action: '' })

    useEffect(() => {
        async function getCountrycode() {
            const res = await api.get("/country/get-all-in-admin/1");
            setAllCountries(res.data)
        }
        getCountrycode();
    }, []);

    const handelForm = () => {
        toggleForm === true ? setToggleForm(false) : setToggleForm(true)
    }

    const handelFormData = (e) => {
        setCountryValues({ ...countryValues, [e.target.name]: e.target.value })
    }

    const handelFormSubmit = async (e) => {
        e.preventDefault()
        const data = {
            country: countryValues.country,
            countryCode: countryValues.countryCode,
            phoneCode: countryValues.phoneCode,
        }

        if (countryValues.action === "edit") {
            try {
                const res = await api.put(`/country/edit/`, { ...data, id: countryValues.id })
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
                setToggleForm(false)
                setCountryValues({ country: "", countryCode: "", phoneCode: "", action: '' })
                const updatedData = allCountries.map((item) => {
                    if (countryValues.id === item._id) {
                        return {
                            ...item,
                            ...data
                        }
                    }
                    else {
                        return item
                    }
                })
                setAllCountries(updatedData)
            } catch (err) {
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
                const res = await api.post("/country/create", data);
                setToggleForm(false)
                setAllCountries(allCountries.concat(res.data.data))
                setCountryValues({ country: "", countryCode: "", phoneCode: "", action: '' })
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
            } catch (err) {
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

    const handelSearch = (e) => {
        setSearchCountry(e.target.value)
    }

    const data = allCountries.filter((x) => {
        if (searchCountry === '') {
            return x;
        } else {
            return x.country.toLowerCase().includes(searchCountry)
        }
    })

    const editDataAction = (id, country, countryCode, phoneCode) => {
        setCountryValues({
            country: country,
            countryCode: countryCode,
            phoneCode: phoneCode,
            id: id,
            action: "edit"
        })
        setToggleForm(true)
    }

    const handelCloseModal = () => {
        setToggleForm(false)
        setCountryValues({ country: "", countryCode: "", phoneCode: "", action: '' })
    }

    const toggleDeleteWrapper = (id, country) => {
        setDeleteData({
            header: "country",
            name: country,
            id: id,
        })
        setToggleDelete(true)
    }

    const toggleActiveInactive = async (id) => {
        const res = await api.patch(`/country/active-inactive/${id}`)
        const updatedData = allCountries.map((item) => {
            if (id === item._id) {
                return {
                    ...item,
                    isActive: !item.isActive
                }
            }
            else {
                return item
            }
        })
        setAllCountries(updatedData)
        toast.success(res.data.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--success-color)" },
        });
    }

    return (
        <>
            <div className={styles.AllCountryRelatedWrapper}>
                <h2 style={{ textAlign: "center" }}>Country Info</h2>
                <div className={styles.topContainer}>
                    <div className={styles.searchContainer}>
                        <label
                            htmlFor="SearchCountry">Search:</label>
                        <input
                            onChange={handelSearch}
                            value={searchCountry}
                            placeholder='Search Country'
                            className={styles.searchCountry}
                            type="text"
                        />
                    </div>
                    <button
                        onClick={handelForm}
                        className={styles.createCountryButton}>
                        + Create Country
                    </button>
                </div>
                <div className={styles.mainContainer}>
                    <table className={styles.countryTable}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th style={{ width: '10%' }}>S No.</th>
                                <th style={{ width: '20%' }}>Country Name</th>
                                <th style={{ width: '25%' }}>Status</th>
                                <th style={{ width: '15%' }}>Country Code</th>
                                <th style={{ width: '10%' }}>Dial Code</th>
                                <th style={{ width: '20%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {data.map((item, index) => {
                                return (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {item.country}
                                        </td>
                                        <td>
                                            {item.isActive === true ? "Active" : "Inactive"}
                                        </td>
                                        <td>{item.countryCode}</td>
                                        <td>{item.phoneCode}</td>
                                        <td>
                                            {item.isActive === true ?
                                                <abbr title="Hide">
                                                    <AiFillEye
                                                        onClick={() => toggleActiveInactive(item._id)}
                                                        className={styles.actionIcons} />
                                                </abbr> :
                                                <abbr title="Unhide">
                                                    <AiFillEyeInvisible
                                                        onClick={() => toggleActiveInactive(item._id)}
                                                        className={styles.actionIcons} />
                                                </abbr>
                                            }
                                            <abbr title="Edit">
                                                <AiFillEdit
                                                    onClick={() => editDataAction(item._id, item.country, item.countryCode, item.phoneCode)}
                                                    className={styles.actionIcons}
                                                />
                                            </abbr>
                                            <abbr title="Delete">
                                                <AiTwotoneDelete
                                                    onClick={() => toggleDeleteWrapper(item._id, item.country)}
                                                    className={`${styles.actionIcons} ${styles.trash}`}
                                                />
                                            </abbr>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            <div
                className={`${styles.createFormMainContainer} ${toggleForm === true && styles.toggleClass}`}
            >
                <div className={styles.createdCountryWrapper}></div>
                <button
                    onClick={handelCloseModal}
                    className={`${styles.btnClose} ${styles.CountryBtnClose}`}>
                    &times;
                </button>
                <div className={`${styles.formCountryContainer} ${styles.formContainer}`}>
                    <form
                        onSubmit={handelFormSubmit}
                        className={styles.entryForm}
                    >
                        <h2>Add a Country</h2>
                        <div className={styles.inputContainer}>
                            <label
                                htmlFor="country">
                                Country Name
                            </label>
                            <input
                                required
                                onChange={handelFormData}
                                name="country"
                                value={countryValues.country}
                                type="text"
                                placeholder='Enter Country Name'
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label
                                htmlFor="countryName">
                                Country Code
                            </label>
                            <input
                                required
                                onChange={handelFormData}
                                value={countryValues.countryCode}
                                name="countryCode"
                                type="text"
                                placeholder='Enter Country Code (For Example IN for India)'
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label
                                htmlFor="countryName">
                                Dial Code
                            </label>
                            <input
                                required
                                onChange={handelFormData}
                                value={countryValues.phoneCode}
                                name="phoneCode"
                                type="text"
                                placeholder='Enter Country Code (For Example +91 for India)'
                            />
                        </div>
                        <button
                            className={styles.btnAdd}
                            type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <DeleteComponent
                valueProp={allCountries}
                setValueProp={setAllCountries}
                setToggleDelete={setToggleDelete}
                toggleDelete={toggleDelete}
                data={deleteData}
            />
        </>
    )
}

export default AddCountry
