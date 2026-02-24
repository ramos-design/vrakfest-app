import React, { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerData = [
    {
        image: '/banner-1.png',
        title: 'VÍTEJTE NA VRAKFESTU',
        description: 'Zažijte nezapomenutelnou atmosféru největšího demoličního derby v regionu. Adrenalin, plechy a skvělá komunita.',
        tag: 'AKTUÁLNĚ'
    },
    {
        image: '/banner-2.png',
        title: 'VYLAĎ SVŮJ STROJ',
        description: 'Připravujeme nová technická pravidla pro sezónu 2026. Sleduj novinky v sekci pravidel a marketplace.',
        tag: 'TECHNIKA'
    },
    {
        image: '/banner-3.png',
        title: 'HLASOVÁNÍ DIVÁKŮ',
        description: 'Tento rok můžete přímo v aplikaci hlasovat za nejlepší vrak dne. Každý hlas se počítá!',
        tag: 'KOMUNITA'
    }
];

export const BannerSlideshow = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerData.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % bannerData.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + bannerData.length) % bannerData.length);

    return (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden border border-white/10 group">
            {/* Slides */}
            {bannerData.map((banner, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear scale-100 hover:scale-110"
                        style={{ backgroundImage: `url(${banner.image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl z-20">
                        <span className="inline-block px-3 py-1 bg-racing-yellow text-black font-tech text-[10px] tracking-widest mb-4 w-fit">
                            {banner.tag}
                        </span>
                        <h2 className="font-bebas text-5xl md:text-7xl text-white mb-4 tracking-wider leading-none">
                            {banner.title}
                        </h2>
                        <p className="text-white/60 font-tech text-sm md:text-base leading-relaxed max-w-lg mb-6">
                            {banner.description}
                        </p>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 border border-white/10 text-white hover:bg-racing-yellow hover:text-black transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 border border-white/10 text-white hover:bg-racing-yellow hover:text-black transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-8 md:left-16 z-30 flex gap-2">
                {bannerData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 transition-all duration-300 ${index === currentIndex ? 'w-8 bg-racing-yellow' : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
});
