import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import useFetch from "../../hooks/useFetch";

const Featured = () => {
  const { data, loading, error } = useFetch("/api/bookings/revenue-stats");

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format large numbers (12.4k format)
  const formatShortNumber = (num) => {
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}k`;
    }
    return `$${num}`;
  };

  if (loading) {
    return (
      <div className="featured">
        <div className="loading">Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured">
        <div className="error">Error loading revenue data</div>
      </div>
    );
  }

  const todayAmount = data?.today || 0;
  const lastWeekAmount = data?.lastWeek || 0;
  const lastMonthAmount = data?.lastMonth || 0;
  const targetAmount = data?.target || 50000;
  const progress = data?.progress || 0;
  const weekChange = data?.weekChange || 0;
  const monthChange = data?.monthChange || 0;
  const pendingAmount = data?.pending || 0;

  // Calculate if target is met
  const targetDiff = data?.thisMonthTotal - targetAmount;

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={progress}
            text={`${progress.toFixed(0)}%`}
            strokeWidth={5}
          />
        </div>
        <p className="title">Total sales made today</p>
        <p className="amount">{formatCurrency(todayAmount)}</p>
        <p className="desc">
          {pendingAmount > 0
            ? `${formatCurrency(
                pendingAmount
              )} in pending payments. Last payments may not be included.`
            : "Previous transactions processing. Last payments may not be included."}
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div
              className={`itemResult ${
                targetDiff >= 0 ? "positive" : "negative"
              }`}
            >
              {targetDiff >= 0 ? (
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
              <div className="resultAmount">
                {formatShortNumber(targetAmount)}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div
              className={`itemResult ${
                weekChange >= 0 ? "positive" : "negative"
              }`}
            >
              {weekChange >= 0 ? (
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
              <div className="resultAmount">
                {formatShortNumber(lastWeekAmount)}
                {weekChange !== 0 && (
                  <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                    ({weekChange > 0 ? "+" : ""}
                    {weekChange}%)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div
              className={`itemResult ${
                monthChange >= 0 ? "positive" : "negative"
              }`}
            >
              {monthChange >= 0 ? (
                <KeyboardArrowUpOutlinedIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
              <div className="resultAmount">
                {formatShortNumber(lastMonthAmount)}
                {monthChange !== 0 && (
                  <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                    ({monthChange > 0 ? "+" : ""}
                    {monthChange}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
