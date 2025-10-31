import React from 'react';
import { ArrowLeft, Twitter, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface AboutViewProps {
  onBack: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto">
      {/* Mobile Back Button */}
      <div className="md:hidden bg-white border-b border-gray-300 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-gray-900">About</h1>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:block px-6 py-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Centered Content Card */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-gray-900 mb-6">About Popular Strategy</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Popular Strategy helps investors learn from great thinkers and real strategies — not hype.
              We bring together authors who share their best investment ideas through concise Posts and Tips, while you build your own Notes, Trade Journals, and Convictions around each stock.
            </p>

            <p>
              Our goal is simple: turn information overload into insight — so every investor can make more thoughtful, independent decisions.
            </p>

            <p>
              We'd love your feedback!
              Follow us on{' '}
              <a
                href="https://x.com/PopStrategyAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                X
                <Twitter className="w-3.5 h-3.5" />
              </a>
              {' '}or read our deeper updates on our{' '}
              <a
                href="https://popularstrategy.substack.com/p/why-popular-strategy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                Blog
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
