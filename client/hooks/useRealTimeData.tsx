import React, { useState, useEffect, useCallback } from 'react';

interface RealTimeData {
  accountsVerified: number;
  availableCredits: number;
  creditsSpent: number;
  successRate: number;
  lastUpdated: Date;
}

interface TrendData {
  period: string;
  value: number;
  change: number;
  changePercent: number;
}

export function useRealTimeData() {
  const [data, setData] = useState<RealTimeData>({
    accountsVerified: 1234,
    availableCredits: 15048,
    creditsSpent: 8129,
    successRate: 94.2,
    lastUpdated: new Date(),
  });

  const [isLive, setIsLive] = useState(true);
  const [trends, setTrends] = useState<Record<string, TrendData[]>>({});

  // Simulate real-time data updates
  const generateRandomChange = useCallback((baseValue: number, maxChange: number = 0.05) => {
    const change = (Math.random() - 0.5) * 2 * maxChange;
    return Math.max(0, Math.round(baseValue * (1 + change)));
  }, []);

  const updateData = useCallback(() => {
    if (!isLive) return;

    setData(prevData => {
      const newData = {
        accountsVerified: generateRandomChange(prevData.accountsVerified, 0.02),
        availableCredits: generateRandomChange(prevData.availableCredits, 0.01),
        creditsSpent: generateRandomChange(prevData.creditsSpent, 0.03),
        successRate: Math.max(85, Math.min(99, prevData.successRate + (Math.random() - 0.5) * 2)),
        lastUpdated: new Date(),
      };

      // Update trends data
      const now = new Date();
      const timeKey = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setTrends(prevTrends => {
        const newTrends = { ...prevTrends };
        
        const updateTrend = (key: keyof RealTimeData, value: number) => {
          if (!newTrends[key]) newTrends[key] = [];
          
          const lastValue = newTrends[key].length > 0 
            ? newTrends[key][newTrends[key].length - 1].value 
            : value;
          
          const change = value - lastValue;
          const changePercent = lastValue > 0 ? (change / lastValue) * 100 : 0;
          
          newTrends[key].push({
            period: timeKey,
            value,
            change,
            changePercent,
          });
          
          // Keep only last 20 data points
          if (newTrends[key].length > 20) {
            newTrends[key] = newTrends[key].slice(-20);
          }
        };

        updateTrend('accountsVerified', newData.accountsVerified);
        updateTrend('availableCredits', newData.availableCredits);
        updateTrend('creditsSpent', newData.creditsSpent);
        updateTrend('successRate', newData.successRate);

        return newTrends;
      });

      return newData;
    });
  }, [isLive, generateRandomChange]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(updateData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [isLive, updateData]);

  const toggleLiveUpdates = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  return {
    data,
    trends,
    isLive,
    toggleLiveUpdates,
    lastUpdated: data.lastUpdated,
  };
}
