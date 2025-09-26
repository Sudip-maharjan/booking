import "./header.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faPlane,
  faCar,
  faTaxi,
  faPerson,
  faCalendarDays,
  faToriiGate,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

const Header = () => {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 2,
    children: 0,
    room: 1,
  });

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>stays</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car Rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faToriiGate} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport Taxis</span>
          </div>
        </div>
        <h1 className="headerTitle">Find your next stay</h1>
        <p className="headerDescription">
          Search deals on hotels, homes, and much more...
        </p>
        <button className="headerBtn">Sign in / Register</button>
        <div className="headerSearch">
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faBed} className="headerIcon" />
            <input
              type="text"
              placeholder="where are u going"
              className="headerSearchInput"
            />
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <span
              onClick={() => setOpenDate(!openDate)}
              className="headerSearchText"
            >
              {`${format(date[0].startDate, "dd/mm/yyyy")} to ${format(
                date[0].endDate,
                "dd/mm/yyyy"
              )}`}
              {/* Check-in date - Check-out date */}
            </span>
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className="date"
              />
            )}
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            <span className="headerSearchText">
              {`${options.adult} adult · ${options.children} children · ${options.room} room`}
            </span>
            <div className="options">
              <div className="optionItem">
                <span className="optionText">Adult</span>
                <button className="optionCounterButton">-</button>
                <span className="optionCounterNumber">2</span>
                <button className="optionCounterButton">+</button>
              </div>
              <div className="optionItem">
                <span className="optionText">Children</span>
                <button className="optionCounterButton">-</button>
                <span className="optionCounterNumber">0</span>
                <button className="optionCounterButton">+</button>
              </div>
              <div className="optionItem">
                <span className="optionText">Room</span>
                <button className="optionCounterButton">-</button>
                <span className="optionCounterNumber">1</span>
                <button className="optionCounterButton">+</button>
              </div>
            </div>
          </div>
          <div className="headerSearchItem">
            <button className="headerBtn">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
