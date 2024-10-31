import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { TfiArrowsCorner } from "react-icons/tfi";
import { HiOutlineMinus } from "react-icons/hi";
import { BUTTONS } from "../../../context/boardContext";
import ButtonBoxLayout from "../utils/buttonBoxLayout";
import ActionButton from "../utils/actionButton";

const LinesButtonBox = ({ selectedBtn, setSelectedBtn }) => {
    function lineClickHanlder() {
        setSelectedBtn(BUTTONS.LINE.SIMPLE);
    }
    function oneArrowClickHanlder() {
        setSelectedBtn(BUTTONS.LINE.ONE_ARROW);
    }
    function twoArrowClickHanlder() {
        setSelectedBtn(BUTTONS.LINE.TWO_ARROW);
    }
    return (
        <ButtonBoxLayout>
            <ActionButton onClick={lineClickHanlder} buttonName={BUTTONS.LINE.SIMPLE} selectedBtn={selectedBtn}>
                <HiOutlineMinus style={{ transform: "rotate(-45deg)" }} />
            </ActionButton>

            <ActionButton onClick={oneArrowClickHanlder} buttonName={BUTTONS.LINE.ONE_ARROW} selectedBtn={selectedBtn}>
                <BsArrowUpRight />
            </ActionButton>

            <ActionButton onClick={twoArrowClickHanlder} buttonName={BUTTONS.LINE.TWO_ARROW} selectedBtn={selectedBtn}>
                <TfiArrowsCorner style={{ transform: "rotate(90deg)" }} />
            </ActionButton>
        </ButtonBoxLayout>
    );
};

export default LinesButtonBox;
