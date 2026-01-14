// src/components/Banner.tsx
export default function Banner() {
  return (
    <div className="relative">
      {/* Banner Background */}
      <div className="relative h-[300px] sm:h-[400px] bg-[#0a0a0a] flex items-center justify-center px-6 sm:px-16 overflow-hidden">

        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'0\' y=\'0\' width=\'4\' height=\'4\' fill=\'%234ADE80\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content Box */}
        <div className="relative bg-[#121212]/90 p-8 rounded-2xl shadow-2xl max-w-sm z-30 backdrop-blur-md border border-[#27272a]">
          <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Precision Tooling</h2>
          <p className="text-sm mb-6 text-gray-300 leading-relaxed">
            Upgrade your CNC performance with our premium solid carbide selection.
          </p>
          <button className="w-full bg-[#4ADE80] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#3ec46d] transition-all shadow-[0_0_15px_rgba(74,222,128,0.3)] active:scale-95">
            Shop Now
          </button>
        </div>
      </div>

      {/* Gradient overlay to make the bottom blend into the product list */}
      <div className="absolute w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent bottom-0 z-20" />
    </div>
  )
}