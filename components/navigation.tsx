'use client';

import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  label: string;
}

interface NavigationProps {
  categories: Category[];
}

export default function Navigation({ categories }: NavigationProps) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mb-16 flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className="rounded-full border border-white/10 hover:bg-white/5"
          onClick={() => scrollToSection(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}