import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import LogoWithText from './LogoWithText'

const Footer: React.FC = () => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const footerLinks = [
    {
      title: isArabic ? "المنصة" : "Plateforme",
      links: [
        { name: isArabic ? "البطولات" : "Tournois", href: "/tournaments" },
        { name: isArabic ? "الفرق" : "Équipes", href: "/teams" },
        { name: isArabic ? "اللاعبين" : "Joueurs", href: "/players" },
        { name: isArabic ? "المباريات" : "Matchs", href: "/matches" }
      ]
    },
    {
      title: isArabic ? "المجتمع" : "Communauté",
      links: [
        { name: isArabic ? "الجدار الاجتماعي" : "Mur Social", href: "/social" },
        { name: isArabic ? "بطاقات اللاعبين" : "Cartes Joueur", href: "/player-cards" },
        { name: isArabic ? "التصنيفات" : "Classements", href: "/stats" },
        { name: isArabic ? "الأحداث" : "Événements", href: "/events" }
      ]
    },
    {
      title: isArabic ? "الدعم" : "Support",
      links: [
        { name: isArabic ? "المساعدة" : "Aide", href: "/help" },
        { name: isArabic ? "التواصل" : "Contact", href: "/contact" },
        { name: isArabic ? "الشروط" : "Conditions", href: "/terms" },
        { name: isArabic ? "الخصوصية" : "Confidentialité", href: "/privacy" }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "mailto:contact@7oumaligue.com", label: "Email" }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <LogoWithText />
              <p className="mt-4 text-gray-300 leading-relaxed">
                {isArabic
                  ? "منصة 7OUMA LIGUE هي أكبر مجتمع لكرة القدم المصغرة في تونس. نربط اللاعبين والفرق والبطولات في تجربة واحدة متكاملة."
                  : "7OUMA LIGUE est la plus grande communauté de football à 7 du Tunisie. Nous connectons joueurs, équipes et tournois dans une expérience unifiée."
                }
              </p>
              
              {/* Statistiques rapides */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">500+</div>
                  <div className="text-sm text-gray-400">{isArabic ? "لاعب" : "Joueurs"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50+</div>
                  <div className="text-sm text-gray-400">{isArabic ? "بطولة" : "Tournois"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">1000+</div>
                  <div className="text-sm text-gray-400">{isArabic ? "مباراة" : "Matchs"}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Liens de navigation */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-orange-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Section contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">
                {isArabic ? "معلومات التواصل" : "Informations de contact"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-orange-400" />
                  <span>contact@7oumaligue.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-orange-400" />
                  <span>0</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-orange-400" />
                  <span>{isArabic ? "تونس" : "Tunisie"}</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">
                {isArabic ? "النشرة الإخبارية" : "Newsletter"}
              </h3>
              <p className="text-gray-300 mb-4">
                {isArabic
                  ? "احصل على آخر الأخبار والتحديثات"
                  : "Recevez les dernières nouvelles et mises à jour"
                }
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={isArabic ? "بريدك الإلكتروني" : "Votre email"}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg focus:outline-none focus:border-orange-400 text-white"
                />
                <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-r-lg transition-colors duration-200">
                  {isArabic ? "اشتراك" : "S'abonner"}
                </button>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">
                {isArabic ? "تابعنا" : "Suivez-nous"}
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm">
              <span>© 2024 7OUMA LIGUE. </span>
              <span className="mx-2">{isArabic ? "جميع الحقوق محفوظة" : "Tous droits réservés"}</span>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-2">
                {isArabic ? "صنع بـ" : "Fait avec"}
              </span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-gray-400 text-sm ml-2">
                {isArabic ? "في تونس" : "au Tunisie"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 