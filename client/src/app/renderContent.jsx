import React from "react";
import { Card } from "@/Components/ui/card";

const RenderContent = ({ content }) => {
  if (!Array.isArray(content) || content.length === 0) {
    return <div className="text-center text-gray-500">No content available.</div>;
  }
  const { blocks } = content[0];

  if (!blocks || !Array.isArray(blocks)) {
    return <div className="text-center text-gray-500">No content available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index} className="mb-4">{block.data.text}</p>;

          case "header":
            return (
              <h2
                key={index}
                className={`text-${block.data.level === 1 ? "2xl" : "xl"} font-bold mb-4`}
              >
                {block.data.text}
              </h2>
            );

          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`list-inside mb-4 ${
                  block.data.style === "ordered" ? "list-decimal" : "list-disc"
                }`}
              >
                {block.data.items.map((item, i) => (
                  <li key={i}>
                    {item.content}
                    {item.items && item.items.length > 0 && (
                      <ListTag className="ml-4 list-inside">
                        {item.items.map((subItem, j) => (
                          <li key={j}>{subItem.content}</li>
                        ))}
                      </ListTag>
                    )}
                  </li>
                ))}
              </ListTag>
            );

          case "checklist":
            return (
              <ul key={index} className="list-none mb-4">
                {block.data.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    {item.content}
                  </li>
                ))}
              </ul>
            );

          case "image":
            return (
              <Card key={index} className="p-4 my-4">
                <img
                  src={block.data.file.url}
                  alt={block.data.caption}
                  className="w-full rounded-lg"
                />
                {block.data.caption && (
                  <p className="text-center text-gray-600 mt-2">{block.data.caption}</p>
                )}
              </Card>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default RenderContent;
