import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Newspaper, Mail, ArrowRight, Microscope, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvents, getPublishedNews } from '@/db/api';
import type { Event, News } from '@/types/types';
import { format } from 'date-fns';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, news] = await Promise.all([
          getEvents('upcoming'),
          getPublishedNews(3),
        ]);
        setUpcomingEvents(events.slice(0, 3));
        setLatestNews(news);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-background py-20 xl:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow stagger-3"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6 max-sm:text-3xl animate-fade-in-down">
              <span className="gradient-text">Forensic Expo Organisation</span>
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground mb-8 max-sm:text-base animate-fade-in-up stagger-1">
              Join the premier platform for forensic science exhibitions, professional development,
              and cutting-edge research collaboration.
            </p>
            <div className="flex flex-col @md:flex-row gap-4 justify-center @container animate-fade-in-up stagger-2">
              <Button asChild size="lg" className="hover-lift hover-glow">
                <Link to="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-lift">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xl:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4 max-sm:text-2xl">
              Why Choose Forensic Expo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leading the way in forensic science exhibitions and professional development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 animate-float">
                  <Microscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Cutting-Edge Research
                </h3>
                <p className="text-muted-foreground">
                  Access the latest developments in forensic science and technology through our
                  comprehensive exhibitions and presentations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 animate-float stagger-1">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Professional Network
                </h3>
                <p className="text-muted-foreground">
                  Connect with leading forensic scientists, researchers, and practitioners from
                  around the world.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-3">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 animate-float stagger-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Excellence & Innovation
                </h3>
                <p className="text-muted-foreground">
                  Participate in award-winning events that showcase excellence and drive innovation
                  in forensic science.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 xl:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground max-sm:text-2xl">
              Upcoming Events
            </h2>
            <Button asChild variant="outline">
              <Link to="/events">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted animate-pulse mb-2 rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden shadow-card hover:shadow-hover transition-shadow"
                >
                  <div className="h-48 bg-muted overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Calendar className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {format(new Date(event.start_date), 'MMM dd, yyyy')} • {event.location}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming events at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 xl:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground max-sm:text-2xl">
              Latest News
            </h2>
            <Button asChild variant="outline">
              <Link to="/news">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted animate-pulse mb-2 rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <Card key={news.id} className="shadow-card hover:shadow-hover transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{news.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {news.excerpt || news.content.substring(0, 150) + '...'}
                    </p>
                    <Button asChild variant="link" className="p-0">
                      <Link to={`/news/${news.id}`}>
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No news articles available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xl:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl xl:text-4xl font-bold mb-4 max-sm:text-2xl">
            Ready to Join Us?
          </h2>
          <p className="text-lg xl:text-xl mb-8 opacity-90 max-sm:text-base">
            Get in touch to learn more about our events and how you can participate.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
