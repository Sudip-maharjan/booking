import "./mailList.css";

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Save time, spend money!</h1>
      <span className="mailDesc">
        Sign up and we'll send the best deals to you.
      </span>
      <div className="mailInputContainer">
        <input type="text" placeholder="example@gmail.com" />
        <button>Subscribe</button>
      </div>
    </div>
  );
};

export default MailList;
