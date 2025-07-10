import React from 'react';
import beaverLogo from '../../../attached_assets/beaver.png';

interface FooterProps {
  isEnglish?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isEnglish = false }) => {
  return (
    <footer className="bg-black py-12 border-t border-[#f89422]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche - vide */}
          <div></div>

          {/* Colonne du milieu - contenu principal */}
          <div className="flex flex-col items-center max-w-[300px] mx-auto">
            <img 
              src={beaverLogo} 
              alt="Logo Beaver" 
              className="h-32 w-32 mb-6"
              style={{ objectFit: "contain" }}
            />
            <h3 className="font-['Montserrat'] font-bold text-2xl mb-2">
              <span className="text-[#0d6efd]">Rémi</span>{" "}
              <span className="text-[#f89422]">Guillette</span>
            </h3>
            <h3 className="font-['Montserrat'] font-bold text-2xl mb-2 text-[#f89422]">
              Groupe
            </h3>
            <h3 className="font-['Montserrat'] font-bold text-2xl mb-2 text-[#f89422]">
              Group
            </h3>
            <div className="flex flex-col items-center gap-2 mt-6">
              <a 
                href="/politique-confidentialite" 
                className="text-[#f89422] text-sm hover:text-white transition-colors"
              >
                Politique de confidentialité
              </a>
              <a 
                href="/eng/privacy-policy" 
                className="text-[#f89422] text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Colonne de droite - informations de contact */}
          <div className="flex flex-col">
            <h3 className="font-['Montserrat'] font-bold text-xl mb-4 text-[#f89422]">Contact</h3>
            <address className="not-italic text-[#f89422]">
              <p className="mb-2">6388 Hawkins Street</p>
              <p className="mb-2">Apt. 307</p>
              <p className="mb-2">Niagara Falls, Ontario</p>
              <p className="mb-2">L2G 1P3</p>
              <p className="mb-2">
                <i className="fas fa-phone-alt mr-2"></i>
                613 501-2160
              </p>
              <p>
                <i className="fas fa-envelope mr-2"></i>
                remiguillette@gmail.com
              </p>
            </address>
            <div className="mt-6 border-t border-[#f89422] pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left text-[#f89422]">
                  <p className="mb-2">Enregistrement Ontario</p>
                  <p className="mb-4">Ontario Registration</p>
                  <p className="mb-2">Enregistrement Canada</p>
                  <p>Canada Registration</p>
                </div>
                <div className="text-center flex flex-col justify-center text-[#f89422]">
                  <p className="mb-2 mx-auto">1001174676</p>
                  <p className="mb-4 mx-auto">1001174693</p>
                  <p className="mx-auto">725808273</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;