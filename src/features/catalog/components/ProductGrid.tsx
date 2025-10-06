import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import ProductImageGallery from './ProductImageGallery';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  image_url: string;
  category: string;
}

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const categoryDisplayNames = {
  'doble-crema': 'Quesos Doble Crema',
  'oaxaca': 'Quesos Oaxaca',
  'manchego': 'Quesos Manchego',
  'specialty': 'Quesos Especiales',
};

const ProductGrid = () => {
  const { data: content, isLoading: isContentLoading } = useSiteContent('catalog');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({ 
    queryKey: ['products'], 
    queryFn: fetchProducts 
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (priceRange && priceRange !== 'all') {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case 'low':
            return product.price <= 50;
          case 'medium':
            return product.price > 50 && product.price <= 120;
          case 'high':
            return product.price > 120;
          default:
            return true;
        }
      });
    }

    if (sizeFilter && sizeFilter !== 'all') {
      filtered = filtered.filter(product => {
        const weight = product.weight.toLowerCase();
        switch (sizeFilter) {
          case 'small':
            return weight.includes('200') || weight.includes('400');
          case 'medium':
            return weight.includes('500');
          case 'large':
            return weight.includes('1 kg') || weight.includes('1kg');
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [search, category, priceRange, sizeFilter, products]);

  return (
    <section id="catalog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div role="heading" aria-level="2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient">
            {isContentLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : content?.title || 'Lorem Ipsum'}
          </div>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isContentLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : content?.subtitle || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </div>
        </motion.div>

        <ProductImageGallery />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center"
        >
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="doble-crema">Quesos Doble Crema</SelectItem>
              <SelectItem value="oaxaca">Quesos Oaxaca</SelectItem>
              <SelectItem value="manchego">Quesos Manchego</SelectItem>
              <SelectItem value="specialty">Quesos Especiales</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSizeFilter} value={sizeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tamaño" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tamaños</SelectItem>
              <SelectItem value="small">Pequeño (200-400g)</SelectItem>
              <SelectItem value="medium">Mediano (500g)</SelectItem>
              <SelectItem value="large">Grande (1kg)</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setPriceRange} value={priceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por precio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los precios</SelectItem>
              <SelectItem value="low">Hasta $50</SelectItem>
              <SelectItem value="medium">$50 - $120</SelectItem>
              <SelectItem value="high">Más de $120</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="gradient-card border-0 shadow-lg">
                  <Skeleton className="w-full h-[200px] rounded-md mb-4" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))
            : filteredProducts.map(product => (
                <Dialog key={product.id}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (product.id % 8) * 0.1 }}
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer h-full"
                    >
                      <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative">
                          <img
                            src={product.image_url || '/images/cheese-with-bread.png'}
                            alt={product.name}
                            className="w-full h-full rounded-md mb-4"
                          />
                          <Badge className="absolute top-2 right-2 text-xs">
                            {product.weight}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-primary font-bold text-lg">
                              ${product.price.toFixed(2)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {categoryDisplayNames[product.category]}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {selectedProduct && (
                      <>
                        <div className="flex items-center justify-center">
                          <img
                            src={selectedProduct.image_url || '/images/cheese-with-bread.png'}
                            alt={selectedProduct.name}
                            className="rounded-lg shadow-lg object-contain max-h-[70vh]"
                          />
                        </div>
                        <div className="flex flex-col justify-center space-y-4">
                          <div>
                            <Badge className="text-sm mb-2">{selectedProduct.weight}</Badge>
                            <h2 className="font-heading text-3xl font-bold text-foreground">{selectedProduct.name}</h2>
                          </div>
                          <p className="text-muted-foreground text-base">{selectedProduct.description}</p>
                          <div className="flex items-center justify-between pt-4">
                            <span className="text-primary font-bold text-2xl">${selectedProduct.price.toFixed(2)}</span>
                            <Badge variant="secondary" className="text-sm">{categoryDisplayNames[selectedProduct.category]}</Badge>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={`placeholder-${i}`} className="gradient-card border-0 shadow-lg h-full">
                <div className="relative">
                  <img
                    src={'/images/cheese-with-bread.png'}
                    alt="Lorem Ipsum"
                    className="w-full h-full rounded-md mb-4"
                  />
                  <Badge className="absolute top-2 right-2 text-xs">
                    1kg
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
                    Lorem Ipsum
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-bold text-lg">
                      $99.99
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Lorem
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;