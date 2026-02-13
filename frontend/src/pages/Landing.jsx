import { Link } from 'react-router-dom';
import { HiAcademicCap, HiLightningBolt, HiCollection, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import DarkModeToggle from '../components/DarkModeToggle';

const Landing = () => {
    const features = [
        {
            icon: HiCollection,
            title: 'Project Showcase',
            description: 'Display your best work with rich details, tech stacks, and live links.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: HiLightningBolt,
            title: 'Skills & Expertise',
            description: 'Highlight your technical skills with visual progress indicators.',
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: HiAcademicCap,
            title: 'Certifications',
            description: 'Showcase your certifications and professional achievements.',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: HiShieldCheck,
            title: 'Resume Generator',
            description: 'Generate and download professional resumes from your portfolio.',
            color: 'from-violet-500 to-purple-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/50 dark:border-gray-700/30">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Portfolio</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DarkModeToggle />
                        <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                        <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 
                          text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                        Student Portfolio Management System
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                        Build Your
                        <span className="gradient-text"> Professional</span>
                        <br />Portfolio Today
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Showcase your projects, skills, and achievements in a beautifully designed portfolio.
                        Stand out to recruiters and peers with a professional presence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="btn-primary px-8 py-3.5 text-base flex items-center gap-2">
                            Create Portfolio <HiArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/admin/login" className="btn-secondary px-8 py-3.5 text-base">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Everything You Need</h2>
                        <p className="text-gray-600 dark:text-gray-400">Powerful features to build your professional brand</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="card-hover group cursor-default">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4
                                group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-violet-700 p-12 text-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto">Join other students who are building their professional portfolios.</p>
                            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold 
                                             px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all duration-200 
                                             shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                Sign Up Free <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-dark-border py-8 px-6">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
                    © 2026 Student Portfolio System. Built with MERN Stack.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
