import React, { memo, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import chatStyles from "../../styles/chat.module.scss";

const ITEM_SIZE = 70;
const GUTTER_SIZE = 4;
const BOTTOM_PADDING = 70 + 40 + 16;
const SCROLL_DIRECTIONS = { forward: "FORWARD", backward: "BACKWARD" }; // forward => user scroll to top, backward => user scroll to bottom

function getListFullHeight(numberOfItems) {
  return numberOfItems * (ITEM_SIZE + GUTTER_SIZE) + BOTTOM_PADDING + 4;
}

const ChatNavigationList = ({
  data = [],
  renderItem,
  keyExtractor,
  endReachedThreshold = 0.5,
  onEndReached = async () => {},
  ListHeaderComponent = () => {},
  ListFooterComponent = () => {},
  ListEmptyComponent = () => {},
  onMouseLeave = () => {},
  listStyle={}
}) => {
  const listRef = useRef();
  const listFullHeight = useRef(getListFullHeight(data.length));

  const [clientBoundingRects, setClientBoundingRects] = useState({
    scrollHeight: 0,
    scrollTop: 0,
    clientHeight: 0,
  });
  const [scrollDirection, setScrollDirection] = useState(
    SCROLL_DIRECTIONS.backward
  );
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
    listFullHeight.current = getListFullHeight(data.length);
    setClientBoundingRects((prev) => ({
      ...prev,
      scrollHeight: listFullHeight.current,
    }));
  }, [data]);

  useEffect(() => {
    let { scrollHeight, scrollTop, clientHeight } = clientBoundingRects;
    setThreshold((scrollHeight - scrollTop - clientHeight) / scrollHeight);
  }, [clientBoundingRects]);

  useEffect(() => {
    if (
      scrollDirection === SCROLL_DIRECTIONS.backward &&
      threshold < endReachedThreshold &&
      data.length !== 0
    ) {
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
  if (data.length === 0) {
    return <ListEmptyComponent />;
  }
  return (
    <div
      ref={listRef}
      className={chatStyles.chatNavigation}
      onScroll={onScroll}
      style={{ gap: GUTTER_SIZE, ...listStyle }}
      onMouseLeave={onMouseLeave}
    >
      <ListHeaderComponent />
      {data.map((item, index) => {
        let Item = () => renderItem({ item, index, data });
        return <Item key={keyExtractor({ item, index })} />;
      })}
      <ListFooterComponent />
    </div>
  );
};

ChatNavigationList.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func,
  endReachedThreshold: PropTypes.number,
};

export default memo(ChatNavigationList);
