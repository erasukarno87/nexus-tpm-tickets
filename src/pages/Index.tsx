
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlobalBackground } from '@/components/GlobalBackground';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { LoginForm } from '@/components/LoginForm';
import { 
  Wrench, 
  ClipboardList, 
  Package, 
  HeadphonesIcon, 
  Zap, 
  Sparkles,
  ShieldCheck,
  Activity,
  Search,
  BarChart3,
  Database,
  LogIn,
  Hammer,
  AlertTriangle,
  ShoppingCart,
  HelpCircle
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('submission');

  const categories = [
    {
      id: 'corrective_action',
      title: 'Tindakan Korektif',
      description: 'Perbaikan untuk mencegah masalah berulang',
      icon: <AlertTriangle className="w-8 h-8" />,
      gradient: 'from-red-600 via-red-500 to-red-400',
      bgGradient: 'from-red-500/20 via-red-400/15 to-red-300/10',
      borderColor: 'border-red-500/50 hover:border-red-400/70',
      shadowColor: 'shadow-red-500/30 hover:shadow-red-400/50',
      iconColor: 'text-red-600'
    },
    {
      id: 'repair',
      title: 'Perbaikan',
      description: 'Perbaikan kerusakan mesin atau peralatan',
      icon: <Hammer className="w-8 h-8" />,
      gradient: 'from-blue-600 via-blue-500 to-blue-400',
      bgGradient: 'from-blue-500/20 via-blue-400/15 to-blue-300/10',
      borderColor: 'border-blue-500/50 hover:border-blue-400/70',
      shadowColor: 'shadow-blue-500/30 hover:shadow-blue-400/50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'procurement',
      title: 'Pengadaan',
      description: 'Permintaan suku cadang atau material',
      icon: <ShoppingCart className="w-8 h-8" />,
      gradient: 'from-green-600 via-green-500 to-green-400',
      bgGradient: 'from-green-500/20 via-green-400/15 to-green-300/10',
      borderColor: 'border-green-500/50 hover:border-green-400/70',
      shadowColor: 'shadow-green-500/30 hover:shadow-green-400/50',
      iconColor: 'text-green-600'
    },
    {
      id: 'support',
      title: 'Dukungan',
      description: 'Bantuan teknis dan konsultasi',
      icon: <HelpCircle className="w-8 h-8" />,
      gradient: 'from-purple-600 via-purple-500 to-purple-400',
      bgGradient: 'from-purple-500/20 via-purple-400/15 to-purple-300/10',
      borderColor: 'border-purple-500/50 hover:border-purple-400/70',
      shadowColor: 'shadow-purple-500/30 hover:shadow-purple-400/50',
      iconColor: 'text-purple-600'
    }
  ];

  const handleLoginSuccess = () => {
    // After successful login, redirect to admin panel or show success message
    setActiveTab('admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'submission':
        return <TicketSubmissionForm />;
      case 'tracking':
        return <TicketTracking />;
      case 'dashboard':
        return <Dashboard />;
      case 'master':
        return <MasterData />;
      case 'admin':
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-2xl">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradientShift">
                    TPM SYSTEM
                  </h1>
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Total Productive Maintenance Management
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Platform terintegrasi untuk mengelola permintaan maintenance, tracking progress, dan optimalisasi produktivitas mesin
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${category.borderColor} ${category.shadowColor} bg-gradient-to-br ${category.bgGradient} dark:${category.bgGradient.replace(/\/10/g, '/20')} backdrop-blur-xl border-2`}
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <div className="text-white">
                          {category.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <CardTitle className={`text-xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2 leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aksi Cepat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Button
                  onClick={() => setActiveTab('submission')}
                  className="h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border-0 text-white font-semibold"
                >
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Buat Tiket
                </Button>
                
                <Button
                  onClick={() => setActiveTab('tracking')}
                  variant="outline"
                  className="h-12 bg-gradient-to-r from-white/20 via-green-500/10 to-emerald-500/10 backdrop-blur-xl border-2 border-green-500/30 hover:border-emerald-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:scale-105 group"
                >
                  <Search className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Lacak Status</span>
                </Button>
                
                <Button
                  onClick={() => setActiveTab('dashboard')}
                  variant="outline"
                  className="h-12 bg-gradient-to-r from-white/20 via-orange-500/10 to-yellow-500/10 backdrop-blur-xl border-2 border-orange-500/30 hover:border-yellow-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:via-yellow-500/20 hover:to-amber-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105 group"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Dashboard</span>
                </Button>
                
                <Button
                  onClick={() => setActiveTab('admin')}
                  variant="outline"
                  className="h-12 bg-gradient-to-r from-white/20 via-red-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-pink-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:via-pink-500/20 hover:to-rose-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 group"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Admin Portal</span>
                </Button>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Proses Cepat</CardTitle>
                  <CardDescription>
                    Sistem otomatis untuk pemrosesan tiket dengan notifikasi real-time
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Monitoring Real-time</CardTitle>
                  <CardDescription>
                    Pantau progress maintenance dan status peralatan secara langsung
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Keamanan Terjamin</CardTitle>
                  <CardDescription>
                    Data dan informasi maintenance tersimpan aman dengan enkripsi tingkat tinggi
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      <GlobalBackground />
      
      {/* Header */}
      <header className="relative z-20 backdrop-blur-xl bg-gradient-to-r from-white/10 via-blue-500/5 to-purple-500/10 dark:from-slate-900/30 dark:via-blue-950/20 dark:to-purple-950/30 border-b border-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30">
        {/* Animated glow line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Enhanced Brand Section with reduced spacing */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Glowing background for icon */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-2xl">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradientShift">
                    TPM SYSTEM
                  </h1>
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Total Productive Maintenance
                  </span>
                </p>
              </div>
            </div>
            
            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {[
                { id: 'home', label: 'Beranda', icon: Wrench },
                { id: 'submission', label: 'Buat Tiket', icon: ClipboardList },
                { id: 'tracking', label: 'Lacak', icon: Search },
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'master', label: 'Master Data', icon: Database }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id === 'home' ? '' : item.id)}
                  className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                    activeTab === (item.id === 'home' ? '' : item.id)
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
            
            {/* Enhanced Controls */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <Button
                onClick={() => setActiveTab('admin')}
                variant="outline"
                size="default"
                className="h-12 px-4 bg-gradient-to-r from-white/20 via-red-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-pink-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:via-pink-500/20 hover:to-rose-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 group"
              >
                <div className="flex items-center space-x-2">
                  <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold text-sm bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:via-rose-500 group-hover:to-red-500 transition-all duration-300">
                    Admin Portal
                  </span>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
