"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Text Summarizer Tool",
    category: "AI Utility",
    image: "/text-summarization-dashboard.jpg",
    description:
      "Advanced text summarization utility using natural language processing. Automatically condenses documents while preserving key information and context.",
    url: "#",
    tags: ["NLP", "AI", "Text Processing"],
  },
  {
    title: "Image Generation Suite",
    category: "AI Utility",
    image: "/ai-image-generation-interface.png",
    description:
      "Create stunning images from text prompts using cutting-edge AI models. Perfect for marketing, design, and creative projects at scale.",
    url: "#",
    tags: ["Image AI", "Creative Tools", "Automation"],
  },
  {
    title: "Email & Content Writer",
    category: "AI Utility",
    image: "/email-writing-assistant-dashboard.jpg",
    description:
      "Generate professional emails, marketing copy, and compelling outreach messages. AI-powered writing that improves engagement and conversion rates.",
    url: "#",
    tags: ["Copywriting", "Email", "Marketing"],
  },
  {
    title: "Code Intelligence Platform",
    category: "AI Utility",
    image: "/code-explanation-ai-tool-interface.jpg",
    description:
      "Understand complex code snippets instantly. AI-powered explanations help developers learn, debug, and optimize code faster than ever.",
    url: "#",
    tags: ["Code Analysis", "Developer Tools", "AI"],
  },
]

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">Our AI Tools</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Explore our suite of practical AI utilities designed to enhance productivity and demonstrate real-world
            applications of artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    Learn More <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-primary font-semibold mb-2">{project.category}</p>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
