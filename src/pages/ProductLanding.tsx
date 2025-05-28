
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart, Product } from '../contexts/CartContext';
import { getAllProducts } from '../services/productService';
import { useToast } from '@/hooks/use-toast';

const ProductLanding = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { setCartItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        if (productsData.length > 0) {
          const firstProduct = productsData[0];
          setSelectedProduct(firstProduct);
          setSelectedColor(firstProduct.variants.color[0]);
          setSelectedSize(firstProduct.variants.size[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.variants.color[0]);
    setSelectedSize(product.variants.size[0]);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    if (!selectedColor || !selectedSize) {
      toast({
        title: "Please select options",
        description: "Please select both color and size before proceeding",
        variant: "destructive"
      });
      return;
    }

    const cartItem = {
      ...selectedProduct,
      selectedColor,
      selectedSize,
      quantity
    };

    setCartItem(cartItem);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">eS</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">eSalesOne</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              Premium Store
            </Badge>
          </div>
        </div>
      </header>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our premium collection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      In Stock
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="relative overflow-hidden rounded-2xl product-shadow">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-96 md:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      In Stock
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-blue-600">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  <Badge variant="outline" className="text-sm">
                    Free Shipping
                  </Badge>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProduct.variants.color.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProduct.variants.size.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10"
                        >
                          -
                        </Button>
                        <span className="text-xl font-semibold w-12 text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-10 h-10"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleBuyNow}
                      className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Buy Now - ${(selectedProduct.price * quantity).toFixed(2)}
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>{selectedProduct.inventory} in stock</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Free returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLanding;
