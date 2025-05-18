import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Heading, Text } from 'lucide-react';

interface DocumentListCard {
  key: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  rating: string;
  view: string;
  pageCount: string;
  createdByName: string;
//   categories: string[];
}

// Define the props for DocumentCard
interface DocumentCardProps {
  document: DocumentListCard;
}

const DocumentListCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { title, description, thumbnailUrl, rating, view, pageCount, createdByName } = document;
  return (
    <Card className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 p-4">
      <Image src={thumbnailUrl} alt={title} className="w-32 h-32 object-cover rounded" />
      <div className="flex-1">
        <CardHeader>
          <Heading size="lg">{title}</Heading>
        </CardHeader>
        <CardContent>
          <Text className="text-gray-600">{description}</Text>
          <div className="mt-2">
            <Text className="text-sm text-gray-500">
              {rating} • {view} views • {pageCount} pages • Được tải lên bởi {createdByName}
            </Text>
          </div>
          {/* <div className="mt-2">
            {categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="mr-2">
                {category}
              </Badge>
            ))}
          </div> */}
        </CardContent>
        <CardFooter>
          <Button>View/Download</Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default DocumentListCard;