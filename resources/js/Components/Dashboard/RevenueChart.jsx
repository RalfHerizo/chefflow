import { Card, CardContent } from '@/Components/ui/card';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function euroTick(value) {
    return `${value} EUR`;
}

/**
 * @param {{ data?: Array<{date: string, revenue: number}> }} props
 */
export default function RevenueChart({ data = [] }) {
    return (
        <Card className="border-slate-200/70 bg-white shadow-sm">
            <CardContent className="p-6">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Revenus hebdomadaires
                    </h3>
                    <p className="text-sm text-slate-500">
                        Somme des ventes sur les 7 derniers jours
                    </p>
                </div>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="weeklyRevenueGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="5%" stopColor="#FF7E47" stopOpacity={0.55} />
                                    <stop offset="95%" stopColor="#FF7E47" stopOpacity={0.06} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                stroke="#E2E8F0"
                                strokeDasharray="4 4"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                tickFormatter={euroTick}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} EUR`, 'Revenu']}
                                labelClassName="text-slate-600"
                                contentStyle={{
                                    borderRadius: '0.75rem',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#FF7E47"
                                strokeWidth={3}
                                fill="url(#weeklyRevenueGradient)"
                                activeDot={{ r: 6, fill: '#FF7E47', strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
