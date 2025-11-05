"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BarChart3, Zap, ImageIcon, FileText, Code2 } from "lucide-react"

const services = [
  {
    icon: Brain,
    title: "Text Summarizer",
    description:
      "Condenses long text into concise, meaningful summaries. Perfect for analyzing reports, articles, and documents quickly without losing key information.",
  },
  {
    icon: FileText,
    title: "Email Template Generator",
    description:
      "Creates professional, customizable email drafts for any occasion. Save time and maintain consistency in your business communications.",
  },
  {
    icon: Zap,
    title: "Cold Email Writer",
    description:
      "Generates compelling outreach and marketing emails that engage prospects. AI-powered copy designed to increase open rates and conversions.",
  },
  {
    icon: ImageIcon,
    title: "Image Generator",
    description:
      "Creates AI-generated images from text prompts. Perfect for designs, marketing visuals, and creative projects without stock image limitations.",
  },
  {
    icon: BarChart3,
    title: "Background Remover",
    description:
      "Removes backgrounds from images automatically. Ideal for product photos, portraits, and professional graphics in seconds.",
  },
  {
    icon: Code2,
    title: "Code Explainer",
    description:
      "Explains and simplifies source code snippets. Break down complex programming logic and understand unfamiliar code faster.",
  },
]

export function ServicesSection() {
  return (
    <section id="diensten" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mx-auto block w-fit">
          ✨ AI-Powered Tools
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Practical <span className="text-primary">AI Utilities</span> for Productivity
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed text-lg">
          Harness the power of artificial intelligence with our suite of tools designed to automate tasks, enhance
          creativity, and boost productivity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
