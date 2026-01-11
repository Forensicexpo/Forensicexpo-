import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvents } from '@/db/api';
import type { Event } from '@/types/types';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(filter === 'all' ? undefined : filter);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-info text-white';
      case 'ongoing':
        return 'bg-success text-white';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 max-sm:text-3xl">
            Forensic Science Events
          </h1>
          <p className="text-lg text-muted-foreground max-sm:text-base">
            Discover upcoming exhibitions, conferences, and workshops in forensic science.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Events
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'ongoing' ? 'default' : 'outline'}
            onClick={() => setFilter('ongoing')}
          >
            Ongoing
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted animate-pulse mb-2 rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden shadow-card hover:shadow-hover transition-shadow"
              >
                <div className="h-48 bg-muted overflow-hidden relative">
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
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        {format(new Date(event.start_date), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(event.end_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Max {event.max_attendees} attendees</span>
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events found for the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
