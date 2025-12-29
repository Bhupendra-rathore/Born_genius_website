import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Tag, TrendingUp } from 'lucide-react';
import { fetchPublishedArticles, Article } from '../services/articlesService';

export const Updates: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchPublishedArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-[420px] md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Updates & News</h1>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            />
          </div>
        </div>
      </header>

      <div className="max-w-[420px] md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide mb-6 md:mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto mb-3" />
            </div>
            <p className="text-gray-600 font-medium">No articles found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => navigate(`/updates/${article.slug}`)}
                className="w-full bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all active:scale-[0.98] text-left h-full flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {article.category}
                  </span>
                  {article.views_count && article.views_count > 10 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {article.views_count} views
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="text-lg">{article.author_photo || '👨‍🏫'}</span>
                      <span className="font-medium">{article.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {article.reading_time_minutes && (
                    <span className="text-gray-400">{article.reading_time_minutes} min read</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
