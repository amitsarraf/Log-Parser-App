import { useState } from "react";
import "./App.css";

function App() {
  const [file, setfile] = useState<File | null>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToJson = async () => {
    if (file === null) {
      setSubmitted(true)
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const data = await fetch("/api", {
        body: formData,
        method: "POST",
      });
      const output = await data.json();
      if (output.length > 0) {
        setData(output);
        setLoading(false);
      }
      downloadFile({
        data: JSON.stringify(output),
        fileName: "data.json",
        fileType: "text/json",
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0] === undefined) {
      seterror(true);
    }else{
      setfile(e.target.files[0]);
      seterror(false);
    }
  };

  return (
    <>
      <h1 className="header">Log Parser App</h1>
      <div className="App">
        <input
          type="file"
          name="file"
          className="custom-file-upload"
          onChange={(e) => handleChange(e)}
        />
        <br />
        <br />
        <button className="button" onClick={exportToJson}>
          Download
        </button>
        {error && submitted && <span className="errormessage">please enter txt file</span>}
      </div>
      <div className="loader">{loading && <h1>Loading...</h1>}</div>

      {data.length > 0 && (
        <div className="list">
          {data.map((el, i) => {
            return (
              <ul key={el.transactionId}>
                <li>{el.timestamp}</li>
                <li>{el.transactionId.replace(/"/g, "")}</li>
                <li>{el.level}</li>
                <li>{el.msg.split("}")}</li>
              </ul>
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
