interface Props {
  message: string;
}

function AppUpdate({ message }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <img src="logo-v2.png" alt="Login page icon" className="h-24 w-24 animate-bounce" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default AppUpdate;