import NavBar from "./components/NavBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Radio, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="px-4 py-4 lg:px-6 h-14 flex items-center border-b border-gray-200 dark:border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">FanTune</span>
        </Link>
        <nav className="ml-auto  flex gap-4 sm:gap-6">
          <div className="mt-2 flex gap-4 sm:gap-6">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#how-it-works"
            >
              How It Works
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#testimonials"
            >
              Testimonials
            </Link>
          </div>
          <ThemeToggle />
        </nav>
        <NavBar />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Soundtrack
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Empower your audience to curate your stream&apos;s playlist.
                  Create a unique experience for every broadcast.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Fan Engagement
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Boost interaction by letting fans vote on songs in
                    real-time.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Radio className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Live Streaming
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Seamless integration with popular streaming platforms.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Star className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Creator Tools
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Powerful analytics and customization options for creators.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 list-decimal list-inside">
              <li className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Create Your Stream</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Set up your stream and connect to your favorite platform.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Fans Join and Vote</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your audience joins the stream and votes on the next song.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">
                  Music Plays Automatically
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The most voted song plays next, creating a dynamic playlist.
                </p>
              </li>
            </ol>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Creator Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    &quot;FanTune has revolutionized my streams. The engagement
                    from my audience has skyrocketed!&quot;
                  </p>
                  <p className="font-semibold">- Alex, Music Streamer</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    &quot;I love how my fans can now be part of the music
                    selection process. It&apos;s created a whole new
                    dynamic.&quot;
                  </p>
                  <p className="font-semibold">- Sam, DJ and Producer</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Streams?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Join FanTune today and start creating unforgettable
                  experiences for your audience.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 FanTune. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
