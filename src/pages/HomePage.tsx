import { ArrowRight, Shield, Users, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Premium Quality',
      description: 'All our products undergo rigorous quality testing to ensure maximum durability and performance.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Trusted by Thousands',
      description: 'Serving builders, contractors, and retailers across the region with consistent quality and service.'
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Industry Experience',
      description: 'Decades of expertise in hardware manufacturing and trading, understanding market needs perfectly.'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1216555/pexels-photo-1216555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop")'
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trusted Hardware Solutions for
              <span className="text-orange-400 block">Builders & Retailers</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Quality clamps, dummies, and hardware products manufactured with precision. 
              Your reliable partner for all construction and hardware needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <span>View Our Products</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/919444899535"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Get Instant Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                About Bhavani Traders
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A trusted name in hardware manufacturing and trading, committed to delivering 
                exceptional quality products that meet the evolving needs of the construction industry.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Established with a vision to provide reliable hardware solutions, Bhavani Traders 
                  has grown from a small trading business to a comprehensive manufacturer and supplier 
                  of premium quality clamps and hardware products.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our commitment to quality, innovation, and customer satisfaction has earned us 
                  the trust of builders, contractors, and retailers across the region.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Quality Guaranteed</span>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Hardware Manufacturing"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg"></div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 text-center group"
                >
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Contact us today for immediate assistance with your hardware needs. 
              Our team is ready to help you find the perfect solution.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-800 p-6 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <Phone className="h-8 w-8 mx-auto mb-3 text-orange-400" />
                <h4 className="font-semibold mb-2">Call Us</h4>
                <p className="text-blue-100">+91 94448 99535</p>
              </div>
              <div className="bg-blue-800 p-6 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <Mail className="h-8 w-8 mx-auto mb-3 text-orange-400" />
                <h4 className="font-semibold mb-2">Email Us</h4>
                <p className="text-blue-100">bhavanitraders75@gmail.com</p>
              </div>
              <div className="bg-blue-800 p-6 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-orange-400" />
                <h4 className="font-semibold mb-2">Visit Us</h4>
                <p className="text-blue-100">No.1/55 Iyyar Street, Nerkundram</p>
              </div>
            </div>

            <a
              href="https://wa.me/919444899535"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;