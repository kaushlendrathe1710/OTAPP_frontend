import React, { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import tableStyles from "../../../../../styles/table.module.scss";

export const TableInputCell = ({
  currentValueKey,
  objectKey,
  objectValue,
  isEditable,
  newKeysAndValues,
  setNewKeysAndValues,
  userClickedOn,
  tackleKey,
  setChangedProjectRatesKeys,
  setDeletedTableElements,
  changedProjectRatesKeys,
  newAddedProjectRatesKeys,
  setNewAddedProjectRatesKeys,
  newAddedKeysAndValues,
  setNewAddedKeysAndValues,
  projectRatesKeys,
  updatedAndOldProjectRatesValues,
  setUpdatedAndOldProjectRatesValues,
  smartObjArrWithErrorState,
  setSmartObjArrWithErrorState,
  updatedAndNewProjectRatesValues,
  setUpdatedAndNewProjectRatesValues,
  smartObjNewAddedArrWithErrorState,
  setSmartObjNewAddedArrWithErrorState,
  trackPreviousAndNextElementValues,
  trackNewAddedPreviousAndNextElementValues,
  tableFirstElement,
  tableLastElement,
}) => {
  let inputKeyRef = useRef();
  let inputValueRef = useRef();

  const [inputKey, setInputKey] = useState(objectKey);
  const [inputValue, setInputValue] = useState(objectValue);

  // error states
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // setNewKeysAndValues()
    if (userClickedOn === "cancel") {
      console.log("user clicked on cancel");
      // inputKeyRef.current.value = objectKey;
      // inputValueRef.current.value = objectValue;
      setInputKey(objectKey);
      setInputValue(objectValue);
      setIsError(false);
      setErrorMessage("");
    }
  }, [userClickedOn]);

  useEffect(() => {
    setInputKey(objectKey);
    setInputValue(objectValue);
  }, [objectKey, objectValue]);

  useEffect(() => {
    if (inputKey !== objectKey || inputValue !== objectValue) {
      // if (inputKey !== "" && inputValue !== "") {
      // if (true) {
      let newKeyValueObj = {
        [inputKey]: inputValue,
      };
      // console.log("keyValue Obj: ", newKeyValueObj);
      if (!tackleKey) {
        let smartObj = {
          oldKey: objectKey,
          newKey: inputKey,
          keyValueObj: newKeyValueObj,
          newElement: false,
        };
        let newKeys = [];
        setChangedProjectRatesKeys((prev) => {
          newKeys = Array.from(new Set([...prev, smartObj.oldKey]));
          // console.log(`changed &&&&&&&&&&&&&&&&&&&&&&&& keys: >>> ${currentValueKey}`, newKeys);
          return newKeys;
        });
        setNewKeysAndValues((prev) => {
          let myArr = [...prev, smartObj];
          // get last changed state of current smartObj with the help of objectKey
          // console.log(`myArr: $$$$ ${currentValueKey}`, myArr);
          // console.log(`newKeys: $$$$ ${currentValueKey}`, newKeys);
          let newArr = [];
          for (let i = 0; i < newKeys?.length; i++) {
            let filterAllCurrentStates = myArr.filter(
              (obj) => obj?.oldKey === newKeys[i]
            );
            let lastChangedState =
              filterAllCurrentStates[filterAllCurrentStates.length - 1];
            if (lastChangedState) {
              newArr.push(lastChangedState);
            }
          }
          //  console.log(`newArr: $$$$ ${currentValueKey}`, newArr);
          return [...newArr];
        });
      } else {
        let smartObj = {
          tackleKey: tackleKey,
          oldKey: objectKey,
          newKey: inputKey,
          keyValueObj: newKeyValueObj,
          newElement: true,
        };
        let newKeys = [];
        setNewAddedProjectRatesKeys((prev) => {
          newKeys = Array.from(new Set([...prev, smartObj.tackleKey]));
          return newKeys;
        });
        setNewAddedKeysAndValues((prev) => {
          let myArr = [...prev, smartObj];
          // get last changed state of current smartObj with the help of tackleKey
          let newArr = [];
          for (let i = 0; i < newKeys?.length; i++) {
            let filterAllCurrentStates = myArr.filter(
              (obj) => obj?.tackleKey === newKeys[i]
            );
            let lastChangedState =
              filterAllCurrentStates[filterAllCurrentStates.length - 1];
            newArr.push(lastChangedState);
          }
          return [...newArr];
        });
      }
      // console.log(smartObj);
    } else {
      if (newKeysAndValues?.length !== 0 && !tackleKey) {
        let filterNewKeysAndValuesData = newKeysAndValues.filter(
          (smartObj) => smartObj.oldKey !== inputKey
        );
        let filterChangedProjectRatesKeysData = changedProjectRatesKeys.filter(
          (key) => key !== inputKey
        );
        // console.log(`Meaning full filter **** ${currentValueKey}  `, filterNewKeysAndValuesData);
        setNewKeysAndValues(filterNewKeysAndValuesData);
        setChangedProjectRatesKeys(filterChangedProjectRatesKeysData);

        // also update element in "updatedAndOldProjectRatesValues" state
        const updateArr = updatedAndOldProjectRatesValues?.map((smartObj) => {
          let newSmartObj = {
            oldKey: inputKey,
            newKey: inputKey,
            newElement: false,
            keyValueObj: { [inputKey]: inputValue },
          };
          return smartObj?.oldKey === inputKey ? newSmartObj : smartObj;
        });
        setUpdatedAndOldProjectRatesValues(updateArr);

        const updatePerfectObjArr = smartObjArrWithErrorState?.map(
          (perfectObj) => {
            let newPerfectObj = {
              oldKey: inputKey,
              newKey: inputKey,
              newElement: false,
              keyValueObj: { [inputKey]: inputValue },
              isError: perfectObj?.isError,
            };
            return perfectObj?.oldKey === inputKey ? newPerfectObj : perfectObj;
          }
        );
        setSmartObjArrWithErrorState(updatePerfectObjArr);
      } else if (tackleKey && newAddedKeysAndValues?.length !== 0) {
      }
      // else if(newAddedKeysAndValues?.length !== 0 && tackleKey){
      // let filterNewAddedKeysAndValuesData = newAddedKeysAndValues.filter(
      //   (smartObj) => smartObj.oldKey !== inputKey
      // );
      // }
    }

    // console.log("single input type: ", typeof(inputKey))

    // console.log("allUpdatedAndOldKeys: >> ", allUpdatedAndOldKeys);
  }, [inputKey, inputValue]);

  // handle errors effect
  useEffect(() => {
    // get track of only keys here
    let allUpdatedAndOldKeys = updatedAndOldProjectRatesValues?.map(
      (smartObj) => smartObj?.newKey
    );
    // check if any key occur more than one time
    let filterKeys = allUpdatedAndOldKeys?.filter((key) => key === inputKey);
    // get track of new added elements keys
    let allNewAddedKeys = updatedAndNewProjectRatesValues?.map(
      (smartObj) => smartObj?.newKey
    );
    let filterNewKeys =
      allNewAddedKeys?.filter((key) => key === inputKey) || [];

    let combineAllKeys = [...filterKeys, ...filterNewKeys];

    // if (inputKey !== objectKey) {
    if (true) {
      if (!tackleKey) {
        // get previous and next element
        let trackFilterElement = trackPreviousAndNextElementValues?.filter(
          (obj) => obj.newKey === inputKey
        );
        let prevElement = trackFilterElement[0]?.isPrevElement
          ? trackFilterElement[0]?.prevElement
          : null;
        let nextElement = trackFilterElement[0]?.isNextElement
          ? trackFilterElement[0]?.nextElement
          : null;

        // console.log(`Trackkkk ----> ${inputKey} `, trackFilterElement);
        // console.log(`Trackkkk Prev ----> ${currentValueKey} `, prevElement);
        if (Number(inputKey) === 0) {
          setIsError(true);
          setErrorMessage("Key value can't be Zero or Empty");
          // update "isError" in smartObjArrWithErrorState
          let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
            return perfectObj?.newKey === inputKey
              ? { ...perfectObj, isError: true }
              : perfectObj;
          });
          // console.log(`updateArr in ${currentValueKey} ===> `, updateArr);
          setSmartObjArrWithErrorState(updateArr);
        } else if (combineAllKeys?.length > 1) {
          setIsError(true);
          setErrorMessage("Key value can't be same");
          // console.log(`**data overlaping in ${inputKey}**`);
          let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
            return perfectObj?.newKey === inputKey
              ? { ...perfectObj, isError: true }
              : perfectObj;
          });
          // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
          setSmartObjArrWithErrorState(updateArr);
        } else if (
          prevElement &&
          Number(inputKey) < Number(prevElement?.newKey)
        ) {
          // condition: if user type lower key value than previous element key value
          // if (Number(inputKey) < Number(prevElement?.newKey)) {
          // console.log(`KEY VALUE MUST GREATER THAN PREVIOUS ELEMENT KEY VALUE`);
          setIsError(true);
          setErrorMessage(
            "Key value can't be smaller than previous key element"
          );
          let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
            return perfectObj?.newKey === inputKey
              ? { ...perfectObj, isError: true }
              : perfectObj;
          });
          // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
          setSmartObjArrWithErrorState(updateArr);
          // }
        } else if (
          nextElement &&
          Number(inputKey) > Number(nextElement?.newKey)
        ) {
          // condition: if user type higher key value than next element key value
          // if (Number(inputKey) > Number(nextElement?.newKey)) {
          // console.log(`KEY VALUE MUST LOWER THAN NEXT ELEMENT KEY VALUE`);
          setIsError(true);
          setErrorMessage("Key value can't be greater than next key element");
          let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
            return perfectObj?.newKey === inputKey
              ? { ...perfectObj, isError: true }
              : perfectObj;
          });
          // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
          setSmartObjArrWithErrorState(updateArr);
          // }
        } else {
          // console.log(`IIIIII RUNNNNNNNNN ${objectKey}`)
          setIsError(false);
          setErrorMessage("");
          let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
            return perfectObj?.newKey === inputKey
              ? { ...perfectObj, isError: false }
              : perfectObj;
          });
          // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
          setSmartObjArrWithErrorState(updateArr);
        }
      } else if (tackleKey) {
        // get previous and next element
        let trackFilterElement =
          trackNewAddedPreviousAndNextElementValues?.filter(
            (obj) => obj.newKey === inputKey
          );
        let prevElement = trackFilterElement[0]?.isPrevElement
          ? trackFilterElement[0]?.prevElement
          : null;
        let nextElement = trackFilterElement[0]?.isNextElement
          ? trackFilterElement[0]?.nextElement
          : null;
        if (Number(inputKey) === 0) {
          setIsError(true);
          setErrorMessage("Key value can't be Zero or Empty");
          let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
            (perfectObj) => {
              return perfectObj?.newKey === inputKey
                ? { ...perfectObj, isError: true }
                : perfectObj;
            }
          );
          // console.log(`newAddedUpdateArr in ${currentValueKey} ===> `, newAddedUpdateArr)
          // console.log(
          //   `**Data field Zero** in <tackelKey> ${currentValueKey} ===> `
          // );
          setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
        } else if (combineAllKeys?.length > 1) {
          setIsError(true);
          setErrorMessage("Key value can't be same");
          // console.log(`**data overlaping in ${currentValueKey}**`);
          let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
            (perfectObj) => {
              return perfectObj?.newKey === inputKey
                ? { ...perfectObj, isError: true }
                : perfectObj;
            }
          );
          setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
        } else if (
          prevElement &&
          Number(inputKey) < Number(prevElement?.newKey)
        ) {
          // condition: if user type higher key value than next element key value
          // if (Number(inputKey) > Number(nextElement?.newKey)) {
          // console.log(`KEY VALUE MUST GREATER THAN PREVIOUS ELEMENT KEY VALUE`);
          setIsError(true);
          setErrorMessage(
            "Key value can't be smaller than previous key element"
          );
          let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
            (perfectObj) => {
              return perfectObj?.newKey === inputKey
                ? { ...perfectObj, isError: true }
                : perfectObj;
            }
          );
          setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
          // }
        } else if (
          nextElement &&
          Number(inputKey) > Number(nextElement?.newKey)
        ) {
          // condition: if user type higher key value than next element key value
          // if (Number(inputKey) > Number(nextElement?.newKey)) {
          // console.log(`KEY VALUE MUST LOWER THAN NEXT ELEMENT KEY VALUE`);
          setIsError(true);
          setErrorMessage("Key value can't be greater than next key element");
          let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
            (perfectObj) => {
              return perfectObj?.newKey === inputKey
                ? { ...perfectObj, isError: true }
                : perfectObj;
            }
          );
          setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
          // }
        } else {
          setIsError(false);
          setErrorMessage("");
          let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
            (perfectObj) => {
              return perfectObj?.newKey === inputKey
                ? { ...perfectObj, isError: false }
                : perfectObj;
            }
          );
          setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
        }
      }
    }
    //  else if (inputKey === objectKey) {
    //   console.log(`IIIIIIIIIIIIIIIIIIIIIIIIIII  OF ${inputKey}`);
    //   // setIsError(false);
    //   // setErrorMessage("");
    //   let trackFilterElement = trackPreviousAndNextElementValues?.filter(
    //     (obj) => obj.newKey === inputKey
    //   );
    //   let prevElement = trackFilterElement[0]?.isPrevElement
    //     ? trackFilterElement[0]?.prevElement
    //     : null;
    //   let nextElement = trackFilterElement[0]?.isNextElement
    //     ? trackFilterElement[0]?.nextElement
    //     : null;
    //   if (!tackleKey) {
    //     if (combineAllKeys?.length > 1) {
    //       setIsError(true);
    //       setErrorMessage("Key value can't be same");
    //       console.log(`**data overlaping in ${currentValueKey}**`);
    //       let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
    //         return perfectObj?.newKey === inputKey
    //           ? { ...perfectObj, isError: true }
    //           : perfectObj;
    //       });
    //       // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
    //       setSmartObjArrWithErrorState(updateArr);
    //     } else if (
    //       prevElement &&
    //       Number(inputKey) < Number(prevElement?.newKey)
    //     ) {
    //       // condition: if user type lower key value than previous element key value
    //       // if (Number(inputKey) < Number(prevElement?.newKey)) {
    //       console.log(`KEY VALUE MUST GREATER THAN PREVIOUS ELEMENT KEY VALUE`);
    //       setIsError(true);
    //       setErrorMessage(
    //         "Key value can't be smaller than previous key element"
    //       );
    //       let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
    //         return perfectObj?.newKey === inputKey
    //           ? { ...perfectObj, isError: true }
    //           : perfectObj;
    //       });
    //       // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
    //       setSmartObjArrWithErrorState(updateArr);
    //       // }
    //     } else if (
    //       nextElement &&
    //       Number(inputKey) > Number(nextElement?.newKey)
    //     ) {
    //       // condition: if user type higher key value than next element key value
    //       // if (Number(inputKey) > Number(nextElement?.newKey)) {
    //       console.log(`KEY VALUE MUST LOWER THAN NEXT ELEMENT KEY VALUE`);
    //       setIsError(true);
    //       setErrorMessage("Key value can't be greater than next key element");
    //       let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
    //         return perfectObj?.newKey === inputKey
    //           ? { ...perfectObj, isError: true }
    //           : perfectObj;
    //       });
    //       // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
    //       setSmartObjArrWithErrorState(updateArr);
    //       // }
    //     } else {
    //       setIsError(false);
    //       setErrorMessage("");
    //       let updateArr = smartObjArrWithErrorState?.map((perfectObj) => {
    //         return perfectObj?.newKey === inputKey
    //           ? { ...perfectObj, isError: false }
    //           : perfectObj;
    //       });
    //       // console.log(`updateArr in ${currentValueKey} ===> `, updateArr)
    //       setSmartObjArrWithErrorState(updateArr);
    //     }
    //   } else if (tackleKey) {
    //     if (combineAllKeys?.length > 1) {
    //       setIsError(true);
    //       setErrorMessage("Key value can't be same");
    //       console.log(`**data overlaping in ${currentValueKey}**`);
    //       let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
    //         (perfectObj) => {
    //           return perfectObj?.newKey === inputKey
    //             ? { ...perfectObj, isError: true }
    //             : perfectObj;
    //         }
    //       );
    //       setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
    //     }
    //     else if (
    //       prevElement &&
    //       Number(inputKey) < Number(prevElement?.newKey)
    //     ) {
    //       // condition: if user type higher key value than next element key value
    //       // if (Number(inputKey) > Number(nextElement?.newKey)) {
    //       console.log(`KEY VALUE MUST GREATER THAN PREVIOUS ELEMENT KEY VALUE`);
    //       setIsError(true);
    //       setErrorMessage(
    //         "Key value can't be smaller than previous key element"
    //       );
    //       let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
    //         (perfectObj) => {
    //           return perfectObj?.newKey === inputKey
    //             ? { ...perfectObj, isError: true }
    //             : perfectObj;
    //         }
    //       );
    //       setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
    //       // }
    //     } else if (
    //       nextElement &&
    //       Number(inputKey) > Number(nextElement?.newKey)
    //     ) {
    //       // condition: if user type higher key value than next element key value
    //       // if (Number(inputKey) > Number(nextElement?.newKey)) {
    //       console.log(`KEY VALUE MUST LOWER THAN NEXT ELEMENT KEY VALUE`);
    //       setIsError(true);
    //       setErrorMessage("Key value can't be greater than next key element");
    //       let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
    //         (perfectObj) => {
    //           return perfectObj?.newKey === inputKey
    //             ? { ...perfectObj, isError: true }
    //             : perfectObj;
    //         }
    //       );
    //       setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
    //       // }
    //     } else {
    //       setIsError(false);
    //       setErrorMessage("");
    //       let newAddedUpdateArr = smartObjNewAddedArrWithErrorState?.map(
    //         (perfectObj) => {
    //           return perfectObj?.tackleKey === tackleKey
    //             ? { ...perfectObj, isError: false }
    //             : perfectObj;
    //         }
    //       );
    //       setSmartObjNewAddedArrWithErrorState(newAddedUpdateArr);
    //     }
    //   }
    // }
  }, [
    inputKey,
    inputValue,
    updatedAndOldProjectRatesValues,
    updatedAndNewProjectRatesValues,
    trackPreviousAndNextElementValues,
    trackNewAddedPreviousAndNextElementValues,
  ]);

  const handleKeyChange = (e) => {
    setInputKey(inputKeyRef.current.value);
  };
  const handleValueChange = (e) => {
    setInputValue(inputValueRef.current.value);
  };

  const handleDelete = () => {
    if (!tackleKey) {
      let obj = {
        key: objectKey,
        isNew: false,
      };
      setDeletedTableElements((prev) => [...prev, obj]);
    } else {
      let obj = {
        key: tackleKey,
        isNew: true,
      };
      setDeletedTableElements((prev) => [...prev, obj]);
    }
  };

  return (
    <div className={tableStyles.tableRow}>
      <div className={tableStyles.column1}>
        <div className={tableStyles.tableBodyCell}>
          {tableFirstElement?.newKey === inputKey &&
          tableLastElement?.newKey === inputKey ? (
            <span data-type="highlight">Above</span>
          ) : tableFirstElement?.newKey === inputKey &&
            tableLastElement?.newKey !== inputKey ? (
            <span data-type="highlight">Below</span>
          ) : tableLastElement?.newKey === inputKey &&
            tableFirstElement?.newKey !== inputKey ? (
            <span data-type="highlight">Above</span>
          ) : null}
          <input
            ref={inputKeyRef}
            type="number"
            // defaultValue={objectKey}
            value={inputKey}
            data-editable={isEditable}
            readOnly={!isEditable}
            onChange={handleKeyChange}
            min="1"
            data-error={isError}
          />
          {isError ? (
            <div className={tableStyles.errorTooltip}>
              {errorMessage || "You write something wrong"}
            </div>
          ) : null}
        </div>
      </div>
      <div className={tableStyles.column2}>
        <div className={tableStyles.tableBodyCell}>
          <input
            ref={inputValueRef}
            type="text"
            // defaultValue={objectValue}
            value={inputValue}
            data-editable={isEditable}
            readOnly={!isEditable}
            onChange={handleValueChange}
          />
          {isEditable ? (
            <button
              disabled={!isEditable}
              role="button"
              aria-label="delete-cell"
              title="Delete"
              onClick={handleDelete}
            >
              <AiFillDelete />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
