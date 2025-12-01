// src/components/Banner.tsx
export default function Banner() {
  return (
    <div className="relative">
        {/* Gradient overlay to make the bottom blend into the product list */}
        <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
        
        {/* Banner Background */}
        <div className="relative h-[300px] sm:h-[400px] bg-gray-800 flex items-center px-6 sm:px-16">
             {/* Content Box */}
             <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-sm z-30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-2 text-[#131921]">Precision Tooling</h2>
                <p className="text-sm mb-4 text-gray-700">
                    Upgrade your CNC performance with our premium solid carbide selection.
                </p>
                <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">
                    Shop Now
                </button>
             </div>
        </div>
    </div>
  )
}