"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, PaletteIcon, Rocket, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    title: "Research & Discovery",
    description:
      "We analyze AI's global market impact, studying adoption trends across sectors and examining how AI technologies are transforming industries.",
    number: "01",
  },
  {
    icon: PaletteIcon,
    title: "Tool Development",
    description:
      "Our team develops practical AI utilities that demonstrate real-world applications. Each tool is designed for ease of use and maximum productivity impact.",
    number: "02",
  },
  {
    icon: Rocket,
    title: "Analytics & Insights",
    description:
      "Interactive dashboards showcase market data and AI adoption rates. We present comprehensive insights backed by research and interactive visualizations.",
    number: "03",
  },
]

export function ProcessSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            ✨ Our Process
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            From <span className="text-primary">Research</span> to <span className="text-primary">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            In three clear steps, we transform insights into powerful tools that demonstrate AI's transformative
            potential in global markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background h-full">
                <div className="absolute top-0 right-0 text-[120px] font-bold bg-gradient-to-br from-primary/10 to-primary/5 bg-clip-text text-transparent leading-none p-4">
                  {step.number}
                </div>
                <CardHeader>
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 w-fit group-hover:scale-110 group-hover:rotate-6">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -right-4 z-10">
                  <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
