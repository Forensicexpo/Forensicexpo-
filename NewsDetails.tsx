import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getNewsById } from '@/db/api';
import type { News } from '@/types/types';
import { format } from 'date-fns';

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const data = await getNewsById(id);
        if (!data || !data.published) {
          navigate('/404');
          return;
        }
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="h-12 bg-muted rounded w-full mb-4" />
            <div className="h-4 bg-muted rounded w-1/4 mb-8" />
            <div className="h-96 bg-muted rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>

          <article>
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 max-sm:text-3xl">
              {news.title}
            </h1>

            <div className="flex items-center space-x-2 text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              <span>
                {news.published_at
                  ? format(new Date(news.published_at), 'MMMM dd, yyyy')
                  : format(new Date(news.created_at), 'MMMM dd, yyyy')}
              </span>
            </div>

            {news.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-card">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none">
              <div className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {news.content}
              </div>
            </div>
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            <Button asChild variant="outline">
              <Link to="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All News
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
