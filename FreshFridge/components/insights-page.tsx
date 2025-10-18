import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, Calendar } from "lucide-react"

export default function InsightsPage() {
  const wasteData = [
    { month: "Jan", waste: 12 },
    { month: "Feb", waste: 8 },
    { month: "Mar", waste: 15 },
    { month: "Apr", waste: 10 },
    { month: "May", waste: 6 },
    { month: "Jun", waste: 9 },
  ]

  const spendingData = [
    { month: "Jan", amount: 180 },
    { month: "Feb", amount: 220 },
    { month: "Mar", amount: 195 },
    { month: "Apr", amount: 250 },
    { month: "May", amount: 210 },
    { month: "Jun", amount: 230 },
  ]

  return (
    <div className="space-y-12 px-8 lg:px-16">
      <div className="pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h1 className="text-[57px] font-bold text-black mb-3 leading-[1.1] tracking-[-0.03em]">Kitchen Insights</h1>
            <p className="text-[#737373] text-[17px] leading-relaxed">Track your habits and spending</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center px-6 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200 text-[15px] font-medium shadow-subtle">
              <Calendar className="w-4 h-4 mr-3" />
              Last 6 months
            </button>
            <button className="flex items-center px-6 py-3 bg-black text-white rounded-xl shadow-subtle hover-lift-small transition-all duration-200 text-[15px] font-medium">
              <Download className="w-4 h-4 mr-3" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            9
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Items Wasted</div>
          <div className="text-xs text-[#10B981] font-medium">↓ 25% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            $230
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">This Month</div>
          <div className="text-xs text-[#EF4444] font-medium">↑ 5% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            85%
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Efficiency</div>
          <div className="text-xs text-[#10B981] font-medium">↑ 3% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            12
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Recipes Made</div>
          <div className="text-xs text-[#10B981] font-medium">↑ 2 from last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl p-10 shadow-subtle">
          <h2 className="text-[24px] font-semibold text-black mb-10 tracking-[-0.02em]">Food Waste</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" stroke="#737373" style={{ fontSize: "15px", fontFamily: "-apple-system" }} />
                <YAxis stroke="#737373" style={{ fontSize: "15px", fontFamily: "-apple-system" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    padding: "12px 16px",
                  }}
                />
                <Bar dataKey="waste" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-subtle">
          <h2 className="text-[24px] font-semibold text-black mb-10 tracking-[-0.02em]">Grocery Spending</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" stroke="#737373" style={{ fontSize: "15px", fontFamily: "-apple-system" }} />
                <YAxis stroke="#737373" style={{ fontSize: "15px", fontFamily: "-apple-system" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    padding: "12px 16px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#000000"
                  strokeWidth={3}
                  dot={{ fill: "#000000", strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
