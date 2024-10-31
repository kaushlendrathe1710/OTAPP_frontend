import React from 'react';
import { BUTTONS, STROKE_SIZES } from '../context/boardContext';
import ActionButton from '../utils/actionButton';
import ButtonBoxLayout from '../utils/buttonBoxLayout';
import { MdOutlineShowChart } from 'react-icons/md'
import { TbPencil } from 'react-icons/tb'
import { RiMarkPenLine } from 'react-icons/ri'

const PencilBox = ({ selectedBtn, setSelectedBtn, selectedStrokeSize, setSelectedStrokeSize }) => {

    
    function pencilClickHandler() {
        setSelectedBtn(BUTTONS.DRAW.PENCIL)
    }
    function highlighterClickHandler() {
        setSelectedBtn(BUTTONS.DRAW.HIGHLIGHTER)
    }
    function strokeThinClickHandler() {
        setSelectedStrokeSize(STROKE_SIZES.STROKE_THIN)
    }
    function strokeMidClickHandler() {
        setSelectedStrokeSize(STROKE_SIZES.STROKE_MID)
    }
    function strokeThickClickHandler() {
        setSelectedStrokeSize(STROKE_SIZES.STROKE_THICK)
    }
    
    return (
        <ButtonBoxLayout >
            <ActionButton
                buttonName={BUTTONS.DRAW.PENCIL}
                onClick={pencilClickHandler}
                selectedBtn={selectedBtn}
            >
                <TbPencil />
            </ActionButton>
            <ActionButton
                buttonName={BUTTONS.DRAW.HIGHLIGHTER}
                onClick={highlighterClickHandler}
                selectedBtn={selectedBtn}
            >
                <RiMarkPenLine />
            </ActionButton>
            <ActionButton
                buttonName={STROKE_SIZES.STROKE_THIN}
                onClick={strokeThinClickHandler}
                selectedBtn={selectedStrokeSize}
            >
                <MdOutlineShowChart size={'0.8em'} />
            </ActionButton>
            <ActionButton
                buttonName={STROKE_SIZES.STROKE_MID}
                onClick={strokeMidClickHandler}
                selectedBtn={selectedStrokeSize}
            >
                <MdOutlineShowChart size={'1em'} />
            </ActionButton>
            <ActionButton
                buttonName={STROKE_SIZES.STROKE_THICK}
                onClick={strokeThickClickHandler}
                selectedBtn={selectedStrokeSize}
                
            >
                <MdOutlineShowChart size={'1.2em'} strokeLinecap={'round'} />
            </ActionButton>
        </ButtonBoxLayout>
    );
}

export default PencilBox;
