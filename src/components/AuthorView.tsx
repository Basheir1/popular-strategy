import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Play, FileText } from 'lucide-react';

interface AuthorViewProps {
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  posts: Array<{
    id: string;
    type: 'video' | 'article';
    title: string;
    date: string;
    quarter: string;
    thumbnail: string;
    summary?: string;
  }>;
  onBack: () => void;
  onPostClick: (postId: string) => void;
}

export const AuthorView: React.FC<AuthorViewProps> = ({
  author,
  posts,
  onBack,
  onPostClick
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 h-7 px-2 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full">
          {/* Author Header */}
          <div className="px-4 md:px-6 pt-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-2 border-gray-200 rounded">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="text-xl">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl text-gray-900 mb-2">{author.name}</h1>
                <p className="text-sm text-gray-600 leading-relaxed">{author.bio}</p>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="px-4 md:px-6 py-6">
            <div className="mb-4">
              <h2 className="text-lg text-gray-900">Posts</h2>
              <p className="text-xs text-gray-500 mt-1">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {posts.map((post) => (
                <Card 
                  key={post.id}
                  className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden rounded"
                  onClick={() => onPostClick(post.id)}
                >
                  <div className="flex gap-4 p-4">
                    {/* Post Thumbnail */}
                    <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-900">
                      {post.type === 'video' ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageWithFallback 
                            src={post.thumbnail} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 right-1.5 bg-white/95 p-1">
                            <FileText className="w-3 h-3 text-gray-700" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Post Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm text-gray-900 leading-tight flex-1">
                          {post.title}
                        </h3>
                        <div className="flex-shrink-0 text-xs text-red-600 tracking-wide">
                          {post.quarter}
                        </div>
                      </div>
                      {post.summary && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">
                          {post.summary}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-auto">{post.date}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
