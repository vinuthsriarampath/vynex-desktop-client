function App() {
  const notify = () => {
    new Notification("Hello World", {
      body: "This is a notification",
      icon: "https://via.placeholder.com/150",
    });
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
