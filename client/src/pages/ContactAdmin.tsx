import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../contexts/TranslationContext';
import type { ContactMessage } from '@shared/schema';

export default function ContactAdmin() {
  const { t } = useTranslation();
  
  const { data: messages, isLoading, error } = useQuery<{success: boolean, messages: ContactMessage[]}>({
    queryKey: ['/api/contact'],
    queryFn: async () => {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <main className="py-16 bg-rg-dark-bg min-h-screen w-full">
        <div className="container-responsive">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Chargement des messages...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-16 bg-rg-dark-bg min-h-screen w-full">
        <div className="container-responsive">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Erreur</h1>
            <p className="text-gray-300">Impossible de charger les messages de contact.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 bg-rg-dark-bg min-h-screen w-full">
      <div className="container-responsive">
        <header className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Messages de Contact</h1>
          <p className="text-xl text-gray-300">
            Administration des messages reçus via le formulaire de contact
          </p>
        </header>

        <div className="space-y-6">
          {messages?.messages?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aucun message reçu pour le moment.</p>
            </div>
          ) : (
            messages?.messages?.map((message) => (
              <div key={message.id} className="bg-rg-card-bg rounded-2xl p-6 border border-rg-gray">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {message.firstName} {message.lastName}
                    </h3>
                    <p className="text-orange-400">{message.email}</p>
                    {message.service && (
                      <p className="text-gray-300 text-sm mt-1">
                        Service: {message.service}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-rg-dark-bg p-4 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}