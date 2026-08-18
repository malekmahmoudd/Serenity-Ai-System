"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Activity,
  Sun,
  Moon,
  Heart,
  Trophy,
  Bell,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/dialog";


import { useSession } from "@/lib/contexts/session-context";
import { getUserActivities, saveMoodData, logActivity } from "@/lib/static-dashboard-data";

import { cn } from "@workspace/ui/lib/utils";

/* -------------------- TYPES -------------------- */
type ActivityLevel = "none" | "low" | "medium" | "high";

interface Activity {
  id: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: Date;
  duration: number | null;
  completed: boolean;
  moodScore: number | null;
  moodNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyStats {
  moodScore: number | null;
  completionRate: number;
  mindfulnessCount: number;
  totalActivities: number;
  lastUpdated: Date;
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [activities, setActivities] = useState<Activity[]>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);

  const [dailyStats, setDailyStats] = useState<DailyStats>({
    moodScore: null,
    completionRate: 100,
    mindfulnessCount: 0,
    totalActivities: 0,
    lastUpdated: new Date(),
  });

  const handleStartTherapy = () => {
    router.push("/therapy/new");
  };

  /* -------------------- AUTH STATES -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          You need to sign in to view this page.
        </p>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-24 pb-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.name || user.email}
            </h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => void logout()}>
              Sign out
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* QUICK ACTION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Button onClick={handleStartTherapy}>
              Start Therapy
            </Button>

            <Button variant="outline" onClick={() => setShowMoodModal(true)}>
              Track Mood
            </Button>
          </CardContent>
        </Card>

        {/* STATS */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Therapy Sessions: {dailyStats.mindfulnessCount}</p>
            <p>Total Activities: {dailyStats.totalActivities}</p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}