import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TechniqueResult, AI_TECHNIQUE } from '../types';
import { TECHNIQUE_CONFIGS } from '../constants';

interface ComparativeChartsProps {
  results: TechniqueResult[];
}

export const ComparativeCharts: React.FC<ComparativeChartsProps> = ({ results }) => {
  // Filter out results that haven't finished loading
  const completedResults = results.filter(r => r.data !== null);

  if (completedResults.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border font-mono text-sm">
        Waiting for analysis data...
      </div>
    );
  }

  // PREPARE DATA FOR RADAR CHART (Macro Composition)
  const radarData = [
    { subject: 'Calories (kcal)', fullMark: 1000 },
    { subject: 'Protein (g)', fullMark: 100 },
    { subject: 'Carbs (g)', fullMark: 100 },
    { subject: 'Fat (g)', fullMark: 100 },
  ].map(metric => {
    const point: any = { subject: metric.subject, fullMark: metric.fullMark };
    completedResults.forEach(res => {
      if (res.data) {
        let val = 0;
        if (metric.subject.includes('Calories')) val = res.data.macros.calories;
        else if (metric.subject.includes('Protein')) val = res.data.macros.protein;
        else if (metric.subject.includes('Carbs')) val = res.data.macros.carbs;
        else if (metric.subject.includes('Fat')) val = res.data.macros.fat;
        
        point[res.technique] = val;
      }
    });
    return point;
  });

  // PREPARE DATA FOR BAR CHART (Processing & Confidence)
  const barData = completedResults.map(res => ({
    name: TECHNIQUE_CONFIGS[res.technique].name,
    time: res.data?.processingTimeMs || 0,
    confidence: res.data?.confidenceScore || 0,
    technique: res.technique,
  }));

  return (
    <div className="space-y-8">
      
      {/* MACRO COMPARISON RADAR */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-2"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>
          Nutritional Consensus Radar
        </h3>
        <div className="h-[400px] w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'Space Mono' }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} />
              
              {completedResults.map((res) => (
                <Radar
                  key={res.technique}
                  name={TECHNIQUE_CONFIGS[res.technique].name}
                  dataKey={res.technique}
                  stroke={TECHNIQUE_CONFIGS[res.technique].color}
                  fill={TECHNIQUE_CONFIGS[res.technique].color}
                  fillOpacity={0.15}
                />
              ))}
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: 'var(--shadow-lg)' }}
                itemStyle={{ fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONFIDENCE vs TIME BAR CHART */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-1"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          Performance & Confidence Metrics
        </h3>
        <div className="h-[300px] w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" orientation="left" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)' } }} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Confidence (%)', angle: 90, position: 'insideRight', style: { fill: 'var(--muted-foreground)' } }} />
              <Tooltip 
                 cursor={{ fill: 'var(--secondary)' }}
                 contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: 'var(--shadow-lg)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }}/>
              <Bar yAxisId="left" dataKey="time" name="Processing Time (ms)" fill="var(--muted)" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar yAxisId="right" dataKey="confidence" name="Confidence Score (%)" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};