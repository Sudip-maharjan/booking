# React + Vite Setup

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
