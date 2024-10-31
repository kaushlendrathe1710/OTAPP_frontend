import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const SCROLL_DIRECTIONS = { forward: "FORWARD", backward: "BACKWARD" }; // forward => user scroll to top, backward => user scroll to bottom

function getListFullHeight(numberOfItems, itemSize, gutterSize, bottomPadding) {
    return numberOfItems * (itemSize + gutterSize) + bottomPadding + 4;
}

const List = ({
    data = [],
    renderItem,
    keyExtractor,
    itemSize = 70,
    gutterSize = 4,
    bottomPadding = 126,
    endReachedThreshold = 0.5,
    className = "",
    onEndReached = async () => {},
    ListHeaderComponent = () => {},
    ListFooterComponent = () => {},
    ListEmptyComponent = () => {},
    onMouseLeave = () => {},
    listStyle = {},
}) => {
    const listRef = useRef();
    const listFullHeight = useRef(getListFullHeight(data.length, itemSize, gutterSize, bottomPadding));

    const listData = useMemo(() => data, [data]);

    const [clientBoundingRects, setClientBoundingRects] = useState({
        scrollHeight: 0,
        scrollTop: 0,
        clientHeight: 0,
    });
    const [scrollDirection, setScrollDirection] = useState(SCROLL_DIRECTIONS.backward);
    const [threshold, setThreshold] = useState(0);

    useEffect(() => {
        if (listRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = listRef.current;
            setClientBoundingRects((prev) => ({
                scrollHeight,
                scrollTop,
                clientHeight,
            }));
        }
    }, [listRef.current]);

    useEffect(() => {
        listFullHeight.current = getListFullHeight(data.length, itemSize, gutterSize, bottomPadding);
        setClientBoundingRects((prev) => ({
            ...prev,
            scrollHeight: listFullHeight.current,
        }));
    }, [listData]);

    useEffect(() => {
        let { scrollHeight, scrollTop, clientHeight } = clientBoundingRects;
        setThreshold((scrollHeight - scrollTop - clientHeight) / scrollHeight);
    }, [clientBoundingRects]);

    useEffect(() => {
        if (scrollDirection === SCROLL_DIRECTIONS.backward && threshold < endReachedThreshold && data.length !== 0) {
            (async function () {
                await onEndReached();
            })();
        }
    }, [threshold, endReachedThreshold, scrollDirection, data]);

    /**
     *
     * @param {UIEvent} e
     */
    const onScroll = (e) => {
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        let newThreshold = (scrollHeight - scrollTop - clientHeight) / scrollHeight;
        if (newThreshold < threshold) {
            setScrollDirection(SCROLL_DIRECTIONS.backward);
        } else {
            setScrollDirection(SCROLL_DIRECTIONS.forward);
        }
        setThreshold(newThreshold);
    };
    if (listData.length === 0) {
        return <ListEmptyComponent />;
    }
    return (
        <div ref={listRef} className={className} onScroll={onScroll} style={{ gap: gutterSize, ...listStyle }} onMouseLeave={onMouseLeave}>
            <ListHeaderComponent />
            {listData.map((item, index) => {
                let Item = () => renderItem({ item, index, data: listData });
                return <Item key={keyExtractor({ item, index })} />;
            })}
            <ListFooterComponent />
        </div>
    );
};

List.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func,
    itemSize: PropTypes.number,
    endReachedThreshold: PropTypes.number,
};

export default memo(List);
