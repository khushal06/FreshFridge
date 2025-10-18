"use client"

import { useState } from "react"
import { Package, Clock, Utensils, BarChart3, Smartphone, ShoppingCart } from "lucide-react"

export default function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍃</div>
              <span className="text-xl font-bold tracking-tight text-black">FreshKeep</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[15px] font-medium text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[15px] font-medium text-gray-600 hover:text-black transition-colors"
              >
                How it works
              </a>
              <a href="#pricing" className="text-[15px] font-medium text-gray-600 hover:text-black transition-colors">
                Pricing
              </a>
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 bg-black text-white rounded-xl font-medium text-[15px] hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl font-semibold"
            >
              How it works
            </a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">
              Pricing
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onEnterApp()
              }}
              className="px-8 py-3 bg-white text-black rounded-xl font-semibold text-lg"
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-[64px] leading-[1.1] font-bold tracking-tight text-black mb-6">
                Organize your kitchen.
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Reduce food waste.
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-gray-600 mb-10 max-w-xl">
                Track fresh ingredients, get expiry alerts, and discover recipes with what you already have. Save money
                and help the planet.
              </p>

              <div className="mb-12">
                <button
                  onClick={() => {
                    console.log('Hero button clicked!')
                    onEnterApp()
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-medium text-[17px] hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-xl h-14"
                >
                  Start free today
                  <span className="text-xl">→</span>
                </button>
                <p className="mt-3 text-sm text-gray-500">No credit card required • Free forever</p>
                <p className="mt-2 text-xs text-gray-400">
                  Debug: <a href="?skip=true" className="underline">Skip to app</a>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xl">
                    👨
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xl">
                    👩
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xl">
                    👨‍🦱
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xl">
                    👩‍🦰
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="text-black font-semibold">10,000+ home cooks</strong> are already saving food and
                  money
                </p>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative animate-float">
              <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.1),0_40px_80px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-black mb-1">26</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Fresh items</div>
                    </div>
                    <div className="bg-gray-50 border-2 border-red-500 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-black mb-1">3</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Use soon</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                      <div className="text-3xl font-bold text-black mb-1">$45</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">This week</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        🥛
                      </div>
                      <div className="flex-1">
                        <div className="text-[15px] font-medium text-black">Milk</div>
                        <div className="text-[13px] text-gray-500">Expires in 2 days</div>
                      </div>
                      <div className="px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">2d</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        🥬
                      </div>
                      <div className="flex-1">
                        <div className="text-[15px] font-medium text-black">Spinach</div>
                        <div className="text-[13px] text-gray-500">Expires in 3 days</div>
                      </div>
                      <div className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">3d</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-black mb-3 tracking-tight">$450</div>
              <div className="text-[15px] text-gray-500">Average yearly savings</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-black mb-3 tracking-tight">85%</div>
              <div className="text-[15px] text-gray-500">Reduction in food waste</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-black mb-3 tracking-tight">500+</div>
              <div className="text-[15px] text-gray-500">Easy recipes included</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-black mb-3 tracking-tight">10k+</div>
              <div className="text-[15px] text-gray-500">Happy home cooks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-4 tracking-tight">
              Everything you need to manage your kitchen
            </h2>
            <p className="text-xl text-gray-600">Simple, powerful tools that save you time and money</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="w-12 h-12" />,
                title: "Smart Pantry Tracking",
                desc: "Track all your ingredients in one place. Add items in seconds with our quick-add feature and smart search.",
              },
              {
                icon: <Clock className="w-12 h-12" />,
                title: "Expiry Alerts",
                desc: "Get notified before food expires. Never waste fresh produce or dairy again with smart reminders.",
              },
              {
                icon: <Utensils className="w-12 h-12" />,
                title: "Recipe Suggestions",
                desc: "Discover recipes based on what you have. Use up ingredients before they expire with personalized suggestions.",
              },
              {
                icon: <BarChart3 className="w-12 h-12" />,
                title: "Waste Insights",
                desc: "Track your progress with detailed analytics. See how much you're saving and reduce waste over time.",
              },
              {
                icon: <ShoppingCart className="w-12 h-12" />,
                title: "Shopping Lists",
                desc: "Auto-generate shopping lists from recipes. Never forget an ingredient or buy duplicates again.",
              },
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: "Works Everywhere",
                desc: "Access from any device. Your kitchen data syncs automatically across phone, tablet, and desktop.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-black mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-[15px] leading-relaxed text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-4 tracking-tight">How FreshKeep works</h2>
            <p className="text-xl text-gray-600">Three simple steps to a smarter kitchen</p>
          </div>

          <div className="space-y-20">
            {[
              {
                num: "1",
                title: "Add your ingredients",
                desc: "Quickly add items to your digital pantry. Scan barcodes, search by name, or use quick-add for common items.",
              },
              {
                num: "2",
                title: "Get smart alerts",
                desc: "Receive notifications before items expire. FreshKeep reminds you to use ingredients at the perfect time.",
              },
              {
                num: "3",
                title: "Cook with what you have",
                desc: "Get personalized recipe suggestions based on your ingredients. Reduce waste and discover new meals.",
              },
            ].map((step, i) => (
              <div key={i} className="grid md:grid-cols-[80px_1fr_1fr] gap-10 items-center">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto md:mx-0">
                  {step.num}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-[17px] leading-relaxed text-gray-600">{step.desc}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 min-h-[280px] flex items-center justify-center">
                  <div className="text-6xl">{i === 0 ? "🔍" : i === 1 ? "⏰" : "🍳"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-4 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Free forever. No hidden fees. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-xl font-semibold text-black mb-4">Free</div>
              <div className="mb-3">
                <span className="text-[56px] font-bold text-black tracking-tight">$0</span>
                <span className="text-xl text-gray-500">/forever</span>
              </div>
              <div className="text-base text-gray-600 mb-8 pb-8 border-b border-gray-200">
                Perfect for getting started
              </div>

              <ul className="space-y-3 mb-8">
                {["Unlimited ingredients", "Expiry alerts", "100+ recipes", "Basic insights", "Shopping lists"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] text-black">
                      <span className="text-green-500">✓</span> {item}
                    </li>
                  ),
                )}
              </ul>

              <button
                onClick={onEnterApp}
                className="w-full py-3 border-2 border-gray-200 rounded-xl font-medium text-[15px] text-black hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Get started free
              </button>
            </div>

            <div className="bg-white border-2 border-black rounded-3xl p-12 relative hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1.5 rounded-full text-[13px] font-semibold">
                Most Popular
              </div>
              <div className="text-xl font-semibold text-black mb-4">Pro</div>
              <div className="mb-3">
                <span className="text-[56px] font-bold text-black tracking-tight">$4.99</span>
                <span className="text-xl text-gray-500">/month</span>
              </div>
              <div className="text-base text-gray-600 mb-8 pb-8 border-b border-gray-200">For serious home cooks</div>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "500+ premium recipes",
                  "Advanced analytics",
                  "Meal planning",
                  "Family sharing",
                  "Priority support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-black">
                    <span className="text-green-500">✓</span> {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onEnterApp}
                className="w-full py-3 bg-black text-white rounded-xl font-medium text-[15px] hover:bg-gray-800 transition-all"
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black tracking-tight">Loved by home cooks everywhere</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "FreshKeep has completely changed how I manage my kitchen. I've cut my food waste in half and saved so much money!",
                author: "Sarah Johnson",
                role: "Home Cook",
                avatar: "👩",
              },
              {
                text: "The recipe suggestions are incredible. I never knew I could make so many different meals with what I already had!",
                author: "Mike Chen",
                role: "Dad of 3",
                avatar: "👨",
              },
              {
                text: "Simple, elegant, and exactly what I needed. No more throwing away expired food. This app pays for itself!",
                author: "Emily Rodriguez",
                role: "Chef",
                avatar: "👩‍🦰",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <div className="text-yellow-500 text-xl mb-4">★★★★★</div>
                <p className="text-base leading-relaxed text-black mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-black">{testimonial.author}</div>
                    <div className="text-[13px] text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-black to-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[56px] font-bold tracking-tight mb-6">Ready to reduce food waste?</h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of home cooks saving money and helping the planet.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium text-[17px] hover:bg-gray-100 transition-all h-14"
            >
              Get started free
              <span className="text-xl">→</span>
            </button>
            <p className="text-sm text-white/60">No credit card required • 2 minute setup</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-[2fr_3fr] gap-20 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🍃</div>
                <span className="text-xl font-bold tracking-tight text-black">FreshKeep</span>
              </div>
              <p className="text-[15px] text-gray-500">Organize your kitchen. Reduce waste.</p>
            </div>

            <div className="grid grid-cols-3 gap-10">
              <div>
                <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Product</h4>
                <div className="space-y-3">
                  <a href="#features" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Features
                  </a>
                  <a href="#pricing" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Pricing
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-[15px] text-gray-600 hover:text-black transition-colors"
                  >
                    How it works
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Company</h4>
                <div className="space-y-3">
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    About
                  </a>
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Blog
                  </a>
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Contact
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Legal</h4>
                <div className="space-y-3">
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Terms
                  </a>
                  <a href="#" className="block text-[15px] text-gray-600 hover:text-black transition-colors">
                    Security
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">© 2025 FreshKeep. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
