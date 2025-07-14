import { Button } from "@/components/ui/button";

function NotFound(){
    return(
        <div className="flex h-screen justify-center items-center">
            <div className="flex flex-col justify-content items-center gap-4 animate-pulse">
                <img src="logo-v2.png" alt="Login page icon" className="h-24 w-24 animate-bounce" />
                <p className="text-sm">Page Not Found !!</p>
                <a href="/#/app"><Button>Go Back</Button></a>
            </div>
        </div>
    )
}

export default NotFound;