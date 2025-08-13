import React from 'react';

const Dashboard = ({ setCurrentPage }) => {
  // ⚠️ keep data/logic exactly as-is (ids & titles drive navigation)
  const features = [
    { id: 1, title: 'My Profile', icon: '👤', bgColor: 'bg-white', borderColor: 'border-blue-200' },
    { id: 2, title: 'My Interviews', icon: '👥', bgColor: 'bg-white', borderColor: 'border-blue-200' },
    { id: 3, title: 'Enhanced Resumes', icon: '📄', bgColor: 'bg-white', borderColor: 'border-blue-200' },
    { id: 4, title: 'Job Tracker', icon: '🏆', bgColor: 'bg-white', borderColor: 'border-blue-200' },
  ];

  const handleFeatureClick = (id) => {
    if (id === 1) {
      setCurrentPage('profile');
    } else if (id === 3) {
      setCurrentPage('downloadedResumes');
    } else {
      console.log(`Clicked feature with ID: ${id}`);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] px-6 py-12 bg-neutral-900 text-neutral-100">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Brand illustration (primary → accent gradient, dark canvas) */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-96 h-80 rounded-full bg-gradient-to-br from-primary to-accent relative overflow-hidden flex items-center justify-center shadow-2xl">
                {/* subtle inner rings */}
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full border border-white/10" />
                {/* center tiles (use brand colors) */}
                <div className="relative z-10 grid grid-cols-2 gap-1">
                  <div className="w-12 h-12 rounded-lg bg-white/15 backdrop-blur-sm border border-white/10"></div>
                  <div className="w-12 h-12 rounded-lg bg-secondary/80"></div>
                  <div className="w-12 h-12 rounded-lg bg-secondary/70"></div>
                  <div className="w-12 h-12 rounded-lg bg-white/15 backdrop-blur-sm border border-white/10"></div>
                </div>
                {/* sparkles */}
                <div className="absolute -top-2 left-10 w-2 h-2 rounded-full bg-white/70"></div>
                <div className="absolute bottom-6 right-12 w-1.5 h-1.5 rounded-full bg-white/60"></div>
                <div className="absolute top-12 right-20 w-1.5 h-1.5 rounded-full bg-white/60"></div>
              </div>
            </div>
          </div>

          {/* Right — Feature cards using iQua tokens/utilities */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={[
                  // brand card base
                  "card p-8 cursor-pointer transition-all duration-300 group",
                  // interactive accents
                  "hover:border-primary/50 hover:shadow-xl hover:-translate-y-1",
                ].join(" ")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* icon chip */}
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 bg-primary/15 text-primary">
                    {feature.icon}
                  </div>

                  {/* title (DM Sans per base rules) */}
                  <h3 className="font-dmsans font-semibold text-lg text-neutral-100 group-hover:text-primary">
                    {feature.title}
                  </h3>

                  {/* helper caption (brand caption utility) */}
                  <p className="caption">
                    {feature.id === 1 && "View and update your details"}
                    {feature.id === 2 && "Check status & outcomes"}
                    {feature.id === 3 && "See AI-enhanced resumes"}
                    {feature.id === 4 && "Track roles you’re pursuing"}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
};

export default Dashboard;
