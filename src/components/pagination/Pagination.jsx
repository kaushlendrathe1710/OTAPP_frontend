import React, { memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import glassStyles from "../../styles/glass.module.scss";

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  disabled = false,
}) => {
  let firstPage = totalPages[0];
  let lastPage = totalPages[totalPages.length - 1];
  const [renderedPages, setRenderedPages] = useState([
    firstPage,
    ...totalPages.slice(1, 7),
    "...",
    lastPage,
  ]);

  const getModifiedPages = useCallback(() => {
    if (totalPages.length < 9) {
      return totalPages;
    } else {
      if (currentPage === lastPage) {
        return [firstPage, ...totalPages.slice(-7, -1), lastPage];
      } else if (currentPage === 1) {
        return [...totalPages.slice(currentPage - 1, 7), "...", lastPage];
      } else {
        return Array.from(
          new Set([
            firstPage,
            ...totalPages.slice(currentPage - 3, currentPage - 1),
            ...totalPages.slice(currentPage - 1, currentPage + 4),
            "...",
            lastPage,
          ])
        );
      }
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    let modifiedPages = getModifiedPages();
    setRenderedPages(modifiedPages);
  }, [totalPages, currentPage]);
  return (
    <div className={glassStyles.paginationWrapper}>
      {renderedPages.length > 1 && currentPage !== renderedPages[0] && (
        <button
          className={glassStyles.paginationButtonNext}
          onClick={() => setCurrentPage(currentPage - 1)}
          title="Previous page"
          disabled={disabled}
        >
          Prev
        </button>
      )}
      {renderedPages?.map((page, i) => {
        return typeof page === "number" ? (
          <button
            key={i}
            style={{
              backgroundColor: currentPage === page ? "white" : "",
            }}
            className={glassStyles.paginationButton}
            data-active={currentPage === page}
            onClick={() => {
              setCurrentPage(page);
            }}
            title={`Page ${page}`}
            disabled={disabled}
          >
            {page}
          </button>
        ) : (
          <button
            key={i}
            style={{
              backgroundColor: currentPage === page ? "white" : "",
            }}
            className={glassStyles.paginationButton}
            disabled={disabled}
          >
            {page}
          </button>
        );
      })}
      {renderedPages.length > 1 &&
        currentPage !== renderedPages[renderedPages.length - 1] && (
          <button
            className={glassStyles.paginationButtonNext}
            onClick={() => setCurrentPage(currentPage + 1)}
            title="Next page"
            disabled={disabled}
          >
            Next
          </button>
        )}
    </div>
  );
};
export default memo(Pagination);

Pagination.defaultProps = {
  totalPages: [],
  currentPage: 0,
  setCurrentPage: () => {},
  visible: true,
};
Pagination.propTypes = {
  totalPages: PropTypes.array,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  visible: PropTypes.bool,
};
