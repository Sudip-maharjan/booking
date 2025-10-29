# Client

Project Tree:
client
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public/
├── README.md
├── src/
│ ├── App.jsx
│ ├── components/
│ │ ├── featured/
│ │ │ ├── featured.css
│ │ │ └── Featured.jsx
│ │ ├── featuredProperties/
│ │ │ ├── featuredProperties.css
│ │ │ └── FeaturedProperties.jsx
│ │ ├── footer/
│ │ │ ├── footer.css
│ │ │ └── Footer.jsx
│ │ ├── header/
│ │ │ ├── header.css
│ │ │ └── Header.jsx
│ │ ├── mailList/
│ │ │ ├── mailList.css
│ │ │ └── MailList.jsx
│ │ ├── navbar/
│ │ │ ├── navbar.css
│ │ │ └── Navbar.jsx
│ │ ├── propertyList/
│ │ │ ├── propertyList.css
│ │ │ └── PropertyList.jsx
│ │ ├── reserve/
│ │ │ ├── reserve.css
│ │ │ └── Reserve.jsx
│ │ └── searchItem/
│ │ ├── searchItem.css
│ │ └── SearchItem.jsx
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ └── SearchContext.jsx
│ ├── hooks/
│ │ └── useFetch.js
│ ├── index.css
│ ├── main.jsx
│ └── pages/
│ ├── Home/
│ │ ├── home.css
│ │ └── Home.jsx
│ ├── hotel/
│ │ ├── hotel.css
│ │ └── Hotel.jsx
│ ├── list/
│ │ ├── list.css
│ │ └── List.jsx
│ └── login/
│ ├── Login.css
│ └── Login.jsx
├── vite.config.js
└── yarn.lock

##.env
MONGO = mongodb+srv://Sudip:P6!TbK3ivmqHivF@rajankodb.bebnhew.mongodb.net/booking?retryWrites=true&w=majority&appName=RajanKoDB
JWT = Sw3UEPh0/lDCttqLlfQUJKSzIXUHLaqLNyTVhSeY8kY=

###

```pwsh
git add .
git commit -m "msg"
git push
```

## Libraries

- [FontAwesome](https://fontawesome.com/)
- [react-date-range](https://github.com/hypeserver/react-date-range)
- [date-fns](https://date-fns.org/)
- [mongoose](https://mongoosejs.com/)
  -bcryptjs for password encryption

---

## Installation

```pwsh
npm install --save react-date-range
npm install --save date-fns

npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
```

## Imports

```jsx
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
```

### Example code

```jsx
const Example = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => setState([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={state}
    />
  );
};

export default Example;
```

### in date-fns mm means minutes and MM means month

# mongodb

Rajak KO DB
username: Sudip
pass: P6!TbK3ivmqHivF

### url: "mongodb+srv://<db_username>:<db_password>@rajankodb.bebnhew.mongodb.net/?retryWrites=true&w=majority&appName=RajanKoDB"
