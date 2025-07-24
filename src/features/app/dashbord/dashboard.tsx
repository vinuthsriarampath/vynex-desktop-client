import {useEffect, useMemo, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {toast} from "sonner";
import StatCard from "@/components/app/dashboard/stat-card.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Cell, Label, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";

export default function Dashboard(){
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const [totalProjects,setTotalProjects] = useState<number>(0);
    const [totalCompletedProjects,setTotalCompletedProjects] = useState<number>(0);
    const [totalInProgressProjects,setTotalInProgressProjects] = useState<number>(0);
    const [totalShowcaseProjects,setTotalShowcaseProjects] = useState<number>(0);

    const chartData = [
        // { statName: "totalProjects", visitors: totalProjects, fill: "var(--color-chrome)" },
        { name: "Completed", value: totalCompletedProjects },
        { name: "In Progress", value: totalInProgressProjects},
        // { statName: "totalShowcaseProjects", visitors: 173, fill: "var(--color-edge)" },
    ]

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        const getStats = async () =>{
            try {
                const response:AxiosResponse = await axios.get(
                    `${BASE_URL}/api/stats/all`,
                    {
                        headers:{
                            Authorization : `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        }
                    }
                );
                const data = response.data;
                if (data) {
                    setTotalProjects(data.projectCount ?? 0);
                    setTotalCompletedProjects(data.completedProjectsCount ?? 0);
                    setTotalInProgressProjects(data.inProgressProjectsCount ?? 0);
                    setTotalShowcaseProjects(data.showcaseProjectsCount ?? 0);
                } else {
                    toast.error("No data found");
                }
            }catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.error);
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong!");
                }
            }
        };
        getStats();
    }, [BASE_URL, TOKEN]);

    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [])
    return (
        <>
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}>
                <StatCard title={"Total Projects"} description={"No of projects that you have done upto now!"} value={totalProjects}/>
                <StatCard title={"Total Completed Projects"} description={"No of projects that have labeled as completed!"} value={totalCompletedProjects}/>
                <StatCard title={"Total InProgress Projects"} description={"No of projects that have labeled as in-progress"} value={totalInProgressProjects}/>
                <StatCard title={"Total Showcase Projects"} description={"No of projects that have labeled to show in portfolio"} value={totalShowcaseProjects} />
            </div>
            <Card className="flex flex-col mt-10">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Project Status</CardTitle>
                    <CardDescription>All your project staus upto now!!</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" >
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold" >
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground" >
                                                        Projects
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                                {chartData.map((_entry, index) => (
                                    <Cell key={_entry.name} fill={COLORS[index % 4]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    )
}