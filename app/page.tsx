import Image from 'next/image';
import FeatureCard from '../components/FeatureCard';
import ShowcaseItem from '../components/ShowcaseItem';

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
    ),
    title: 'Expert Development',
    description: 'Custom software development tailored to your specific business needs, from web to mobile applications.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707"></path></svg>
    ),
    title: 'Innovative Solutions',
    description: 'We leverage the latest technologies to build future-proof applications that give you a competitive edge.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5V8h-5v12zM8 20H3V8h5v12zM12.5 3h-1A6.5 6.5 0 005 9.5V20h14V9.5A6.5 6.5 0 0012.5 3z"></path></svg>
    ),
    title: 'Dedicated Support',
    description: 'Our team is here to support you every step of the way, ensuring your project is a success.',
  },
];

const showcaseItems = [
  {
    imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Project Alpha",
    description: "A comprehensive enterprise solution that streamlined operations and increased productivity by 40%. We built a custom dashboard with real-time data analytics and a user-friendly interface."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Project Beta",
    description: "A mobile-first platform for a fast-growing startup. The app provides a seamless user experience and has been featured in the app store for its innovative design and functionality.",
    reverse: true
  }
];

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="md:w-3/4 lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Transforming Ideas into Digital Reality
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Innovatech is your partner in building cutting-edge software solutions that drive growth and efficiency.
            </p>
            <div className="flex space-x-4">
              <a href="#cta" className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
                Get Started
              </a>
              <a href="#showcase" className="bg-gray-700 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition duration-300">
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Image 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          layout="fill"
          objectFit="cover"
          alt="Background"
          className="-z-10"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Why Choose Innovatech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Our Work in Action</h2>
          <div className="flex flex-col gap-12">
            {showcaseItems.map((item, index) => (
              <ShowcaseItem key={index} imageSrc={item.imageSrc} title={item.title} description={item.description} reverse={item.reverse} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your project?</h2>
          <p className="text-lg md:text-xl mb-8">Let's build something amazing together.</p>
          <a href="mailto:contact@innovatech.com" className="bg-white text-indigo-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-200 transition duration-300 transform hover:scale-105">
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
