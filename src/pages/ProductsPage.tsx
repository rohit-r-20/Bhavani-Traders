import { MessageCircle, ArrowRight } from 'lucide-react';

const ProductsPage = () => {
  const products = [
    {
      id: 1,
      name: 'GI U Clamps',
      description: 'High-quality galvanized iron U-clamps for secure pipe and cable installations. Available in various sizes.',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      features: ['Galvanized coating', 'Multiple sizes', 'Corrosion resistant', 'Heavy-duty construction']
    },
    {
      id: 2,
      name: 'Special Clamps',
      description: 'Custom-designed clamps for specific applications. Engineered for maximum grip and durability.',
      image: 'https://images.pexels.com/photos/1216555/pexels-photo-1216555.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      features: ['Custom designs', 'Superior grip', 'Industrial grade', 'Long-lasting']
    },
    {
      id: 3,
      name: 'Apartment Clamps',
      description: 'Specialized clamps designed for apartment and residential construction projects.',
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      features: ['Residential use', 'Easy installation', 'Compact design', 'Reliable performance']
    },
    {
      id: 4,
      name: 'Bore Clamps',
      description: 'Heavy-duty clamps specifically designed for bore well installations and water pipe systems.',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      features: ['Water resistant', 'High pressure rated', 'Secure fitting', 'Professional grade']
    },
    {
      id: 5,
      name: 'Bore Dummies',
      description: 'Essential components for bore well systems, ensuring proper alignment and support.',
      image: 'https://images.pexels.com/photos/1108102/pexels-photo-1108102.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      features: ['Precision engineered', 'Alignment support', 'Durable materials', 'Easy maintenance']
    }
  ];

  const handleEnquire = (productName: string) => {
    const message = `Hello! I'm interested in ${productName}. Please provide more details and pricing.`;
    window.open(`https://wa.me/919444899535?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of premium quality clamps and hardware products, 
            designed to meet the diverse needs of construction and industrial applications.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleEnquire(product.name)}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Enquire Now</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex-1">
                    <span>Get Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-lg text-blue-100 mb-6">
            We specialize in custom hardware solutions. Contact us to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919444899535"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Chat with Expert
            </a>
            <a
              href="tel:+919444899535"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;