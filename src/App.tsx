import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState('')  
  useEffect(() => {
    const handler = (_event: any, msg: string) => {
      console.log("Received message:", msg);
      setMessage(msg);
    }
  
    window.ipcRenderer.on('update-message', handler);
  
    return () => {
      window.ipcRenderer.off('update-message', handler);
    }
  }, []);
  
  const notify = () => {
    sendNotification('Title', 'Notification from the Renderer process. Click to log to console.');  
  }

  function sendNotification(title:string, body:string) {
    window.ipcRenderer.send('notify', title, body)
  }

  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center">
        <button className="text-white" onClick={notify}>Click To Notify</button>
        <p className="text-white">{message}</p>
        <p className="text-white">this is version 0.0.6</p>
      </div>
    </>
  )
}

export default App
