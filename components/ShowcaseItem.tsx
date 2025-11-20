import Image from 'next/image';

interface ShowcaseItemProps {
  imageSrc: string;
  title: string;
  description: string;
  reverse?: boolean;
}

export default function ShowcaseItem({ imageSrc, title, description, reverse = false }: ShowcaseItemProps) {
  const flexDirection = reverse ? 'md:flex-row-reverse' : 'md:flex-row';

  return (
    <div className={`flex flex-col ${flexDirection} items-center bg-white rounded-lg shadow-lg overflow-hidden mb-12`}>
      <div className="md:w-1/2">
        <Image src={imageSrc} alt={title} width={600} height={400} objectFit="cover" />
      </div>
      <div className="md:w-1/2 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
