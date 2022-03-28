import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { QrReader } from "react-qr-reader";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState("No result");
  return (
    <div className="App">
      <div>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            console.log("on result", { result, error });

            if (!!result) {
              setData(result.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
        />
        <p>{data}</p>
      </div>
    </div>
  );
}

export default App;
