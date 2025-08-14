"use client"

import { motion } from "framer-motion"
import { Crown, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SmartImage } from "@/components/ui/smart-image"

// Replace the three DRIVE_URL values below with your Google Drive share links.
// The SmartImage component automatically handles Drive URLs.
const MAKING_IMAGE_1 = "https://drive.google.com/file/d/1KlClxJuNFqYL3VU1aYlAVJZDyfSZuJNv/view?usp=sharing"
const MAKING_IMAGE_2 = "https://drive.google.com/file/d/1ZpnBFdfNhus_zjeRSvoILOPPgWCHkHlN/view?usp=sharing"
const MAKING_IMAGE_3 = "https://drive.google.com/file/d/1A2e3zvNmVnYjbHwFJkRTKvz6MYXFAKJC/view?usp=sharing"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-stone-50" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_20%,rgba(0,0,0,0.04)_0%,transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center mb-5 md:mb-6">
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              <Crown className="w-6 h-6 md:w-7 md:h-7 mx-4 text-neutral-400" />
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.18em] md:tracking-[0.22em] text-black leading-tight">
              ABOUT LA ELEGANCE
            </h1>
            <p className="mt-4 md:mt-5 text-[15px] md:text-xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
              A home studio where every piece is designed, formed, and finished by hand. One maker. One story. One-of-a-kind jewelry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-light tracking-[0.12em] md:tracking-[0.16em] text-black mb-4 md:mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Handcrafted at Home
            </motion.h2>
            <motion.p
              className="text-neutral-700 text-base md:text-xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              La Elegance began in a quiet corner of our founder’s home studio. Each design is imagined, shaped, and polished by hand in small batches. No mass production — just thoughtful craftsmanship and the beauty of variation. Because every stone, curve, and texture is unique, no two pieces are ever exactly alike.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Making In Progress – replace Drive links above */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[MAKING_IMAGE_1, MAKING_IMAGE_2, MAKING_IMAGE_3].map((src, i) => {
              const tall = i === 1
              return (
                <div
                  key={i}
                  className={`group relative overflow-hidden bg-neutral-100 ${tall ? 'aspect-[3/4] md:aspect-[4/5]' : 'aspect-[4/5]'} border border-neutral-200/60`}
                >
                  <SmartImage
                    src={src}
                    alt={`Making in progress ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs md:text-sm text-neutral-500 mt-3">In studio, pouring soul into the handmade jewelry</p>
        </div>
      </section>

      {/* Promise */}
      <section className="py-14 md:py-24 bg-neutral-50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(0,0,0,0.04)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-5 md:mb-6">
              <Sparkles className="w-5 h-5 text-neutral-400" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mx-4" />
              <Heart className="w-5 h-5 text-neutral-400" />
            </div>
            <h3 className="text-2xl md:text-4xl font-light tracking-[0.12em] md:tracking-[0.16em] text-black mb-8 md:mb-10">Our Promise</h3>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 text-left">
              {[ 
                { t: 'Uniquely Yours', d: 'Each piece is handmade and slightly different – embrace the small variations that make it yours.' },
                { t: 'Small-Batch Craft', d: 'Created at home, finished with professional techniques and premium components.' },
                { t: 'Thoughtful Materials', d: 'Carefully chosen metals and stones — gentle on skin, enduring in beauty.' },
                { t: 'Made with Care', d: 'Every clasp, curve, and polish is checked by hand before it reaches you.' }
              ].map((f, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden p-5 md:p-6 bg-white/90 backdrop-blur-sm border border-neutral-200/70 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.35] group-hover:opacity-40 transition-opacity duration-300" style={{ maskImage: 'radial-gradient(120% 80% at 100% 0%, black 0%, transparent 60%)' }} />
                  <h4 className="text-base md:text-lg font-medium text-black mb-2 tracking-[0.12em]">{f.t}</h4>
                  <p className="text-neutral-600 leading-relaxed text-sm md:text-[15px]">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
            <Crown className="w-4 h-4 text-neutral-400" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
          </div>
          <h4 className="text-2xl md:text-3xl font-light tracking-[0.12em] md:tracking-[0.16em] text-black mb-6">Discover One-of-a-kind Pieces</h4>
          <Button asChild className="bg-black hover:bg-neutral-800 text-white px-6 py-3 tracking-wide shadow-sm hover:shadow md:px-7 md:py-3.5">
            <Link href="/products">Shop the Collection</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}