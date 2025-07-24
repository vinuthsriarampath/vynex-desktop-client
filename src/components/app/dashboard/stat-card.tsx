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
}


export default function StatCard({title,description,value}: Readonly<StatCardProps>){
    return(
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{value}</p>
            </CardContent>
        </Card>
    )
}