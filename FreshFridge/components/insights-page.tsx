import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, Calendar, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"

export default function InsightsPage() {
  const [spendingData, setSpendingData] = useState<{ month: string; amount: number }[]>([])
  const [currentMonthSpending, setCurrentMonthSpending] = useState(0)
  const [recentTrips, setRecentTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const wasteData = [
    { month: "Jan", waste: 12 },
    { month: "Feb", waste: 8 },
    { month: "Mar", waste: 15 },
    { month: "Apr", waste: 10 },
    { month: "May", waste: 6 },
    { month: "Jun", waste: 9 },
  ]

  const loadSpendingData = async () => {
    try {
      console.log('🔄 Loading spending data...')
      setLoading(true)
      const [monthlySpending, currentSpending, recentGroceryTrips] = await Promise.all([
        dataService.getMonthlySpending(),
        dataService.getCurrentMonthSpending(),
        dataService.getGroceryLogs()
      ])
      
      console.log('📊 Monthly spending data:', monthlySpending)
      console.log('💰 Current month spending:', currentSpending)
      console.log('🛒 Recent grocery trips:', recentGroceryTrips)
      
      setSpendingData(monthlySpending)
      setCurrentMonthSpending(currentSpending)
      setRecentTrips(recentGroceryTrips.slice(0, 10)) // Show last 10 trips
    } catch (error) {
      console.error('Error loading spending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this grocery trip? This action cannot be undone.')) {
      return
    }

    try {
      const success = await dataService.deleteGroceryLog(tripId)
      
      if (success) {
        // Remove the trip from the local state
        setRecentTrips(prev => prev.filter(trip => trip.id !== tripId))
        
        // Refresh the data to update stats and monthly spending
        await loadSpendingData()
      } else {
        alert('Failed to delete grocery trip. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting grocery trip:', error)
      alert('Failed to delete grocery trip. Please try again.')
    }
  }

  useEffect(() => {
    loadSpendingData()
  }, [])

  // Refresh data when page becomes visible (user navigates back to insights)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSpendingData()
      }
    }

    const handleGroceryLogged = () => {
      console.log('🛒 Grocery logged event received, refreshing insights...')
      loadSpendingData()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('groceryLogged', handleGroceryLogged)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('groceryLogged', handleGroceryLogged)
    }
  }, [])

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
              Past 1 month
            </button>
            <button 
              onClick={loadSpendingData}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200 text-[15px] font-medium shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center px-6 py-3 bg-black text-white rounded-xl shadow-subtle hover-lift-small transition-all duration-200 text-[15px] font-medium">
              <Download className="w-4 h-4 mr-3" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            9
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Items Wasted</div>
          <div className="text-xs text-[#10B981] font-medium">↓ 25% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            {loading ? '...' : `$${Math.round(currentMonthSpending)}`}
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">This Month</div>
          <div className="text-xs text-[#EF4444] font-medium">
            {spendingData.length > 1 ? 
              `${Math.round(((currentMonthSpending - spendingData[spendingData.length - 2]?.amount || 0) / (spendingData[spendingData.length - 2]?.amount || 1)) * 100)}% from last month` :
              'No previous data'
            }
          </div>
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading spending data...</div>
              </div>
            ) : spendingData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-500 mb-2">No spending data yet</div>
                  <div className="text-sm text-gray-400">Log your grocery purchases to see spending trends</div>
                </div>
              </div>
            ) : (
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
                    formatter={(value: number) => [`$${value}`, 'Amount']}
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
            )}
          </div>
        </div>
      </div>

      {/* Recent Grocery Trips */}
      <div className="bg-white rounded-2xl p-10 shadow-subtle">
        <h2 className="text-[24px] font-semibold text-black mb-10 tracking-[-0.02em]">Recent Grocery Trips</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading recent trips...</div>
          </div>
        ) : recentTrips.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-500 mb-2">No grocery trips yet</div>
              <div className="text-sm text-gray-400">Log your grocery purchases to see them here</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTrips.map((trip, index) => (
              <div key={trip.id || index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-[15px]">{trip.store_name}</h3>
                    <p className="text-[#737373] text-[13px]">
                      {new Date(trip.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ${trip.amount.toFixed(2)}
                    </div>
                    <div className="text-[#737373] text-[13px]">
                      {new Date(trip.created_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors group"
                    title="Delete trip"
                  >
                    <svg className="w-4 h-4 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
