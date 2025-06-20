import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">E-Shop</h3>
            <p className="text-gray-400">Your one-stop shop for all things electronic. Quality products, competitive prices.</p>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/electronics" className="text-gray-400 hover:text-white transition-colors">Electronics</a></li>
              <li><a href="/accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</a></li>
              <li><a href="/gadgets" className="text-gray-400 hover:text-white transition-colors">Gadgets</a></li>
              <li><a href="/wearables" className="text-gray-400 hover:text-white transition-colors">Wearables</a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-gray-400">Subscribe to get special offers and updates</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;


