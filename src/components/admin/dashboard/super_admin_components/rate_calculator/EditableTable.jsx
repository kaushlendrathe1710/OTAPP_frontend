import React, { useEffect, useState } from "react";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import { MdOutlineAdd } from "react-icons/md";
import tableStyles from "../../../../../styles/table.module.scss";
import styles from "../../../../../styles/ratecalculator.module.scss";
import { toast } from "react-hot-toast";
import { TableInputCell } from "./TableInputCell";
import api, { getAccessToken } from "../../../../../services/api";

export const EditableTable = ({
  originalKey,
  currentValueKey,
  ratesValuesArray,
  currency,
  projectRateId,
  refetch,
}) => {
  let ratesOldKeysAndValues = ratesValuesArray?.map((obj) => {
    let newObj = {};
    for (let key in obj) {
      newObj = {
        key: key,
        value: obj[key],
      };
    }
    return newObj;
  });

  const [isEditable, setIsEditable] = useState(false);
  const [ratesValuesArraySS, setRatesValuesArraySS] =
    useState(ratesValuesArray);

  // handle changed data
  const [userClickedOn, setUserClickedOn] = useState("");
  //   const [newKeys, setNewKeys] = useState([]);
  //   const [newObjectValues, setNewObjectValues] = useState("");
  const [newKeysAndValues, setNewKeysAndValues] = useState([]);

  // const [smartChangedData, setSmartChangedData] = useState([]);
  const [projectRatesKeys, setProjectRatesKeys] = useState([]);

  const [changedProjectRatesKeys, setChangedProjectRatesKeys] = useState([]);

  // handle states for new added table element
  const [newAddedTableElements, setNewAddedTableElements] = useState([]);
  const [newAddedProjectRatesKeys, setNewAddedProjectRatesKeys] = useState([]);
  const [newAddedKeysAndValues, setNewAddedKeysAndValues] = useState([]);

  // handle states for delete table element
  const [deletedTableElements, setDeletedTableElements] = useState([]);

  // error states
  const [updatedAndOldProjectRatesValues, setUpdatedAndOldProjectRatesValues] =
    useState([]);
  const [updatedAndNewProjectRatesValues, setUpdatedAndNewProjectRatesValues] =
    useState([]);
  const [smartObjArrWithErrorState, setSmartObjArrWithErrorState] = useState(
    []
  );
  const [
    smartObjNewAddedArrWithErrorState,
    setSmartObjNewAddedArrWithErrorState,
  ] = useState([]);
  const [
    trackPreviousAndNextElementValues,
    setTrackPreviousAndNextElementValues,
  ] = useState([]);
  const [
    trackNewAddedPreviousAndNextElementValues,
    setTrackNewAddedPreviousAndNextElementValues,
  ] = useState([]);

  // states for showing below or above heading
  const [tableFirstElement, setTableFirstElement] = useState(null);
  const [tableLastElement, setTableLastElement] = useState(null);

  // pass only that array which has value like {[key]:[value]}
  function sortKeyValuesArrayByKey(array) {
    let myArr = [];
    for (let i = 0; i < array?.length; i++) {
      let obj = array[i];
      for (let key in obj) {
        let newObj = {
          key: key,
          value: obj[key],
          keyValueObj: {
            [key]: obj[key],
          },
        };
        myArr.push(newObj);
      }
    }
    let sortArr = [...myArr]
      .sort((a, b) => a?.key - b?.key)
      .map((obj) => obj?.keyValueObj);
    return sortArr;
  }

  // this function accept and made for only "smartObjArrWithErrorState" array
  function isAnyKeyValueInvalidOfArr(smartObjArrWithErrorState) {
    let allErrorStates = smartObjArrWithErrorState?.map(
      (perfectObj) => perfectObj?.isError
    );
    return allErrorStates?.includes(true);
  }

  useEffect(() => {
    // console.log(
    //   `ratesValuesArray of ${currentValueKey}: >>> `,
    //   ratesValuesArray
    // );
    if (deletedTableElements?.length === 0) {
      // let sortArr = [...myArr].sort((a,b)=>a?.key-b?.key).map((obj)=>obj?.keyValueObj);
      // console.log(`Sorting array of ${currentValueKey}: >> `, sortArr);
      setRatesValuesArraySS(sortKeyValuesArrayByKey(ratesValuesArray));
    }
  }, [ratesValuesArray]);

  function setInitialKeysAndValues() {
    let sortArr = sortKeyValuesArrayByKey(ratesValuesArray);
    // console.log(`RATES VALUES OF ${currentValueKey} *** `, sortArr);
    let keysAndValuesSmartObjArr = [];
    let perfectObjArr = [];
    for (let i = 0; i < sortArr?.length; i++) {
      let obj = sortArr[i];
      let smartObj = {};
      let perfectObj = {};
      for (let key in obj) {
        let newKeyValueObj = {
          [key]: obj[key],
        };
        smartObj = {
          oldKey: key,
          newKey: key,
          keyValueObj: newKeyValueObj,
          newElement: false,
        };
        perfectObj = {
          ...smartObj,
          isError: false,
        };
      }
      keysAndValuesSmartObjArr.push(smartObj);
      perfectObjArr.push(perfectObj);
    }
    // console.log(`smart obj arr: ${currentValueKey} >> %c`, keysAndValuesSmartObjArr);
    console.log(`smart obj arr: >>`, perfectObjArr);
    setUpdatedAndOldProjectRatesValues(keysAndValuesSmartObjArr);
    setSmartObjArrWithErrorState(perfectObjArr);

    setTableFirstElement(keysAndValuesSmartObjArr[0]);
    setTableLastElement(
      keysAndValuesSmartObjArr[keysAndValuesSmartObjArr.length - 1]
    );
    // set initial values
    let trackArr = keysAndValuesSmartObjArr?.map((obj, i, arr) => {
      let smartObj = {};
      if (i === 0) {
        // set first element value
        smartObj = {
          ...obj,
          isPrevElement: false,
          prevElement: null,
          nextElement: arr.length > 1 ? arr[i + 1] : null,
          isNextElement: arr.length > 1 ? true : false,
        };
      } else if (i === arr.length - 1) {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement: null,
          isNextElement: false,
        };
      } else {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement: arr[i + 1],
          isNextElement: true,
        };
      }
      return smartObj;
    });
    // console.log(
    //   `MAPPED ARR OF ${currentValueKey} *** `,
    //   keysAndValuesSmartObjArr
    // );
    // console.log(`TRACKKKKKKKKKKK OF ${currentValueKey} *** `, trackArr);
    setTrackPreviousAndNextElementValues(trackArr);
  }

  useEffect(() => {
    let keysArr = [];

    for (let i = 0; i < ratesValuesArray?.length; i++) {
      let obj = ratesValuesArray[i];
      for (let key in obj) {
        keysArr.push(key);
      }
    }
    setProjectRatesKeys(keysArr);
    setInitialKeysAndValues();
    // console.log("RENDERRRRRRRRRRRR");
  }, [ratesValuesArray]);

  // effect for getting first and last element of table Elements arr
  useEffect(() => {
    // update table first element
    if (updatedAndOldProjectRatesValues?.length !== 0) {
      setTableFirstElement(updatedAndOldProjectRatesValues[0]);
    } else if (updatedAndNewProjectRatesValues?.length !== 0) {
      setTableFirstElement(updatedAndNewProjectRatesValues[0]);
    } else {
      setTableFirstElement(null);
    }
    // update table second element
    if (updatedAndNewProjectRatesValues?.length !== 0) {
      setTableLastElement(
        updatedAndNewProjectRatesValues[
          updatedAndNewProjectRatesValues.length - 1
        ]
      );
    } else if (updatedAndOldProjectRatesValues?.length !== 0) {
      setTableLastElement(
        updatedAndOldProjectRatesValues[
          updatedAndOldProjectRatesValues?.length - 1
        ]
      );
    } else {
      setTableLastElement(null);
    }
  }, [updatedAndOldProjectRatesValues, updatedAndNewProjectRatesValues]);

  useEffect(() => {
    // console.log(
    //   `TABLE FIRST ELEMENT OF ${currentValueKey} >>>> `,
    //   tableFirstElement
    // );
    // console.log(
    //   `TABLE LAST ELEMENT OF ${currentValueKey} >>>> `,
    //   tableLastElement
    // );
  }, [tableFirstElement, tableLastElement]);

  useEffect(() => {
    // console.log(`newKeysAndValues: >> ${currentValueKey} `, newKeysAndValues);

    if (newKeysAndValues?.length > 0) {
      let arr = updatedAndOldProjectRatesValues;
      let perfectObjArr = smartObjArrWithErrorState;
      for (let i = 0; i < newKeysAndValues?.length; i++) {
        let newData = arr.map((oldSmartObj) => {
          return oldSmartObj?.oldKey === newKeysAndValues[i]?.oldKey
            ? newKeysAndValues[i]
            : oldSmartObj;
        });
        let newPerfectData = perfectObjArr?.map((perfectObj) => {
          return perfectObj?.oldKey === newKeysAndValues[i]?.oldKey
            ? { ...newKeysAndValues[i], isError: perfectObj?.isError }
            : perfectObj;
        });
        // console.log("new data: ", newData);
        arr = [...newData];
        perfectObjArr = [...newPerfectData];
      }
      // console.log("Need Data: >>>> ", perfectObjArr);
      setUpdatedAndOldProjectRatesValues(arr);
      setSmartObjArrWithErrorState(perfectObjArr);
    }
  }, [newKeysAndValues]);

  useEffect(() => {
    // console.log(
    //   `newAddedKeysAndValues: >> ${currentValueKey} `,
    //   newAddedKeysAndValues
    // );
    if (newAddedKeysAndValues?.length > 0) {
      let arr = updatedAndNewProjectRatesValues;
      let perfectObjArr = smartObjNewAddedArrWithErrorState;
      for (let i = 0; i < newAddedKeysAndValues?.length; i++) {
        let newData = arr.map((oldSmartObj) => {
          return oldSmartObj?.tackleKey === newAddedKeysAndValues[i]?.tackleKey
            ? newAddedKeysAndValues[i]
            : oldSmartObj;
        });
        let newPerfectData = perfectObjArr?.map((perfectObj) => {
          return perfectObj?.tackleKey === newAddedKeysAndValues[i]?.tackleKey
            ? { ...newAddedKeysAndValues[i], isError: perfectObj?.isError }
            : perfectObj;
        });
        // console.log("new data: ", newData);
        arr = [...newData];
        perfectObjArr = [...newPerfectData];
      }
      setUpdatedAndNewProjectRatesValues(arr);
      setSmartObjNewAddedArrWithErrorState(perfectObjArr);
      // console.log(`Needed New array of ${currentValueKey} <> `, arr);
    }
  }, [newAddedKeysAndValues]);

  useEffect(() => {
    // console.log(
    //   `updatedAndOldProjectRatesValues: ????? ${currentValueKey}`,
    //   updatedAndOldProjectRatesValues
    // );

    let trackArr = updatedAndOldProjectRatesValues?.map((obj, i, arr) => {
      let smartObj = {};
      if (i === 0) {
        smartObj = {
          ...obj,
          isPrevElement: false,
          prevElement: null,
          nextElement:
            arr.length > 1
              ? arr[i + 1]
              : newAddedKeysAndValues?.length > 0
              ? newAddedKeysAndValues[0]
              : null,
          isNextElement: arr.length > 1 ? true : false,
        };
      } else if (i === arr.length - 1) {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement:
            newAddedKeysAndValues?.length > 0 ? newAddedKeysAndValues[0] : null,
          isNextElement: newAddedKeysAndValues?.length > 0 ? true : false,
        };
      } else {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement: arr[i + 1],
          isNextElement: true,
        };
      }
      return smartObj;
    });
    setTrackPreviousAndNextElementValues(trackArr);
  }, [updatedAndOldProjectRatesValues, newAddedKeysAndValues]);

  useEffect(() => {
    // console.log(
    //   `smartObjArrWithErrorState: ????? ${currentValueKey}`,
    //   smartObjArrWithErrorState
    // );
    // console.log(
    //   `NewAdded ErrorState: ????? ${currentValueKey}`,
    //   smartObjNewAddedArrWithErrorState
    // );
  }, [smartObjArrWithErrorState, smartObjNewAddedArrWithErrorState]);

  useEffect(() => {
    // console.log(
    //   `Next and Previous State: ????? ${currentValueKey}`,
    //   trackPreviousAndNextElementValues
    // );
    // console.log(
    //   `New Added State: ????? ${currentValueKey}`,
    //   trackNewAddedPreviousAndNextElementValues
    // );
  }, [
    trackNewAddedPreviousAndNextElementValues,
    trackPreviousAndNextElementValues,
  ]);

  useEffect(() => {
    // console.log(
    //   `changedProjectRatesKeys: >> ${currentValueKey} `,
    //   changedProjectRatesKeys
    // );
    // console.log(
    //   `newAddedProjectRatesKeys: >> ${currentValueKey}`,
    //   newAddedProjectRatesKeys
    // );
  }, [changedProjectRatesKeys, newAddedProjectRatesKeys]);

  // table element deleting fn handling
  useEffect(() => {
    if (deletedTableElements.length !== 0) {
      // console.log("deletedTableElements: ", deletedTableElements);

      let filterDataKeys = [];
      for (let i = 0; i < deletedTableElements?.length; i++) {
        if (deletedTableElements[i].isNew === false) {
          let filterElementsKeys = ratesValuesArraySS.filter((object) => {
            let objectKey = ""; //key
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                objectKey = key;
              }
            }
            return deletedTableElements[i]?.key !== objectKey;
          });
          filterDataKeys = Array.from(
            new Set([...filterDataKeys, ...filterElementsKeys])
          );
          // filtering data for showing in frontend to look like the item is got deleted
          setRatesValuesArraySS(sortKeyValuesArrayByKey(filterElementsKeys));
          // also remove that item from "newKeysAndValues" state
          let filterNewKeysAndValuesData = newKeysAndValues?.filter(
            (obj) => obj?.oldKey !== deletedTableElements[i]?.key
          );
          setNewKeysAndValues(filterNewKeysAndValuesData);
          // also remove from "changedProjectRatesKeys" state
          let filterChangedProjectRatesKeysData =
            changedProjectRatesKeys?.filter(
              (key) => key !== deletedTableElements[i]?.key
            );
          setChangedProjectRatesKeys(filterChangedProjectRatesKeysData);
          // also remove from "updatedAndOldProjectRatesValues" state
          let filterUpdateAndOldRatesValues =
            updatedAndOldProjectRatesValues?.filter(
              (obj) => obj?.oldKey !== deletedTableElements[i].key
            );
          setUpdatedAndOldProjectRatesValues(filterUpdateAndOldRatesValues);

          // remove item from "trackPreviousAndNextElementValues" state
          let filterOldTrackData = trackPreviousAndNextElementValues?.filter(
            (obj) => obj?.oldKey !== deletedTableElements[i]?.key
          );
          if (filterOldTrackData.length > 1) {
            // change before obj "nextElement" value and after obj "prevElement" value
            let newMappedTrackData = filterOldTrackData.map(
              (trackObj, i, arr) => {
                let smartObj = {};
                if (
                  trackObj?.nextElement?.oldKey === deletedTableElements[i]?.key
                ) {
                  // this condition for updating ::before element "nextElement" value
                  smartObj = {
                    ...trackObj,
                    nextElement:
                      arr.length - 1 > i
                        ? updatedAndOldProjectRatesValues[i + 1]
                        : newAddedKeysAndValues.length !== 0
                        ? newAddedKeysAndValues[0]
                        : null,
                    isNextElement:
                      arr.length - 1 > i
                        ? true
                        : newAddedKeysAndValues.length !== 0
                        ? true
                        : false,
                  };
                } else if (
                  trackObj?.prevElement?.oldKey === deletedTableElements[i]?.key
                ) {
                  // this condition for updating ::after element "prevElement" value
                  smartObj = {
                    ...trackObj,
                    prevElement:
                      updatedAndOldProjectRatesValues?.length > 1
                        ? updatedAndOldProjectRatesValues[i - 1]
                        : null,
                    isPrevElement:
                      updatedAndOldProjectRatesValues?.length > 1
                        ? true
                        : false,
                  };
                } else {
                  smartObj = trackObj;
                }
                return smartObj;
              }
            );
            setTrackPreviousAndNextElementValues(newMappedTrackData);
          } else {
            let newMappedTrackData = filterOldTrackData.map(
              (trackObj, i, arr) => {
                return {
                  ...trackObj,
                  isPrevElement: false,
                  prevElement: null,
                  isNextElement:
                    newAddedKeysAndValues?.length > 0 ? true : false,
                  nextElement:
                    newAddedKeysAndValues?.length > 0
                      ? newAddedKeysAndValues[i]
                      : null,
                };
              }
            );
            setTrackPreviousAndNextElementValues(newMappedTrackData);
          }

          // console.log("filter elem: ", filterElements)
          // console.log("rate values arr >>> : ", ratesValuesArraySS)
        } else {
          console.log("new added element got deleted.");
          let filterNewAddedElements = newAddedTableElements.filter(
            ({ tackleKey }) => {
              return deletedTableElements[i].key !== tackleKey;
            }
          );
          // filtering data for showing in frontend to look like the item is got deleted
          setNewAddedTableElements(filterNewAddedElements);
          // also remove that item from "newAddedKeysAndValues" state
          let filterNewAddedKeysAndValuesData = newAddedKeysAndValues?.filter(
            (obj) => obj?.tackleKey !== deletedTableElements[i].key
          );
          setNewAddedKeysAndValues(filterNewAddedKeysAndValuesData);
          // also remove from "newAddedProjectRatesKeys" state
          let filterNewAddedProjectRatesKeysData =
            newAddedProjectRatesKeys?.filter(
              (key) => key !== deletedTableElements[i].key
            );
          setNewAddedProjectRatesKeys(filterNewAddedProjectRatesKeysData);
          // alos remove item from "smartObjNewAddedArrWithErrorState" state
          let filterSmartNewAddedWithErrorStateData =
            smartObjNewAddedArrWithErrorState?.filter(({ tackleKey }) => {
              return deletedTableElements[i].key !== tackleKey;
            });
          setSmartObjNewAddedArrWithErrorState(
            filterSmartNewAddedWithErrorStateData
          );

          let filterUpdatedAndNewRatesValues =
            updatedAndNewProjectRatesValues?.filter((obj) => {
              return obj?.tackleKey !== deletedTableElements[i].key;
            });

          setUpdatedAndNewProjectRatesValues(filterUpdatedAndNewRatesValues);

          // remove item from "trackNewAddedPreviousAndNextElementValues" state
          // and also remove from its last obj nextElement value and set isNextElement: false,
          let filterTrackData =
            trackNewAddedPreviousAndNextElementValues?.filter(
              (obj) => obj?.tackleKey !== deletedTableElements[i]?.key
            );
          if (filterTrackData.length !== 0) {
            let mappedTrackData = filterTrackData?.map((obj, i, arr) => {
              // change previous obj of deleted obj (change ::before obj of deleted obj )
              let newObj = {};
              if (
                obj?.nextElement?.tackleKey === deletedTableElements[i]?.key
              ) {
                newObj = {
                  ...obj,
                  nextElement:
                    arr.length - 1 > i
                      ? newAddedKeysAndValues[deletedTableElements[i]?.key + 1]
                      : null,
                  isNextElement: false,
                };
              } else {
                newObj = obj;
              }
              return newObj;
            });
            setTrackNewAddedPreviousAndNextElementValues(mappedTrackData);
          } else {
            // if "trackNewAddedPreviousAndNextElementValues" state === [], then update "trackPreviousAndNextElementValues" state
            let filterOldTrackData = trackPreviousAndNextElementValues.map(
              (trackObj, i, arr) => {
                return arr.length - 1 === i
                  ? { ...trackObj, nextElement: null, isNextElement: false }
                  : trackObj;
              }
            );
            setTrackPreviousAndNextElementValues(filterOldTrackData);
            setTrackNewAddedPreviousAndNextElementValues(filterTrackData);
          }
        }
      }
      // console.log("NEW ARR: >>> ", filterData);
      // setRatesValuesArraySS(filterData);
    }
  }, [deletedTableElements]);

  const handleNewAddedTableElements = () => {
    let lastElement = {};
    // let nextElement = {};
    if (newAddedKeysAndValues?.length === 0) {
      lastElement =
        updatedAndOldProjectRatesValues[
          updatedAndOldProjectRatesValues.length - 1
        ];
    } else {
      lastElement = newAddedKeysAndValues[newAddedKeysAndValues.length - 1];
    }

    const newTableElementObj = {
      tackleKey: newAddedTableElements.length + 1,
      originalKey: lastElement?.newKey
        ? `${Number(lastElement?.newKey) + 1}`
        : "1",
      originalValue: 1,
    };
    setNewAddedTableElements((prev) => [...prev, newTableElementObj]);
    let newKeyValueObj = {
      [newTableElementObj.originalKey]: newTableElementObj.originalValue,
    };
    let smartObj = {
      tackleKey: newTableElementObj.tackleKey,
      oldKey: newTableElementObj.originalKey,
      newKey: newTableElementObj.originalKey,
      keyValueObj: newKeyValueObj,
      newElement: true,
    };
    // setNewKeysAndValues((prev) => [...prev, smartObj]);
    // setChangedProjectRatesKeys(prev=>[...prev, smartObj?.tackleKey]);
    setNewAddedKeysAndValues((prev) => [...prev, smartObj]);
    setNewAddedProjectRatesKeys((prev) => [...prev, smartObj?.tackleKey]);
    setUpdatedAndNewProjectRatesValues((prev) => [...prev, smartObj]);

    setSmartObjNewAddedArrWithErrorState((prev) => [
      ...prev,
      { ...smartObj, isError: false },
    ]);
  };
  useEffect(() => {
    let firstIndexPrevElement =
      updatedAndOldProjectRatesValues[
        updatedAndOldProjectRatesValues.length - 1
      ];
    let trackNewAddedArr = newAddedKeysAndValues?.map((obj, i, arr) => {
      let smartObj = {};
      if (i === 0) {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: firstIndexPrevElement,
          nextElement: arr.length > 1 ? arr[i + 1] : null,
          isNextElement: arr.length > 1 ? true : false,
        };
      } else if (i === arr.length - 1) {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement: null,
          isNextElement: false,
        };
      } else {
        smartObj = {
          ...obj,
          isPrevElement: true,
          prevElement: arr[i - 1],
          nextElement: arr[i + 1],
          isNextElement: true,
        };
      }
      return smartObj;
    });
    // console.log(`NewAdded Trackkkk of ${currentValueKey} `, trackNewAddedArr);
    setTrackNewAddedPreviousAndNextElementValues(trackNewAddedArr);
  }, [newAddedKeysAndValues, updatedAndOldProjectRatesValues]);

  // useEffect(() => {
  //   // whenever a new table element created then change "trackPreviousAndNextElementValues" state,
  //   // because when no new element created then it has nextElement: null and isNextElement: false
  //   let updateArr = trackPreviousAndNextElementValues.map(
  //     (trackObj, i, arr) => {
  //       return arr.length - 1 === i && newAddedKeysAndValues.length !== 0
  //         ? {
  //             ...trackObj,
  //             isNextElement: true,
  //             nextElement: newAddedKeysAndValues[0],
  //           }
  //         : newAddedKeysAndValues.length === 0
  //         ? {
  //             ...trackObj,
  //             isNextElement: false,
  //             nextElement: null,
  //           }
  //         : trackObj;
  //     }
  //   );
  //   setTrackPreviousAndNextElementValues(updateArr);
  // }, [newAddedKeysAndValues]);

  const handleSave = () => {
    setUserClickedOn("save");
    setIsEditable(false);
    // console.log(`Saved runned in >>>>>>>>>> ${currentValueKey}`);

    if (
      newKeysAndValues.length === 0 &&
      deletedTableElements.length === 0 &&
      newAddedKeysAndValues.length === 0
    ) {
      toast.success("Already updated", {
        duration: 4000,
      });
    } else {
      let oldUpdatedData =
        newKeysAndValues.length !== 0
          ? newKeysAndValues
              ?.filter((obj) => obj?.newKey)
              .map((obj) => obj?.keyValueObj)
          : [];
      let newAddedData =
        newAddedKeysAndValues.length !== 0
          ? newAddedKeysAndValues
              ?.filter((obj) => obj?.newKey)
              .map((obj) => obj?.keyValueObj)
          : [];

      // get previous data which is not updated
      let previousFilterData = ratesValuesArraySS.filter((obj) => {
        let objectKey = ""; //key
        for (const key in obj) {
          objectKey = key;
        }
        return !changedProjectRatesKeys.includes(objectKey);
      });
      // console.log("SAVEDDDDDDDDDDDDDDDDDDATA");
      // console.log("previousFilterData: >> ", previousFilterData);
      // console.log("oldUpdatedData: >> ", oldUpdatedData);
      // console.log("newAddedData: >> ", newAddedData);

      // combined both new and old data for update
      let realData = [
        ...previousFilterData,
        ...oldUpdatedData,
        ...newAddedData,
      ];

      let saveData = {
        project_rate_id: projectRateId,
        currency: currency,
        // data: {
        [originalKey]: realData,
        // },
      };
      // console.log("save data: =======>>>>>>>>>>>>>>>>>>> ", saveData);

      api
        .put("/project-rate/update", saveData, {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then(() => {
          toast.success("Saved successfuly", {
            duration: 4000,
          });
          // empty all those states which keep track of table elements
          // old updated or changed
          setNewKeysAndValues([]); // this state keep track of old states which values changed or updated
          setChangedProjectRatesKeys([]); // this state keep track of "keys" of old update or changed elements
          // new added or changed or updated
          setNewAddedTableElements([]); // this state keep track of new added table elements
          setNewAddedKeysAndValues([]); // this state keep track of new added table elements keys and values
          setNewAddedProjectRatesKeys([]); // this state keep track of new added table elements keys;
          setDeletedTableElements([]); // this state keep track of elements which user want to delete
          setInitialKeysAndValues(); // this reset "updatedAndOldProjectRatesValues" and "smartObjArrWithErrorState"
          setUpdatedAndOldProjectRatesValues(ratesOldKeysAndValues);

          setSmartObjNewAddedArrWithErrorState([]);
          setUpdatedAndNewProjectRatesValues([]);
          setTrackNewAddedPreviousAndNextElementValues([]);

          setTableFirstElement(null);
          setTableLastElement(null);
          refetch();
        })
        .catch((e) => {
          // empty all those states which keep track of table elements
          // old updated or changed
          setNewKeysAndValues([]); // this state keep track of old states which values changed or updated
          setChangedProjectRatesKeys([]); // this state keep track of "keys" of old update or changed elements
          // new added or changed or updated
          setNewAddedTableElements([]); // this state keep track of new added table elements
          setNewAddedKeysAndValues([]); // this state keep track of new added table elements keys and values
          setNewAddedProjectRatesKeys([]); // this state keep track of new added table elements keys;
          setDeletedTableElements([]); // this state keep track of elements which user want to delete
          setInitialKeysAndValues(); // this reset "updatedAndOldProjectRatesValues" and "smartObjArrWithErrorState"
          setUpdatedAndOldProjectRatesValues(ratesOldKeysAndValues);

          setSmartObjNewAddedArrWithErrorState([]);
          setUpdatedAndNewProjectRatesValues([]);
          setTrackNewAddedPreviousAndNextElementValues([]);

          setTableFirstElement(null);
          setTableLastElement(null);
          console.log(e);
          toast.error("Something went wrong\nPlease try again", {
            duration: 4000,
          });
          refetch();
        });
    }

    // fake promise for debugging
    // let savePromise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve("done");
    //   }, 500);
    // });
    // savePromise
    //   .then(() => {
    //     toast.success("Saved successfuly", {
    //       duration: 4000,
    //     });
    //     setUserClickedOn("");
    //     setNewKeysAndValues([]);
    //   })
    //   .catch(() => {
    //     setUserClickedOn("");
    //     setNewKeysAndValues([]);
    //   });
  };
  const handleCancel = () => {
    // empty this state on cancel
    setRatesValuesArraySS(sortKeyValuesArrayByKey(ratesValuesArray));
    setUserClickedOn("cancel");

    // empty all those states which keep track of table elements
    // old updated or changed
    setNewKeysAndValues([]); // this state keep track of old states which values changed or updated
    setChangedProjectRatesKeys([]); // this state keep track of "keys" of old update or changed elements

    setInitialKeysAndValues(); // this reset "updatedAndOldProjectRatesValues" and "smartObjArrWithErrorState"

    // new added or changed or updated
    setNewAddedTableElements([]); // this state keep track of new added table elements
    setNewAddedKeysAndValues([]); // this state keep track of new added table elements keys and values
    setNewAddedProjectRatesKeys([]); // this state keep track of new added table elements keys;
    setDeletedTableElements([]); // this state keep track of elements which user want to delete
    setSmartObjNewAddedArrWithErrorState([]); // this state keep track of new added element error state
    setUpdatedAndNewProjectRatesValues([]); // this state keep track of new added elements keys and values
    setTrackNewAddedPreviousAndNextElementValues([]); // this state keep track of new added elements prevElement and nextElement

    setTableFirstElement(null);
    setTableLastElement(null);

    setIsEditable(false);

    let savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 200);
    });
    savePromise
      .then(() => {
        setUserClickedOn("");
      })
      .catch(() => {
        setUserClickedOn("");
      });
  };

  return (
    <div className={styles.rateTableBoxWrapper}>
      {isEditable ? (
        <div className={styles.header}>
          <button className="btnNeutral btn--medium" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="btnPrimary btn--medium"
            onClick={handleSave}
            // disabled={
            //   isAnyKeyValueInvalidOfArr(smartObjArrWithErrorState)
            //   // ||
            //   // isAnyKeyValueInvalidOfArr(smartObjNewAddedArrWithErrorState)
            // }
          >
            <AiFillSave />
            Save
          </button>
        </div>
      ) : (
        <div className={styles.header}>
          <h3>{currentValueKey}</h3>
          <button
            className="btnDark btn--medium"
            onClick={() => setIsEditable(true)}
          >
            <AiFillEdit />
            Edit
          </button>
        </div>
      )}
      <div className={tableStyles.rateTableWrapper} data-editable={isEditable}>
        <div className={tableStyles.tableHead}>
          <div className={tableStyles.column1}>
            <div className={tableStyles.tableHeadCell}>{currentValueKey}</div>
          </div>
          <div className={tableStyles.column2}>
            <div className={tableStyles.tableHeadCell}>
              Price <span>({currency})</span>
            </div>
          </div>
        </div>
        <div className={tableStyles.tableBody}>
          {ratesValuesArraySS?.length !== 0 ? (
            ratesValuesArraySS?.map((object, i) => {
              let objectKey = ""; //key
              let objectValue = ""; // value
              for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                  objectKey = key;
                  objectValue = object[key];
                }
              }
              // console.log(`pages: ${pages}\nprice: ${price}`)
              return (
                <TableInputCell
                  key={i}
                  currentValueKey={currentValueKey}
                  objectKey={objectKey}
                  objectValue={objectValue}
                  isEditable={isEditable}
                  newKeysAndValues={newKeysAndValues}
                  setNewKeysAndValues={setNewKeysAndValues}
                  userClickedOn={userClickedOn}
                  setChangedProjectRatesKeys={setChangedProjectRatesKeys}
                  changedProjectRatesKeys={changedProjectRatesKeys}
                  setDeletedTableElements={setDeletedTableElements}
                  projectRatesKeys={projectRatesKeys}
                  updatedAndOldProjectRatesValues={
                    updatedAndOldProjectRatesValues
                  }
                  setUpdatedAndOldProjectRatesValues={
                    setUpdatedAndOldProjectRatesValues
                  }
                  updatedAndNewProjectRatesValues={
                    updatedAndNewProjectRatesValues
                  }
                  setUpdatedAndNewProjectRatesValues={
                    setUpdatedAndNewProjectRatesValues
                  }
                  smartObjArrWithErrorState={smartObjArrWithErrorState}
                  setSmartObjArrWithErrorState={setSmartObjArrWithErrorState}
                  trackPreviousAndNextElementValues={
                    trackPreviousAndNextElementValues
                  }
                  tableFirstElement={tableFirstElement}
                  tableLastElement={tableLastElement}
                />
              );
            })
          ) : (
            <h3 style={{ marginTop: "2rem" }}>No data available</h3>
          )}
          {newAddedTableElements.length !== 0
            ? newAddedTableElements.map(
                ({ originalKey, originalValue, tackleKey }, i) => {
                  return (
                    <TableInputCell
                      key={i}
                      tackleKey={tackleKey}
                      currentValueKey={currentValueKey}
                      objectKey={originalKey}
                      objectValue={originalValue}
                      isEditable={isEditable}
                      newKeysAndValues={newKeysAndValues}
                      setNewKeysAndValues={setNewKeysAndValues}
                      userClickedOn={userClickedOn}
                      changedProjectRatesKeys={changedProjectRatesKeys}
                      setChangedProjectRatesKeys={setChangedProjectRatesKeys}
                      newAddedProjectRatesKeys={newAddedProjectRatesKeys}
                      setNewAddedProjectRatesKeys={setNewAddedProjectRatesKeys}
                      newAddedKeysAndValues={newAddedKeysAndValues}
                      setNewAddedKeysAndValues={setNewAddedKeysAndValues}
                      setDeletedTableElements={setDeletedTableElements}
                      projectRatesKeys={projectRatesKeys}
                      updatedAndOldProjectRatesValues={
                        updatedAndOldProjectRatesValues
                      }
                      setUpdatedAndOldProjectRatesValues={
                        setUpdatedAndOldProjectRatesValues
                      }
                      smartObjArrWithErrorState={smartObjArrWithErrorState}
                      setSmartObjArrWithErrorState={
                        setSmartObjArrWithErrorState
                      }
                      updatedAndNewProjectRatesValues={
                        updatedAndNewProjectRatesValues
                      }
                      setUpdatedAndNewProjectRatesValues={
                        setUpdatedAndNewProjectRatesValues
                      }
                      smartObjNewAddedArrWithErrorState={
                        smartObjNewAddedArrWithErrorState
                      }
                      setSmartObjNewAddedArrWithErrorState={
                        setSmartObjNewAddedArrWithErrorState
                      }
                      trackNewAddedPreviousAndNextElementValues={
                        trackNewAddedPreviousAndNextElementValues
                      }
                      tableFirstElement={tableFirstElement}
                      tableLastElement={tableLastElement}
                    />
                  );
                }
              )
            : null}
          {isEditable ? (
            <button
              className={styles.addNewFieldButton}
              aria-label="Add new field"
              role="button"
              onClick={handleNewAddedTableElements}
            >
              <MdOutlineAdd /> Add new field
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

{
  /* <div key={i} className={tableStyles.tableRow}>
  <div className={tableStyles.column1}>
    <div className={tableStyles.tableBodyCell}>{pages}</div>
  </div>
  <div className={tableStyles.column2}>
    <div className={tableStyles.tableBodyCell}>
      <input
        ref={inputRef}
        type="text"
        //   defaultValue={price}
        value={priceInput || price}
        data-editable={isEditable}
        readOnly={!isEditable}
        onChange={(e) => setPriceInput(e.target.value)}
      />
    </div>
  </div>
</div>; */
}
