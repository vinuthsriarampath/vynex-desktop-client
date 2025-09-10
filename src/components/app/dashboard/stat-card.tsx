import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card.tsx";

interface StatCardProps {
    title:string;
    description:string;
    value:number;
    loading?:boolean;
}


export default function StatCard({title,description,value,loading}: Readonly<StatCardProps>){
    return(
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {loading?(<div className={"w-8 h-6 bg-gray-700 animate-pulse"}></div>):(<p>{value}</p>)}
            </CardContent>
        </Card>
    )
}