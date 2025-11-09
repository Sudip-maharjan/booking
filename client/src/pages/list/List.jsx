import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./list.css";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const state = location.state || {};

  const [destination, setDestination] = useState(state.destination || "");
  const [dates, setDates] = useState(
    state.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );

  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(state.options || {});
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(999);

  const { data, loading, error, reFetch } = useFetch(
    `/api/hotels?city=${destination}&min=${min}&max=${max}`
  );

  const handleClick = () => {
    reFetch();
  };

  return (
    <>
      <Navbar />
      <Header type="list" />

      <div className="listContainer">
        <div className="listWrapper">
          {/* Search Panel */}
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            {/* Destination */}
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={destination}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            {/* Dates */}
            <div className="lsItem">
              <label>Check-in Date</label>
              <span className="date-box" onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(
                  dates[0].endDate,
                  "dd/MM/yyyy"
                )}`}
              </span>

              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            {/* Options */}
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOpenText">Min price</span>
                  <input
                    type="number"
                    onChange={(e) => setMin(Number(e.target.value))}
                    className="lsOptionInput"
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOpenText">Max price</span>
                  <input
                    type="number"
                    onChange={(e) => setMax(Number(e.target.value))}
                    className="lsOptionInput"
                  />
                </div>
              </div>
            </div>

            <button onClick={handleClick}>Search</button>
          </div>

          {/* Results */}
          <div className="listResult">
            {loading
              ? "Loading..."
              : data.map((item) => <SearchItem item={item} key={item._id} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
