import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { API_BASE } from '../config/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Lightbulb, TrendingUp, BarChart, Users } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analytics() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("hg_access_token")
        const res = await fetch(`${API_BASE}/v1/context-stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (res.ok) setStats(await res.json())
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg CEOS Score',
        data: [72, 75, 76, 74, 80, 81],
        backgroundColor: '#dc2626',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Avg Raw Score',
        data: [65, 68, 66, 67, 69, 70],
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'DM Sans', weight: 'bold' }, color: '#4b5563' } }
    },
    scales: {
      y: { min: 40, max: 100, border: { display: false }, grid: { color: '#f3f4f6' } },
      x: { border: { display: false }, grid: { display: false } }
    }
  }

  const donutData = {
    labels: ['Rural', 'Semi-rural', 'Urban', 'Metro'],
    datasets: [{
      data: [28, 15, 35, 22],
      backgroundColor: ['#dc2626', '#d97706', '#059669', '#e5e7eb'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  }

  const donutOptions = {
    cutout: '75%',
    plugins: {
      legend: { position: 'right', labels: { font: { family: 'DM Sans', weight: 'bold' }, color: '#4b5563', padding: 20 } }
    }
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-gray-500 font-medium mt-1">Measure fairness impact over time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[
          { icon: Users, stat: '2,400+', label: 'Evaluated' },
          { icon: TrendingUp, stat: '78', label: 'Avg CEOS' },
          { icon: BarChart, stat: '28', label: 'Rescued' },
          { icon: Lightbulb, stat: '+1,560', label: 'Credits' },
          { icon: Users, stat: stats?.districts_count ? `${stats.districts_count}` : '640+', label: 'Districts' }
        ].map((s, i) => (
          <Card key={i} className="p-5 flex flex-col items-center justify-center text-center">
            <s.icon className="text-primary mb-3" size={24} />
            <div className="text-2xl font-black text-gray-900 leading-none mb-1">{s.stat}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col" style={{ minHeight: '380px' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Score Progression (6 Months)</h3>
          <div className="flex-1 relative">
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>

        <Card className="p-6 flex flex-col" style={{ minHeight: '380px' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Geographic Breakdown</h3>
          <div className="flex-1 flex items-center justify-center">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Top Credit Factors</h3>
          <div className="space-y-4">
            {[
              { label: 'Rural Connectivity Index (<2 Mbps)', count: 342, avg: '+12' },
              { label: 'Tier-3 Engineering Institutions', count: 421, avg: '+7' },
              { label: 'First-Gen Graduate', count: 185, avg: '+3' },
              { label: 'Districts with <100 Tech Jobs/Capita', count: 212, avg: '+15' },
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-bold text-sm text-gray-900">{d.label}</div>
                  <div className="text-xs text-gray-500 font-medium">{d.count} candidates applied</div>
                </div>
                <Badge variant="credit" className="bg-secondary/10 text-secondary border-transparent ml-4 shrink-0">
                  {d.avg} Avg
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-secondary/30 bg-secondary/5 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-[-20%] right-[-10%] text-secondary/10">
            <Lightbulb size={180} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-sm mb-4">
              <Lightbulb size={18} /> Fairness Insight
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-snug">
              Rural candidates score <span className="text-primary">26% lower</span> on raw metrics but only <span className="text-positive">4% lower</span> on adjusted CEOS.
            </p>
            <p className="text-gray-600 font-medium mt-4">
              The model indicates that structural barriers obscure core technical capability in rural cohorts, particularly during initial automated parser screening.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}