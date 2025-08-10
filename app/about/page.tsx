"use client"

import { motion } from "framer-motion"
import { Crown, Leaf, Package, Globe, Heart, Sparkles, TreePine } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  const sustainabilityFeatures = [
    {
      icon: Leaf,
      title: "Eco-Friendly Materials",
      description: "Sustainably sourced fabrics and organic materials that respect our planet"
    },
    {
      icon: Package,
      title: "Premium Green Packaging",
      description: "Biodegradable luxury packaging made from recycled and renewable materials"
    },
    {
      icon: TreePine,
      title: "Carbon Neutral Shipping",
      description: "Every order is shipped carbon-neutral with tree-planting initiatives"
    }
  ]

  const achievements = [
    { number: "2024", label: "Founded" },
    { number: "100%", label: "Sustainable" },
    { number: "50K+", label: "Happy Customers" },
    { number: "1st", label: "Green Luxury in Pakistan" }
  ]

  const values = [
    {
      icon: Crown,
      title: "Premium Quality",
      description: "Every piece is crafted with meticulous attention to detail and finest materials"
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "Bringing Pakistani craftsmanship to the world stage with modern luxury"
    },
    {
      icon: Heart,
      title: "Ethical Production",
      description: "Fair wages, safe working conditions, and supporting local communities"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Combining traditional techniques with cutting-edge sustainable practices"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-stone-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-neutral-200 rounded-full animate-pulse opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-neutral-300 rounded-full animate-pulse opacity-60 delay-1000" />
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-neutral-200 rounded-full animate-pulse opacity-30 delay-500" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
              <Crown className="w-8 h-8 mx-6 text-neutral-400" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.15em] text-black mb-8 leading-none">
              ABOUT EVELON
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Pakistan&apos;s first premium fashion house built on sustainability. 
              <span className="block mt-2 text-lg md:text-xl text-neutral-500">Where luxury meets responsibility.</span>
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-sm tracking-wider text-neutral-500">EST. 2024 • SUSTAINABLE LUXURY • PAKISTAN</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                <Crown className="w-5 h-5 mx-4 text-neutral-400" />
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] text-black mb-8">OUR STORY</h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-black to-transparent mx-auto mb-12"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="prose prose-lg mx-auto text-center"
            >
              <div className="space-y-8">
                <p className="text-xl text-neutral-600 leading-[1.8] font-light">
                  Born from a vision to revolutionize Pakistani fashion, EVELON emerged as the country&apos;s 
                  first luxury brand to prioritize environmental responsibility without compromising on elegance. 
                  <em className="text-neutral-500 font-normal">We believe that true luxury lies not just in exquisite design, but in the positive impact we create.</em>
                </p>
                
                <p className="text-xl text-neutral-600 leading-[1.8] font-light">
                  Our journey began with a simple yet powerful idea: to craft premium fashion that honors 
                  both our rich Pakistani heritage and our planet&apos;s future. Every thread, every stitch, 
                  and every package reflects our commitment to sustainable luxury.
                </p>

                <p className="text-xl text-neutral-600 leading-[1.8] font-light border-l-2 border-neutral-200 pl-6">
                  Today, EVELON stands as a beacon of conscious fashion, proving that premium quality 
                  and environmental stewardship can beautifully coexist.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainability Mission */}
      <section className="py-20 lg:py-32 bg-stone-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <Leaf className="w-5 h-5 text-green-600" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mx-4"></div>
              <TreePine className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] text-black mb-8">GO GREEN MISSION</h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-green-600 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Leading Pakistan&apos;s fashion revolution with eco-conscious luxury that doesn&apos;t compromise on style
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {sustainabilityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500 border border-green-200/50">
                  <feature.icon className="w-9 h-9 text-green-700" />
                </div>
                <h3 className="text-2xl font-light tracking-[0.05em] text-black mb-6">{feature.title}</h3>
                <p className="text-neutral-600 leading-[1.7] text-lg font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Packaging Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-neutral-400 mr-3" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-neutral-300"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] text-black mb-8 leading-tight">
                PREMIUM GREEN PACKAGING
              </h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-black to-transparent mb-10"></div>
              
              <p className="text-xl text-neutral-600 leading-[1.8] mb-8 font-light">
                Every EVELON piece arrives in our signature eco-luxury packaging, crafted from 
                100% biodegradable materials that reflect our commitment to the environment.
              </p>
              
              <p className="text-lg text-neutral-600 leading-[1.7] mb-10 font-light italic border-l-2 border-green-200 pl-6">
                Our packaging tells a story of responsibility – from recycled paper infused with 
                natural fibers to plant-based inks and compostable protective elements.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-neutral-600">Biodegradable luxury boxes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-neutral-600">Organic cotton protective pouches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-neutral-600">Tree-free tissue paper</span>
                </div>
              </div>

              <Button asChild className="bg-black hover:bg-neutral-800 text-white px-8 py-3 tracking-wide">
                <Link href="/sustainability">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-stone-100 to-neutral-100 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://picsum.photos/800/1000?random=packaging"
                  alt="Premium Green Packaging"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-neutral-400" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mx-4"></div>
              <Heart className="w-5 h-5 text-neutral-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] text-black mb-8">OUR VALUES</h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-black to-transparent mx-auto mb-12"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 border border-neutral-100">
                  <value.icon className="w-9 h-9 text-black group-hover:text-neutral-700 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-light tracking-[0.05em] text-black mb-6">{value.title}</h3>
                <p className="text-base text-neutral-600 leading-[1.7] font-light">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {achievements.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-extralight tracking-[0.05em] text-black mb-3">
                  {stat.number}
                </div>
                <div className="text-sm tracking-[0.2em] text-neutral-400 uppercase font-light">
                  {stat.label}
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mx-auto mt-4" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant Separator */}
      <section className="py-16 bg-gradient-to-r from-white via-stone-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
              <div className="flex items-center mx-8 space-x-3">
                <Leaf className="w-5 h-5 text-green-600" />
                <Crown className="w-6 h-6 text-neutral-400" />
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            </div>
            <p className="text-sm tracking-[0.3em] text-neutral-500 font-light">SUSTAINABLE • LUXURY • PAKISTAN</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}