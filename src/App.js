import {useState} from 'react'
import './App.css'


function App() {
  const [file, setfile] = useState("")
  const [data, setData] = useState([])

 const handleCLick = async() =>{
    const formData = new FormData()
    formData.append("file", file)
    const data = await fetch('/api',{
      body:formData,
      method: 'POST',
    })
    const output = await data.json()
    setData(output)
    exportToJson()
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const exportToJson = (e) => {
    downloadFile({
      data: JSON.stringify(data),
      fileName: 'data.json',
      fileType: 'text/json',
    })
  }

  return (
    <div >
     <h1 className="header">Log Parser App</h1>
			<div className="App">
     <input type="file" name="file" className="custom-file-upload" onChange={(e)=>setfile(e.target.files[0])}/><br/><br/>
				<button className="button" onClick={handleCLick}>Download</button>
			</div>
      
      {console.log(data.length)}
      {data.length > 0 && <div className="list">
            {data.map((el, i)=>{
              return (<ul key={el.transactionId}>
                <li>{el.timestamp}</li>
                <li>{el.transactionId.replace(/"/g,"")}</li>
                <li>{el.level}</li>
                <li>{el.msg.split("}")}</li>
              </ul>
              )
            })}
      </div>}
    </div>


  );
}

export default App;
