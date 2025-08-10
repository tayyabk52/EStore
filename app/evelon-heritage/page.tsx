import { Button } from "@/components/ui/button"
import { Crown, Leaf, Users } from "lucide-react"

export default function EvelonHeritagePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-amber-900/70" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            OUR HERITAGE
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
            Celebrating the timeless artistry of Pakistani craftsmanship
          </p>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-6 text-gray-900">
              Weaving Tradition into Tomorrow
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              EVELON was born from a profound respect for Pakistan&apos;s rich textile heritage. 
              Our journey began with a simple belief: that the ancient arts of our craftsmen 
              deserve a place in the modern world, elevated to their rightful status as luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h3 className="text-2xl font-light mb-6 text-gray-900">The Art of Ajrak</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                For over 4,000 years, the ancient art of Ajrak block printing has thrived in the Sindh region. 
                Each pattern tells a story of geometric precision and spiritual symbolism, created through a 
                16-step process that transforms humble cotton into works of art.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our master artisans continue this tradition, using natural indigo and madder dyes to create 
                the distinctive deep blues and rich reds that define authentic Ajrak. Every EVELON piece 
                bearing these sacred patterns carries the soul of centuries-old wisdom.
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                View Ajrak Collection
              </Button>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-96 overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent" />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-light mb-6 text-gray-900">The Beauty of Phulkari</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                From the fertile plains of Punjab comes Phulkari — literally meaning &quot;flower work.&quot; 
                This exquisite embroidery technique transforms simple fabrics into gardens of silk, 
                where every stitch blooms with color and life.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our collaboration with rural artisan communities ensures these delicate skills are 
                not only preserved but celebrated. Each Phulkari piece in our collection represents 
                hours of meditative stitching, where tradition meets contemporary elegance.
              </p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0">
                View Phulkari Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Partners */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-6 text-gray-900">
              Our Artisan Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Behind every EVELON creation stands a master craftsperson, keeper of ancestral knowledge 
              and guardian of our cultural legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Master Ustad Ahmed",
                craft: "Ajrak Block Printing",
                location: "Matiari, Sindh",
                experience: "35+ years",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80"
              },
              {
                name: "Bibi Rashida",
                craft: "Phulkari Embroidery",
                location: "Bahawalpur, Punjab",
                experience: "28+ years",
                image: "https://images.unsplash.com/photo-1594736797933-d0705ba65952?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80"
              },
              {
                name: "Craftsman Tariq",
                craft: "Traditional Weaving",
                location: "Peshawar, KPK",
                experience: "42+ years",
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80"
              },
            ].map((artisan, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-64">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${artisan.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{artisan.name}</h3>
                  <p className="text-amber-600 text-sm font-medium mb-2">{artisan.craft}</p>
                  <p className="text-gray-500 text-sm mb-1">{artisan.location}</p>
                  <p className="text-gray-500 text-sm">{artisan.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <Crown className="w-16 h-16 mx-auto mb-8 text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-6">
            Experience Living Heritage
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover our complete heritage collection where every piece carries the 
            essence of Pakistani craftsmanship into the modern world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 px-8 py-3">
              Shop Heritage Collection
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900 px-8 py-3">
              Visit Our Ateliers
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}