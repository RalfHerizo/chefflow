import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

export default function StatCard({ title, value, icon, description }) {
    return (
        <Card className="rounded-2xl border-none shadow-sm bg-white/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-green-500 font-medium mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}