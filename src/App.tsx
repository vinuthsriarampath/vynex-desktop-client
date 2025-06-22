import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState('')
  const isElectron = Boolean(window.ipcRenderer)

  useEffect(() => {
    if (!isElectron) return

    const handler = (_event: any, msg: string) => {
      console.log("Received message:", msg)
      setMessage(msg)
    }

    window.ipcRenderer!.on('update-message', handler)

    return () => {
      window.ipcRenderer!.off('update-message', handler)
    }
  }, [isElectron])

  const notify = () => {
    if (isElectron) {
      window.ipcRenderer!.send('notify', 'Title', 'Notification from the Renderer process. Click to log to console.')
    } 
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-black items-center justify-center">
      {isElectron ? (
        <p className="text-white">You are in the desktop app.</p>
      ) : (
        <p className="text-white">You are in the browser.</p>
      )}
      <button className="text-white" onClick={notify}>Click To Notify</button>
      <p className="text-white">{message}</p>
      <p className="text-white">this is version 0.0.7</p>
    </div>
  )
}

export default App