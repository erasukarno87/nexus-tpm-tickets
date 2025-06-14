
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GlobalBackground } from "@/components/GlobalBackground";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <GlobalBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="page-container p-12 text-center animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-red-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Maaf, halaman yang Anda cari tidak dapat ditemukan.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-gray-500/50 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 hover:text-white transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700/90 hover:to-purple-700/90 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Beranda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

