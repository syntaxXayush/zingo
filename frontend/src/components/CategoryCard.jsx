import React from 'react';

function CategoryCard({ image,name,onClick }) {
  return (
    <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-gradient-to-br from-white/80 via-background/80 to-secondary/20 shadow-xl hover:scale-[1.05] hover:shadow-2xl transition-all duration-300 animate-fade-in cursor-pointer" onClick={()=>onClick()}>
      <div className="relative w-full h-full">
        <img
          src={image}
          alt={name || 'Category'}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 rounded-2xl"
        />

        {/* small white label box over image (bottom centered) */}
        <div className="absolute bottom-0 w-full left-0 bg-white/80 bg-opacity-95 px-3 py-2 rounded-t-xl text-center shadow-lg text-base font-semibold text-gray-900 backdrop-blur-lg animate-fade-in-up">
          {name}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;