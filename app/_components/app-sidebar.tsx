"use client";

import type * as React from "react";
import { Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchForm } from "./search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Utility tools list
const utilities = [
  {
    title: "Text Summarizer",
    url: "/utilities/text-summarizer",
  },
  {
    title: "Flowchart Generator",
    url: "/utilities/flowchart-generator",
  },
  {
    title: "Email Template Generator",
    url: "/utilities/email-template-generator",
  },
  {
    title: "Cold Email Writer",
    url: "/utilities/cold-email-writter",
  },
  {
    title: "Image Generator",
    url: "/utilities/image-generator",
  },
  {
    title: "Image Editor",
    url: "/utilities/image-editor",
  },
  {
    title: "Background Remover",
    url: "/utilities/background-remover",
  },
  {
    title: "Code Explainer",
    url: "/utilities/code-explainer",
  },
  {
    title: "Resume Analyzer",
    url: "/utilities/resume-analyzer",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="font-semibold">AI360</div>
        </div>
        <SearchForm />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {utilities.map((tool) => {
              const isActive = pathname === tool.url;
              return (
                <SidebarMenuItem key={tool.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={tool.url} className="flex items-center gap-2">
                      <span>{tool.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
