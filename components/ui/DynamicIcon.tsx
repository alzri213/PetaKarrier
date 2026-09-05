import React from "react";
import {
  UtensilsCrossed,
  Utensils,
  Coffee,
  PackageCheck,
  Shirt,
  Palette,
  Sparkles,
  ShoppingBag,
  Brush,
  Smartphone,
  Camera,
  Gift,
  Laptop,
  BarChart3,
  Wrench,
  Rocket,
  Scissors,
  Heart,
  Smile,
  BookOpen,
  Baby,
  ChefHat,
  Languages,
  Bike,
  GraduationCap,
  Sprout,
  Trees,
  Flower2,
  Bug,
  Briefcase,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  UtensilsCrossed,
  Utensils,
  Coffee,
  PackageCheck,
  Shirt,
  Palette,
  Sparkles,
  ShoppingBag,
  Brush,
  Smartphone,
  Camera,
  Gift,
  Laptop,
  BarChart3,
  Wrench,
  Rocket,
  Scissors,
  Heart,
  Smile,
  BookOpen,
  Baby,
  ChefHat,
  Languages,
  Bike,
  GraduationCap,
  Sprout,
  Trees,
  Flower2,
  Bug,
  Briefcase,
};

interface DynamicIconProps extends LucideProps {
  name?: string;
  fallback?: React.ComponentType<LucideProps>;
}

export default function DynamicIcon({
  name,
  fallback: Fallback = Briefcase,
  ...props
}: DynamicIconProps) {
  if (!name) return <Fallback {...props} />;
  const Comp = ICON_MAP[name] || Fallback;
  return <Comp {...props} />;
}
