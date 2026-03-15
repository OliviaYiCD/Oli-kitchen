"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Flame, ChevronRight } from 'lucide-react';

export default function MealListClient({ initialMeals, uniqueLabels }: { initialMeals: any[], uniqueLabels: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMeals = initialMeals.filter(meal => {
    const matchesSearch = meal.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (meal.name_cn && meal.name_cn.includes(searchQuery));
    const mealLabels = meal.label ? meal.label.split(',') : [];
    const matchesFilter = activeFilter === "All" || mealLabels.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Search Bar - Higher Contrast */}
      <div className="px-6 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search receipts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-white focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-500" 
          />
        </div>
      </div>

      {/* Filter Pills - High Contrast Selection */}
      <div className="flex gap-2 overflow-x-auto px-6 py-4 no-scrollbar">
        {["All", ...uniqueLabels].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeFilter === cat 
                ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                : 'bg-[#1C1C1E] text-gray-300 border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal Cards - Distinct Surfaces */}
      <section className="px-6 space-y-4">
        {filteredMeals.map((meal) => (
          <Link href={`/admin/edit/${meal.id}`} key={meal.id} className="block active:scale-[0.98] transition-all">
            <div className="flex gap-4 p-4 bg-[#1C1C1E] border border-white/5 rounded-[2.2rem] shadow-xl">
              {/* Image with slight border to pop from black bg */}
              <div className="w-24 h-24 bg-[#2C2C2E] rounded-[1.8rem] overflow-hidden flex-shrink-0 border border-white/10">
                <img 
                   src={meal.image_url || 'https://placehold.co/200'} 
                   className="w-full h-full object-cover" 
                   alt="" 
                />
              </div>
              
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <h3 className="font-bold text-white truncate text-lg leading-tight mb-1">{meal.name_en}</h3>
                <p className="text-sm text-gray-400 font-bold mb-3">{meal.name_cn}</p>
                
                {/* High-Contrast Labels */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {meal.label?.split(',').filter(Boolean).map((tag: string) => (
                    <span key={tag} className="text-[9px] font-black bg-white/10 text-white px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bright Orange Spicy Level */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Flame 
                       key={i} 
                       size={14} 
                       className={i < (meal.spicy_level || 0) ? 'text-orange-500 fill-orange-500' : 'text-white/10'} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center text-gray-600 pr-1">
                <ChevronRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}