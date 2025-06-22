function App() {
  const notify = () => {
    // const NOTIFICATION_TITLE = 'Title'
    // const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
    // const CLICK_MESSAGE = 'Notification clicked!'

    window.ipcRenderer.send('notify', 'Title', 'Notification from the Renderer process. Click to log to console.')  
  }

  return (
    <>
      <div className="flex h-screen w-screen bg-black items-center justify-center">
        <button className="text-white" onClick={notify}>Click To Notify</button>
      </div>
    </>
  )
}

export default App
