"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Cannabis,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
  Shield,
  Sparkles,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Slider } from "@workspace/ui/components/slider";
import { Card, CardHeader, CardContent } from "@workspace/ui/components/card";
import { Ripple } from "@workspace/ui/components/ripple";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";

type Emotion = {
  value: number;
  label: string;
  emoji: string;
  color: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
};

type WelcomeStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const EMOTIONS: Emotion[] = [
  { value: 0, emoji: "😔", label: "Down", color: "from-blue-500/50" },
  { value: 25, emoji: "😊", label: "Content", color: "from-green-500/50" },
  { value: 50, emoji: "😌", label: "Peaceful", color: "from-purple-500/50" },
  { value: 75, emoji: "🤗", label: "Happy", color: "from-yellow-500/50" },
  { value: 100, emoji: "✨", label: "Excited", color: "from-pink-500/50" },
];

const DEFAULT_EMOTION: Emotion = EMOTIONS[2]!;

const WELCOME_STEPS: WelcomeStep[] = [
  {
    title: "Hi, I'm SerenityX 👋",
    description:
      "Your AI companion for emotional well-being. I'm here to provide a safe, judgment-free space for you to express yourself.",
    icon: Waves,
  },
  {
    title: "Personalized Support 🌱",
    description:
      "I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.",
    icon: Cannabis,
  },
  {
    title: "Your Privacy Matters 🛡️",
    description:
      "Our conversations are completely private and secure. I follow strict ethical guidelines and respect your boundaries.",
    icon: Shield,
  },
];

const FEATURES: Feature[] = [
  {
    icon: HeartPulse,
    title: "24/7 Support",
    description: "Always here to listen and support you, any time of day",
    color: "from-rose-500/20",
    delay: 0.2,
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Personalized guidance powered by emotional intelligence",
    color: "from-amber-500/20",
    delay: 0.4,
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your conversations are always confidential and encrypted",
    color: "from-emerald-500/20",
    delay: 0.6,
  },
  {
    icon: MessageSquareHeart,
    title: "Evidence-Based",
    description: "Therapeutic techniques backed by clinical research",
    color: "from-blue-500/20",
    delay: 0.8,
  },
];

export default function Page() {
  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    EMOTIONS.find((em) => Math.abs(emotion - em.value) < 15) ?? DEFAULT_EMOTION;

  const step = WELCOME_STEPS[currentStep] ?? WELCOME_STEPS[0]!;
  const StepIcon = step.icon;
  const isLastStep = currentStep === WELCOME_STEPS.length - 1;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse [animation-delay:700ms]" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>
        <Ripple className="opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative space-y-8 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
            <Waves className="w-4 h-4 animate-wave text-primary" />
            <span className="relative text-foreground/90 dark:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-primary/30 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
              Your AI Agent Mental Health Companion
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent hover:to-primary transition-all duration-300">
              Here to Listen
            </span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
              Here to Help
            </span>
          </h1>

          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Experience a new way of emotional support. Our AI companion is here
            to listen, understand, and guide you through life&apos;s journey.
          </p>

          {/* Emotion slider */}
          <motion.div
            className="w-full max-w-[600px] mx-auto space-y-6 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground/80 font-medium">
                Whatever you&apos;re feeling, we&apos;re here to listen
              </p>
              <div
                className="flex justify-between items-center px-2"
                role="group"
                aria-label="Choose how you feel"
              >
                {EMOTIONS.map((em) => {
                  const isActive = Math.abs(emotion - em.value) < 15;
                  return (
                    <button
                      key={em.value}
                      type="button"
                      aria-pressed={isActive}
                      aria-label={em.label}
                      onClick={() => setEmotion(em.value)}
                      className={`transition-all duration-500 ease-out cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md ${
                        isActive
                          ? "opacity-100 scale-110 transform-gpu"
                          : "opacity-50 scale-100"
                      }`}
                    >
                      <div className="text-2xl transform-gpu">{em.emoji}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">
                        {em.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative px-2">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-500`}
              />
              <Slider
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0] ?? 0)}
                min={0}
                max={100}
                step={1}
                aria-label="Emotion level"
                className="py-4"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Slide to express how you&apos;re feeling today
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => {
                setCurrentStep(0);
                setShowDialog(true);
              }}
              className="relative group h-12 px-8 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="relative z-10 font-medium flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              How SerenityX Helps You
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg">
              Experience a new kind of emotional support, powered by empathetic
              AI
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {FEATURES.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-[200px] bg-card/30 dark:bg-card/80 backdrop-blur-sm">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 dark:group-hover:opacity-30`}
                    />
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                          <FeatureIcon className="w-5 h-5 text-primary dark:text-primary/90" />
                        </div>
                        <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg">
          <DialogHeader>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="text-2xl text-center">
                  {step.title}
                </DialogTitle>
                <DialogDescription className="text-center text-base leading-relaxed">
                  {step.description}
                </DialogDescription>
              </motion.div>
            </AnimatePresence>
          </DialogHeader>

          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {WELCOME_STEPS.map((s, index) => (
                <div
                  key={s.title}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "bg-primary w-4" : "bg-primary/20 w-2"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (!isLastStep) {
                  setCurrentStep((c) => c + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                  // TODO: navigate to the chat interface
                }
              }}
              className="relative group px-6"
            >
              <span className="flex items-center gap-2">
                {isLastStep ? (
                  <>
                    Let&apos;s Begin
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
