import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logos/urbannest.svg';
import facebookIcon from '@/assets/logos/img_plus.svg';
import twitterIcon from '@/assets/logos/img_twitter.svg';
import instagramIcon from '@/assets/logos/img_instagram_orange_a700_30x30.svg';
import linkedinIcon from '@/assets/logos/img_linkedin.svg';
import youtubeIcon from '@/assets/logos/img_clock_orange_a700.svg';

const FOOTER_COLUMNS = [
  {
    title: 'Features',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Search', to: '/search' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Listing', to: '/listing' },
      { label: 'Property Details', to: '/search' },
      { label: 'Agent List', to: '/agents' },
      { label: 'Agent Profile', to: '/agents' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'License', to: '/license' },
    ],
  },
  {
    title: 'Others',
    links: [
      { label: 'Log In', to: '/login' },
      { label: 'Create Account', to: '/signup' },
      { label: 'Profile', to: '/profile' },
    ],
  },
];

const SOCIAL_ICONS = [
  {
    src: facebookIcon,
    alt: 'Facebook',
    href: 'https://www.facebook.com/saffat.zabin.39/',
  },
  { src: twitterIcon, alt: 'Twitter', href: 'https://www.x.com/' },
  { src: instagramIcon, alt: 'Instagram', href: 'https://www.instagram.com' },
  {
    src: linkedinIcon,
    alt: 'LinkedIn',
    href: 'https://www.linkedin.com/in/saffat-zabin-143839283/',
  },
  { src: youtubeIcon, alt: 'YouTube', href: 'https://www.youtube.com/' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-custom-gray-300/50 px-5 lg:px-30 py-16">
      <div className="mx-auto max-w-7xl flex flex-col gap-16">
        {/* Top section */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-10 w-full md:w-85 shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoSvg} alt="UrbanNest" className="size-10" />
              <span className="text-xl font-marko text-custom-orange">
                UrbanNest
              </span>
            </Link>

            {/* Contact info */}
            <div className="flex flex-col gap-7">
              <p className="text-base font-semibold text-custom-dark leading-[160%]">
                House #5, Block C, Banasree,
                <br />
                Rampura, Dhaka-1219
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-custom-dark">
                  +8801710520808
                </p>
                <p className="text-base font-semibold text-custom-dark">
                  urbannest@gmail.com
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIAL_ICONS.map((icon) => (
                  <a
                    key={icon.alt}
                    href={icon.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center size-7.5 hover:opacity-70 transition-opacity"
                  >
                    <img src={icon.src} alt={icon.alt} className="size-7.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 flex-1">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-5">
                <h3 className="text-lg font-bold text-custom-dark">
                  {column.title}
                </h3>
                <div className="flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-base font-semibold text-custom-dark hover:text-custom-orange transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-base font-semibold text-custom-dark">
          &copy; {new Date().getFullYear()} UrbanNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
