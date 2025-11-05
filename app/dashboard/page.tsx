"use client";

import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          🌐 Global AI Insights Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore real-time analytics and trends about artificial intelligence —
          from training computation to adoption rates and global perspectives.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="space-y-5">
        {/* AI Training Computation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-lg">
            <CardHeader>
              <CardTitle>AI Training Computation Growth</CardTitle>
            </CardHeader>
            <CardContent className="relative w-full pt-[56.25%]">
              <iframe
                src="https://ourworldindata.org/grapher/artificial-intelligence-training-computation?time=2005-08-07..latest&tab=chart"
                title="AI Training Computation"
                className="absolute top-0 left-0 w-full h-full border-none rounded-xl"
                allowFullScreen
              ></iframe>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cumulative AI Systems by Country */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Card className="transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-lg">
            <CardHeader>
              <CardTitle>Cumulative AI Systems by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src="https://ourworldindata.org/grapher/cumulative-number-of-large-scale-ai-systems-by-country?country=USA~CHN~GBR~Multinational~ISR~FRA~CAN~ARE~DEU~FIN~HKG~IND&tab=chart"
                loading="lazy"
                className="w-full h-[450px] border-none rounded-xl"
                allow="web-share; clipboard-write"
                title="Cumulative AI Systems by Country"
              ></iframe>
            </CardContent>
          </Card>
        </motion.div>

        {/* Public Views on AI Impact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Card className="transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-lg">
            <CardHeader>
              <CardTitle>Public Views on AI’s Impact (Next 20 Years)</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src="https://ourworldindata.org/grapher/views-ai-impact-society-next-20-years?tab=chart"
                loading="lazy"
                className="w-full h-[500px] border-none rounded-xl"
                allow="web-share; clipboard-write"
                title="Public Views on AI Impact"
              ></iframe>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
