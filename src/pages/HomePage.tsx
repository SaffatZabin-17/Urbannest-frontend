import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  MapPin,
  CalendarCheck,
  Home,
  PartyPopper,
  DollarSign,
  Building,
  Handshake,
  Users,
  CheckCircle2,
} from 'lucide-react';

import heroImg from '@/assets/logos/img_image.png';
import buyImg from '@/assets/logos/img_buy_a_home.jpg';
import rentImg from '@/assets/logos/img_rent_a_home.jpg';
import sellImg from '@/assets/logos/img_sell_a_home.jpg';
import aboutImg1 from '@/assets/logos/img_rectangle18.png';
import aboutImg2 from '@/assets/logos/img_rectangle19.png';
import aboutImg3 from '@/assets/logos/img_rectangle20.png';
import aboutImg4 from '@/assets/logos/img_rectangle21.png';
import propertyImg1 from '@/assets/logos/img_image.png';
import propertyImg2 from '@/assets/logos/img_image_1.png';
import propertyImg3 from '@/assets/logos/img_image_2.png';
import propertyImg4 from '@/assets/logos/img_image_3.png';
import propertyImg5 from '@/assets/logos/img_image_4.png';
import propertyImg6 from '@/assets/logos/img_image_5.png';
import articleImg1 from '@/assets/logos/img_image_350x384.png';
import articleImg2 from '@/assets/logos/img_image_6.png';
import articleImg3 from '@/assets/logos/img_image_7.png';

/* ─── Data ─── */

const SERVICES = [
  {
    img: buyImg,
    title: 'Buy A Home',
    description:
      "Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.",
    cta: 'Browse Homes',
    to: '/search',
  },
  {
    img: rentImg,
    title: 'Rent A Home',
    description:
      "We're creating a seamless online experience — from shopping on the largest rental network, to applying, to paying rent.",
    cta: 'Find Rentals',
    to: '/search',
  },
  {
    img: sellImg,
    title: 'Sell A Home',
    description:
      'No matter what path you take to sell your home, we can help you navigate a successful sale.',
    cta: 'See Your Options',
    to: '/search',
  },
];

const STEPS = [
  { icon: MapPin, title: 'Search\nyour location', bg: 'bg-custom-orange-bg' },
  {
    icon: CalendarCheck,
    title: 'Visit\nAppointment',
    bg: 'bg-custom-orange-bg',
  },
  { icon: Home, title: 'Get your\ndream house', bg: 'bg-custom-orange-bg' },
  {
    icon: PartyPopper,
    title: 'Enjoy your\nnew home',
    bg: 'bg-custom-orange-bg',
  },
];

const STATS = [
  {
    icon: DollarSign,
    value: '$15.4M',
    label: 'Owned from\nProperties transactions',
  },
  {
    icon: Building,
    value: '25K+',
    label: 'Properties for Buy & sell Successfully',
  },
  { icon: Handshake, value: '500', label: 'Daily completed\ntransactions' },
  { icon: Users, value: '600+', label: 'Regular Clients' },
];

const PROPERTIES = [
  propertyImg1,
  propertyImg2,
  propertyImg3,
  propertyImg4,
  propertyImg5,
  propertyImg6,
];

const ARTICLES = [
  {
    img: articleImg1,
    title: '9 Easy-to-Ambitious DIY Projects to Improve Your Home',
  },
  {
    img: articleImg2,
    title: 'Serie Shophouse Launch In July, Opportunity For Investors',
  },
  {
    img: articleImg3,
    title: 'Looking for a New Place? Use This Time to Create Your Wishlist',
  },
];

const ABOUT_CHECKS = [
  'Find excellent deals',
  'Friendly host & Fast support',
  'Secure payment system',
];

/* ─── Component ─── */

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="bg-custom-bg-warm-3 px-5 lg:px-30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl lg:text-[46px] font-extrabold leading-[140%] tracking-tight text-custom-dark">
              Find a perfect property
              <br />
              Where you'll love to live
            </h1>
            <p className="text-xl text-custom-gray-700 leading-[180%] max-w-xl">
              We provide users with a handy and efficient way to search, buy and
              sell homes and business spaces.
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                className="bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold rounded-lg px-6 h-11 cursor-pointer"
              >
                <Link to="/search">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="font-semibold rounded-lg px-6 h-11 cursor-pointer"
              >
                <Link to="/listing">Browse Listing</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg md:max-w-none">
            <img
              src={heroImg}
              alt="Modern home"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Services (Buy / Rent / Sell) ── */}
      <section className="px-5 lg:px-30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group bg-white border border-custom-gray-300/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-custom transition-shadow"
            >
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-extrabold text-custom-dark">
                  {s.title}
                </h3>
                <p className="text-custom-gray-700 leading-relaxed">
                  {s.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-custom-dark group-hover:text-custom-orange transition-colors">
                  {s.cta}
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-5 lg:px-30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-6">
          {/* CTA card */}
          <div className="flex-1 bg-custom-red-light rounded-2xl p-10 lg:p-12 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-[140%] tracking-tight text-custom-dark max-w-md">
              Simple & easy way to find your dream Appointment
            </h2>
            <p className="mt-4 text-lg text-custom-dark leading-[180%] max-w-md">
              We help you find the perfect property with a seamless search
              experience tailored to your needs.
            </p>
            <Button
              asChild
              className="mt-10 bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold rounded-lg px-6 h-11 w-fit cursor-pointer"
            >
              <Link to="/search">Get Started</Link>
            </Button>
          </div>

          {/* Steps grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className={`${step.bg} rounded-2xl p-6 lg:p-8 flex flex-col justify-center gap-5 min-h-50`}
              >
                <step.icon className="size-7 text-custom-orange" />
                <h3 className="text-2xl lg:text-[28px] font-extrabold leading-[135%] tracking-tight text-custom-dark whitespace-pre-line">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 px-5 lg:px-30 py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.value} className="space-y-4">
              <div className="flex items-center justify-center size-15 rounded-full bg-white shadow-sm">
                <stat.icon className="size-8 text-custom-orange" />
              </div>
              <p className="text-4xl lg:text-[46px] font-extrabold tracking-tight text-custom-dark">
                {stat.value}
              </p>
              <p className="text-xl text-custom-gray-600 font-semibold tracking-tight whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="px-5 lg:px-30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-custom-dark">
              Featured Properties
            </h2>
            <Link
              to="/listing"
              className="hidden sm:inline-flex items-center gap-2 text-lg font-bold text-custom-orange hover:text-custom-orange-deep transition-colors"
            >
              Explore All
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTIES.map((img, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden border border-custom-gray-300/60 shadow-sm hover:shadow-custom transition-shadow cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Property ${i + 1}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-custom-dark">
                    Beautiful Family Home
                  </h3>
                  <p className="text-sm text-custom-gray-600 flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-lg font-extrabold text-custom-orange">
                    $350,000
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/listing"
            className="sm:hidden inline-flex items-center gap-2 text-lg font-bold text-custom-orange"
          >
            Explore All
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* ── About / Why Choose Us ── */}
      <section className="bg-gray-50 px-5 lg:px-30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Image grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={aboutImg1}
                alt="Property"
                className="w-full h-80 object-cover rounded-xl"
              />
              <img
                src={aboutImg4}
                alt="Property"
                className="w-full h-52 object-cover rounded-xl"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={aboutImg2}
                alt="Property"
                className="w-full h-52 object-cover rounded-xl"
              />
              <img
                src={aboutImg3}
                alt="Property"
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-[140%] tracking-tight text-custom-dark">
              Best rated host on popular rental sites
            </h2>
            <p className="text-lg text-custom-gray-700 leading-[180%]">
              We help you find the perfect property with a seamless search
              experience. In a free hour, when our power of choice is
              untrammelled and when nothing prevents us from doing what we like
              best.
            </p>
            <div className="space-y-3">
              {ABOUT_CHECKS.map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-custom-orange shrink-0" />
                  <span className="text-lg font-semibold text-custom-dark">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <Button
              asChild
              className="bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold rounded-lg px-6 h-11 cursor-pointer"
            >
              <Link to="/search">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── News & Blog ── */}
      <section className="bg-custom-dark px-5 lg:px-30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              News & Consult
            </h2>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-lg font-bold text-custom-orange hover:text-custom-orange-light transition-colors"
            >
              Explore All
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((a) => (
              <div key={a.title} className="space-y-5">
                <img
                  src={a.img}
                  alt={a.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
                <h3 className="text-2xl font-bold leading-[135%] tracking-tight text-white">
                  {a.title}
                </h3>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-lg font-bold text-custom-orange hover:text-custom-orange-light transition-colors"
                >
                  Read the Article
                  <ArrowRight className="size-5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="bg-custom-gray-700 rounded-xl p-8 lg:p-10">
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h3 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-white">
                For Recent Update, News.
              </h3>
              <p className="text-lg text-gray-300 leading-[180%]">
                We help businesses customize, automate and scale up their ad
                production and delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your Email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-lg h-11"
                />
                <Button className="bg-custom-orange hover:bg-custom-orange-deep text-white font-semibold rounded-lg px-6 h-11 cursor-pointer">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
