import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            <svg className="h-8 w-8 inline-block mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Innovatech
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-indigo-600 transition duration-300">Features</Link>
          <Link href="#showcase" className="text-gray-600 hover:text-indigo-600 transition duration-300">Showcase</Link>
          <Link href="#cta" className="text-gray-600 hover:text-indigo-600 transition duration-300">Contact</Link>
          <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">Login</Link>
        </nav>
        <div className="md:hidden">
          {/* Mobile Menu Button */}
          <button className="text-gray-900">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
