"use client";
import CostCalculator from '@/components/CostCalculator'

export default function Home() {
  return (
    <div suppressHydrationWarning={true}>
      <CostCalculator />
    </div>
  )
}