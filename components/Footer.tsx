export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="md:flex md:justify-between md:items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <svg className="h-8 w-8 mr-2 text-indigo-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span className="text-2xl font-bold">Innovatech</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">LinkedIn</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">&copy; 2024 Innovatech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
