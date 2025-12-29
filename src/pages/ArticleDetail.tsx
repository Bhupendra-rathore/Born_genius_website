import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { fetchArticleBySlug, Article, incrementArticleViews } from '../services/articlesService';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (slug: string) => {
    try {
      const data = await fetchArticleBySlug(slug);
      setArticle(data);

      if (data) {
        const sessionId = getOrCreateSessionId();
        await incrementArticleViews(data.id, sessionId);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateSessionId = (): string => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'News': 'bg-blue-100 text-blue-700',
      'Tips': 'bg-green-100 text-green-700',
      'Events': 'bg-orange-100 text-orange-700',
      'Education': 'bg-purple-100 text-purple-700',
      'Parenting Tips': 'bg-pink-100 text-pink-700',
      'Child Development': 'bg-teal-100 text-teal-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 mt-8 md:mt-10">{paragraph.replace('# ', '')}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 mt-6 md:mt-8">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 mt-4 md:mt-6">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="text-gray-700 text-base md:text-lg leading-relaxed ml-4">{paragraph.replace('- ', '')}</li>;
      }
      if (paragraph.trim() === '') {
        return <div key={index} className="h-4 md:h-6"></div>;
      }
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <p key={index} className="text-gray-900 text-base md:text-lg font-bold leading-relaxed mb-4 md:mb-6">{paragraph.replace(/\*\*/g, '')}</p>;
      }
      return <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6">{paragraph}</p>;
    });
  };

  if (loading) {
    return (
      <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
        <div className="max-w-[420px] md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
        <div className="max-w-[420px] md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <button
            onClick={() => navigate('/updates')}
            className="flex items-center gap-2 text-brand-blue font-medium mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Updates
          </button>
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">Article not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <div className="max-w-[420px] md:max-w-3xl lg:max-w-4xl mx-auto">
        <header className="sticky top-0 bg-white shadow-sm z-10 px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/updates')}
              className="flex items-center gap-2 text-brand-blue font-medium hover:text-brand-blue/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">Back</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share article"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
          </div>
        </header>

        <article className="px-4 md:px-6 py-6 md:py-8">
          <div className="mb-4 md:mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getCategoryColor(article.category)}`}>
              <Tag className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{article.author_photo || '👨‍🏫'}</span>
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {article.reading_time_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.reading_time_minutes} min read
              </div>
            )}
          </div>

          {article.image_url && (
            <div className="mb-6 rounded-2xl overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {formatContent(article.content)}
          </div>
        </article>

        <div className="px-4 py-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/updates')}
            className="w-full py-3 px-6 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue/90 transition-colors"
          >
            Read More Articles
          </button>
        </div>
      </div>
    </div>
  );
};
