import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BannerCarousel from '@/components/BannerCarousel';
import CategoryGrid from '@/components/CategoryGrid';
import ProductSection from '@/components/ProductSection';
import { fetchProducts } from '@/api/client';
import { Product } from '@/data/products';

const Index = () => {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts()
  });

  // Client-side filtering for now, until we make specific API endpoints for these
  const featuredProducts = allProducts.slice(0, 6);
  const flashSaleProducts = allProducts.filter((p: Product) => p.discountPercentage >= 30).slice(0, 6);
  const electronicsProducts = allProducts.filter((p: Product) => p.category === 'electronics').slice(0, 6);
  const fashionProducts = allProducts.filter((p: Product) => p.category === 'fashion').slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <ProductSection
            title="Flash Sale"
            subtitle="Grab the best deals before they're gone!"
            products={flashSaleProducts}
            viewAllLink="/search?sale=flash"
            badge="LIVE"
            countdown="05:23:45"
          />
        )}

        {/* Featured Products */}
        <div className="my-2 md:my-4">
          <ProductSection
            title="Best Sellers"
            subtitle="Top picks loved by customers"
            products={featuredProducts}
            viewAllLink="/search"
          />
        </div>

        {/* Electronics Section */}
        {electronicsProducts.length > 0 && (
          <div className="my-2 md:my-4">
            <ProductSection
              title="Electronics Store"
              subtitle="Latest gadgets and tech deals"
              products={electronicsProducts}
              viewAllLink="/search?category=electronics"
            />
          </div>
        )}

        {/* Fashion Section */}
        {fashionProducts.length > 0 && (
          <div className="my-2 md:my-4">
            <ProductSection
              title="Fashion Picks"
              subtitle="Trending styles for you"
              products={fashionProducts}
              viewAllLink="/search?category=fashion"
            />
          </div>
        )}

        {/* Promotional Banner */}
        <section className="container mx-auto px-4 my-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 md:p-12 text-primary-foreground">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Become a Flipkart Seller
              </h2>
              <p className="text-primary-foreground/90 mb-6">
                Sell online to 50 Cr+ customers at 0% commission. Grow your business with Flipkart!
              </p>
              <button className="btn-flipkart-secondary">
                Start Selling
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
