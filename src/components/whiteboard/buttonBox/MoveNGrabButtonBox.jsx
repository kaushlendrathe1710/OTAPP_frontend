import React from "react";
import ActionButton from "../utils/actionButton";
import ButtonBoxLayout from "../utils/buttonBoxLayout";
import { BUTTONS } from "../../../context/boardContext";
import { BsCursor } from "react-icons/bs";
import { TbHandStop } from "react-icons/tb";

const MoveNGrabButtonBox = ({ selectedBtn, setSelectedBtn }) => {
    function selectClickHandler() {
        setSelectedBtn(BUTTONS.SELECT.SELECT);
    }
    function grabClickHandler() {
        setSelectedBtn(BUTTONS.SELECT.MOVE);
    }

    return (
        <ButtonBoxLayout>
            <ActionButton buttonName={BUTTONS.SELECT.SELECT} onClick={selectClickHandler} selectedBtn={selectedBtn}>
                <BsCursor />
            </ActionButton>
            <ActionButton buttonName={BUTTONS.SELECT.MOVE} onClick={grabClickHandler} selectedBtn={selectedBtn}>
                <TbHandStop />
            </ActionButton>
        </ButtonBoxLayout>
    );
};

export default MoveNGrabButtonBox;
