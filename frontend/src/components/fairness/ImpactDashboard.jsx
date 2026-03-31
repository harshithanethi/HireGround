import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  LineChart, Line 
} from 'recharts';
import { Users, TrendingUp, ShieldCheck } from 'lucide-react';

const COLORS = ['#dc2626', '#10b981', '#6366f1']; // Red, Emerald, Indigo

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current)}${suffix}`
  );
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function ImpactDashboard({ metrics, isSimulating }) {

  const Card = ({ title, value, label, icon: Icon, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={64} className="text-gray-900" />
      </div>
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <Icon size={16} className="text-primary" />
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-4xl font-black text-gray-900 mb-1 tracking-tight">
        {isSimulating ? <span className="animate-pulse text-gray-300">---</span> : value}
      </div>
      <div className="text-xs text-gray-500 font-medium">
        {label}
      </div>
    </motion.div>
  );

  const regionData = [
    { name: 'Rural', value: metrics.ruralPercent },
    { name: 'Urban', value: metrics.urbanPercent },
  ];

  const tierData = [
    { name: 'Tier 1', value: metrics.tier1Percent },
    { name: 'Tier 2', value: metrics.tier2Percent },
    { name: 'Tier 3', value: metrics.tier3Percent },
  ];

  const ceosData = [
    { day: 'Baseline', score: 0.2 },
    { day: 'Current', score: parseFloat(metrics.avgCEOS) }
  ];

  const tooltipStyle = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#111827' };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          title="Fairness Score" 
          value={<AnimatedNumber value={metrics.fairnessScore * 100} suffix="/100" />} 
          label="Composite Opportunity Score"
          icon={ShieldCheck}
          delay={0}
        />
        <Card 
          title="Rural Representation" 
          value={<AnimatedNumber value={metrics.ruralPercent} suffix="%" />} 
          label="Of Shortlisted Candidates"
          icon={Users}
          delay={0.1}
        />
        <Card 
          title="First-Gen Uplift" 
          value={<AnimatedNumber value={metrics.firstGenCount} prefix="+" />} 
          label="Candidates Enabled"
          icon={TrendingUp}
          delay={0.2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 col-span-1 border-t-4 border-t-primary">
          <h3 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider flex items-center justify-between">
            Region Distribution <span className="text-xs font-normal text-primary bg-red-50 px-2 py-0.5 rounded-full">Shortlist</span>
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 col-span-1 border-t-4 border-t-emerald-500">
          <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center justify-between">
            College Tiers <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Breakdown</span>
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? `${name}` : ''}
                  labelStyle={{ fill: '#4b5563', fontSize: 11, fontWeight: 'bold' }}
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 col-span-1 border-t-4 border-t-indigo-500 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center justify-between">
            Average CEOS <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Trend</span>
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ceosData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
