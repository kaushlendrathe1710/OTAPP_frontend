import React from "react";
// import buttonBoxStyles from './buttonBox.module.css';
import { BsCircle, BsDiamond, BsTriangle, BsHexagon } from "react-icons/bs";
import { BiRectangle } from "react-icons/bi";
import ButtonBoxLayout from "../utils/buttonBoxLayout";
import ActionButton from "../utils/actionButton";
import { BUTTONS } from "../../../context/boardContext";

const ShapeButtonBox = ({ selectedBtn, setSelectedBtn }) => {
    function rectangleClickHanlder() {
        setSelectedBtn(BUTTONS.SHAPES.RECTANGLE);
    }
    function circleClickHanlder() {
        setSelectedBtn(BUTTONS.SHAPES.CIRCLE);
    }
    function triangleClickHanlder() {
        setSelectedBtn(BUTTONS.SHAPES.TRIANGLE);
    }
    function diamondClickHanlder() {
        setSelectedBtn(BUTTONS.SHAPES.DIAMOND);
    }
    function hexagonClickHanlder() {
        setSelectedBtn(BUTTONS.SHAPES.HEXAGON);
    }

    return (
        <ButtonBoxLayout>
            <ActionButton onClick={circleClickHanlder} buttonName={BUTTONS.SHAPES.CIRCLE} selectedBtn={selectedBtn}>
                <BsCircle />
            </ActionButton>

            <ActionButton onClick={rectangleClickHanlder} buttonName={BUTTONS.SHAPES.RECTANGLE} selectedBtn={selectedBtn}>
                <BiRectangle />
            </ActionButton>

            <ActionButton onClick={triangleClickHanlder} buttonName={BUTTONS.SHAPES.TRIANGLE} selectedBtn={selectedBtn}>
                <BsTriangle />
            </ActionButton>

            <ActionButton onClick={diamondClickHanlder} buttonName={BUTTONS.SHAPES.DIAMOND} selectedBtn={selectedBtn}>
                <BsDiamond />
            </ActionButton>

            <ActionButton onClick={hexagonClickHanlder} buttonName={BUTTONS.SHAPES.HEXAGON} selectedBtn={selectedBtn}>
                <BsHexagon />
            </ActionButton>
        </ButtonBoxLayout>
    );
};

export default ShapeButtonBox;
