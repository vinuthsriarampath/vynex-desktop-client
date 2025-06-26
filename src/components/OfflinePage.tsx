function OfflinePage(){
    return(
        <>
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <img src="logo-v2.png" alt="Login page icon" className="h-24 w-24 animate-bounce" />
                <p className="text-sm">You are Offline !!</p>
            </div>
        </>
    )
}

export default OfflinePage;