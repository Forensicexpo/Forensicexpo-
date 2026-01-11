import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Newspaper, Users, ClipboardList, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvents, getAllNews, getRegistrations, getProfiles } from '@/db/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalNews: 0,
    publishedNews: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, news, registrations, profiles] = await Promise.all([
          getEvents(),
          getAllNews(),
          getRegistrations(),
          getProfiles(),
        ]);

        setStats({
          totalEvents: events.length,
          upcomingEvents: events.filter((e) => e.status === 'upcoming').length,
          totalNews: news.length,
          publishedNews: news.filter((n) => n.published).length,
          totalRegistrations: registrations.length,
          pendingRegistrations: registrations.filter((r) => r.status === 'pending').length,
          totalUsers: profiles.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      subtitle: `${stats.upcomingEvents} upcoming`,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'News Articles',
      value: stats.totalNews,
      subtitle: `${stats.publishedNews} published`,
      icon: Newspaper,
      color: 'text-secondary',
    },
    {
      title: 'Registrations',
      value: stats.totalRegistrations,
      subtitle: `${stats.pendingRegistrations} pending`,
      icon: ClipboardList,
      color: 'text-success',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: 'Registered users',
      icon: Users,
      color: 'text-info',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Forensic Expo Organisation admin panel
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <a
                href="/admin/events"
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-foreground">Manage Events</h3>
                <p className="text-sm text-muted-foreground">Create and edit events</p>
              </a>
              <a
                href="/admin/news"
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Newspaper className="h-6 w-6 text-secondary mb-2" />
                <h3 className="font-semibold text-foreground">Manage News</h3>
                <p className="text-sm text-muted-foreground">Publish news articles</p>
              </a>
              <a
                href="/admin/papers"
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <FileText className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold text-foreground">Manage Papers</h3>
                <p className="text-sm text-muted-foreground">Review paper submissions</p>
              </a>
              <a
                href="/admin/registrations"
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <ClipboardList className="h-6 w-6 text-success mb-2" />
                <h3 className="font-semibold text-foreground">View Registrations</h3>
                <p className="text-sm text-muted-foreground">Manage event registrations</p>
              </a>
              <a
                href="/admin/users"
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Users className="h-6 w-6 text-info mb-2" />
                <h3 className="font-semibold text-foreground">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and edit user roles</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
