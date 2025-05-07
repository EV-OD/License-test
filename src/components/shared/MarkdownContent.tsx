
'use client';

import React from 'react';
import Link from 'next/link';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Trim leading/trailing whitespace from the whole content string
  const trimmedContent = content.trim();
  // Split by one or more empty lines (effectively \n\n, \n \n, etc.)
  const blocks = trimmedContent.split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, index) => {
        // Trim individual blocks to handle potential leading/trailing whitespace from split
        const trimmedBlock = block.trim();
        if (trimmedBlock.startsWith('### ')) {
          const headingText = trimmedBlock.substring(4);
          const parts = headingText.split(/(\[.*?\]\(.*?\))/g); // Split by [text](link)
          return (
            <h3 key={index}>
              {parts.map((part, i) => {
                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                  return (
                    <Link key={i} href={match[2]} className="text-primary hover:underline no-underline">
                      {match[1]}
                    </Link>
                  );
                }
                return part;
              })}
            </h3>
          );
        }
        
        // Handle paragraphs and links within them
        const parts = trimmedBlock.split(/(\[.*?\]\(.*?\))/g); // Split by [text](link)
        if (trimmedBlock) { // Only render <p> if block is not empty after trimming
            return (
              <p key={index}>
                {parts.map((part, i) => {
                  const match = part.match(/\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    return (
                      <Link key={i} href={match[2]} className="text-primary hover:underline no-underline">
                        {match[1]}
                      </Link>
                    );
                  }
                  return part;
                })}
              </p>
            );
        }
        return null; // Do not render empty paragraphs
      })}
    </>
  );
};

export default MarkdownContent;
