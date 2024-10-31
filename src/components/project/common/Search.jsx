import React from "react";
import tableStyles from "../../../styles/table.module.scss";

const Search = ({ onSearchTextChange = () => {} }) => {
  const [searchText, setSearchText] = React.useState("");

  function onChange(e) {
    setSearchText(e.target.value);
    onSearchTextChange(e.target.value);
  }
  return (
    <div className={`${tableStyles.searchContainer}`}>
      <input
        type="text"
        placeholder="Search projects..."
        value={searchText}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
