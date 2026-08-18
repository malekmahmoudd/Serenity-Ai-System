import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@workspace/ui/components/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full pt-24 pb-16">
      <Container>
        <h1 className="text-3xl font-bold mb-4">About SerenityX</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          This page is a placeholder. Share your mission and team story here.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </div>
  );
}
