import { useTranslation } from '../contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calendar, Globe, Lock, FileText, Phone, AlertCircle, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#1a1625] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-[#3b82f6]">{t.privacy.title.split(' ')[0]}</span>{' '}
            <span className="text-[#f89422]">{t.privacy.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#f89422]">
            <Calendar className="w-5 h-5" />
            <p className="text-lg">{t.privacy.lastUpdated}</p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#f89422]">
              <Shield className="w-6 h-6" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              {t.privacy.introduction}
            </p>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-[#3b82f6]">{t.privacy.companyInfo.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.companyInfo.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300"><strong className="text-[#f89422]">Legal Name:</strong> {t.privacy.companyInfo.legalName}</p>
                <p className="text-gray-300"><strong className="text-[#f89422]">Operating Name:</strong> {t.privacy.companyInfo.operatingName}</p>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-[#f89422]">Website:</strong> {t.privacy.companyInfo.website}</p>
                <p className="text-gray-300"><strong className="text-[#f89422]">Email:</strong> {t.privacy.companyInfo.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.dataCollection.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.dataCollection.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.dataCollection.description}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-[#f89422]">
                  {t.privacy.dataCollection.personalInfo.title}
                </h4>
                <ul className="space-y-2">
                  {t.privacy.dataCollection.personalInfo.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4 text-[#f89422]">
                  {t.privacy.dataCollection.automaticData.title}
                </h4>
                <ul className="space-y-2">
                  {t.privacy.dataCollection.automaticData.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.purpose.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.purpose.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.purpose.description}
            </p>
            <ul className="space-y-2">
              {t.privacy.purpose.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Consent */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.consent.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.consent.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.consent.description}
            </p>
            <ul className="space-y-2">
              {t.privacy.consent.methods.map((method, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{method}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Sharing */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.sharing.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.sharing.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.sharing.description}
            </p>
            <ul className="space-y-2">
              {t.privacy.sharing.parties.map((party, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{party}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.internationalTransfers.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.internationalTransfers.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t.privacy.internationalTransfers.description}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t.privacy.internationalTransfers.replitInfo}
            </p>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.dataProtection.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.dataProtection.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.dataProtection.description}
            </p>
            <ul className="space-y-2">
              {t.privacy.dataProtection.measures.map((measure, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{measure}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.cookies.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.cookies.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t.privacy.cookies.description}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t.privacy.cookies.replitCookies}
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 bg-black border-[#f89422]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#f89422]" />
              <span className="text-[#3b82f6]">{t.privacy.rights.title.split(' ')[0]}</span>{' '}
              <span className="text-[#f89422]">{t.privacy.rights.title.split(' ').slice(1).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.privacy.rights.description}
            </p>
            <ul className="space-y-2">
              {t.privacy.rights.userRights.map((right, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#f89422] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{right}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact & Changes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black border-[#f89422]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-[#f89422]" />
                <span className="text-[#3b82f6]">{t.privacy.contact.title.split(' ')[0]}</span>{' '}
                <span className="text-[#f89422]">{t.privacy.contact.title.split(' ').slice(1).join(' ')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {t.privacy.contact.description}
              </p>
              <p className="text-[#f89422] font-semibold">
                {t.privacy.contact.email}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#f89422]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#f89422]" />
                <span className="text-[#3b82f6]">{t.privacy.changes.title.split(' ')[0]}</span>{' '}
                <span className="text-[#f89422]">{t.privacy.changes.title.split(' ').slice(1).join(' ')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {t.privacy.changes.description}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.changes.notification}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}