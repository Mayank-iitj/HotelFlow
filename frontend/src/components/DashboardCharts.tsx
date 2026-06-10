"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const revenueData = [
  { name: 'Jan', total: 45000 },
  { name: 'Feb', total: 52000 },
  { name: 'Mar', total: 48000 },
  { name: 'Apr', total: 61000 },
  { name: 'May', total: 59000 },
  { name: 'Jun', total: 67000 },
];

const occupancyData = [
  { name: 'Mon', rate: 65 },
  { name: 'Tue', rate: 72 },
  { name: 'Wed', rate: 85 },
  { name: 'Thu', rate: 81 },
  { name: 'Fri', rate: 95 },
  { name: 'Sat', rate: 98 },
  { name: 'Sun', rate: 82 },
];

export function RevenueChart({ data }: { data?: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data || revenueData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${value}`} 
        />
        <Tooltip 
          cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart({ data }: { data?: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data || occupancyData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}%`} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
