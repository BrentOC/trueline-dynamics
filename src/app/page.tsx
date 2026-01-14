import ProductFeed from '@/components/ProductFeed';
import Banner from '@/components/Banner';

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* The Hero Section */}
      <Banner />

      {/* The Product List (pulled slightly up to overlap the banner like Amazon) */}
      <div className="relative z-20">
        <ProductFeed />
      </div>
    </div>
  );
}