import { useState } from 'react';
import { Sparkles, BookOpen, Heart, Loader2, AlertCircle, CreditCard, Check, X } from 'lucide-react';

const PoeticStudio = () => {
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('');
  const [wordCount, setWordCount] = useState('200-250');
  const [poem, setPoem] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pricingOptions = [
    { range: '200-250', label: '200-250 mots', price: 'Gratuit', priceValue: 0, icon: '🎁' },
    { range: '251-500', label: '251-500 mots', price: '0,50€', priceValue: 0.50, icon: '💫' },
    { range: '501-1000', label: '501-1000 mots', price: '1,00€', priceValue: 1.00, icon: '✨' }
  ];

  const styles = [
    { value: 'romantique', label: 'Romantique', emoji: '💕' },
    { value: 'nature', label: 'Nature', emoji: '🌿' },
    { value: 'moderne', label: 'Moderne', emoji: '🎨' },
    { value: 'melancolique', label: 'Mélancolique', emoji: '🌙' },
    { value: 'joyeux', label: 'Joyeux', emoji: '☀️' },
    { value: 'philosophique', label: 'Philosophique', emoji: '🤔' },
    { value: 'epique', label: 'Épique', emoji: '⚔️' },
    { value: 'lyrique', label: 'Lyrique', emoji: '🎵' },
    { value: 'dramatique', label: 'Dramatique', emoji: '🎭' },
    { value: 'satirique', label: 'Satirique', emoji: '😏' },
    { value: 'pastoral', label: 'Pastoral', emoji: '🐑' },
    { value: 'elegie', label: 'Élégie', emoji: '🕊️' },
    { value: 'ode', label: 'Ode', emoji: '🏛️' },
    { value: 'haiku', label: 'Haïku', emoji: '🎋' },
    { value: 'sonnet', label: 'Sonnet', emoji: '📜' },
    { value: 'ballade', label: 'Ballade', emoji: '🎼' },
    { value: 'acrostiche', label: 'Acrostiche', emoji: '🔤' },
    { value: 'vers-libre', label: 'Vers libre', emoji: '🌊' },
    { value: 'prose-poetique', label: 'Prose poétique', emoji: '📝' },
    { value: 'surréaliste', label: 'Surréaliste', emoji: '🌀' },
    { value: 'symboliste', label: 'Symboliste', emoji: '🔮' },
    { value: 'impressionniste', label: 'Impressionniste', emoji: '🖼️' },
    { value: 'expressionniste', label: 'Expressionniste', emoji: '🎪' },
    { value: 'mystique', label: 'Mystique', emoji: '✨' },
    { value: 'engagé', label: 'Engagé', emoji: '✊' },
    { value: 'absurde', label: 'Absurde', emoji: '🤪' },
    { value: 'nostalgique', label: 'Nostalgique', emoji: '⏳' },
    { value: 'spirituel', label: 'Spirituel', emoji: '🙏' }
  ];

  const handlePaymentInput = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (field === 'cardName') {
      formattedValue = value.toUpperCase();
    }
    
    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const processPayment = async () => {
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiry || !paymentData.cvv) {
      setError('Veuillez remplir tous les champs de paiement');
      return;
    }

    setIsProcessingPayment(true);
    setError('');

    // Simulation de traitement de paiement
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessingPayment(false);
    setShowPayment(false);
    
    // Afficher confirmation
    alert('✅ Paiement accepté ! Génération de votre poésie...');
    
    // Générer la poésie
    await generatePoemAPI();
  };

  const generatePoemAPI = async () => {
    setIsGenerating(true);
    setError('');
    setPoem('');

    try {
      const [min, max] = wordCount.split('-').map(Number);
      const targetWords = Math.floor((min + max) / 2);

      const styleInstruction = style ? `de style ${style}` : '';
      
      const prompt = `Écris une poésie ${styleInstruction} sur le thème : "${theme}". 
La poésie doit faire environ ${targetWords} mots (entre ${min} et ${max} mots).
Crée une poésie belle, émouvante et originale avec des images poétiques fortes.
${style === 'haiku' ? 'Respecte la structure traditionnelle du haïku (5-7-5 syllabes).' : ''}
${style === 'sonnet' ? 'Respecte la structure du sonnet (14 vers).' : ''}
${style === 'acrostiche' ? 'Crée un acrostiche où la première lettre de chaque vers forme un mot en lien avec le thème.' : ''}
Retourne UNIQUEMENT le texte de la poésie, sans titre, sans préambule, sans indication de nombre de mots.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: prompt }
          ],
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        setPoem(data.content[0].text);
      } else {
        setError('Erreur lors de la génération de la poésie');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePoem = async () => {
    if (!theme.trim()) {
      setError('Veuillez entrer un thème pour votre poésie');
      return;
    }

    const currentPrice = getPriceInfo();
    
    // Si gratuit, générer directement
    if (currentPrice.priceValue === 0) {
      await generatePoemAPI();
    } else {
      // Sinon, afficher le formulaire de paiement
      setShowPayment(true);
      setError('');
    }
  };

  const getPriceInfo = () => {
    const option = pricingOptions.find(opt => opt.range === wordCount);
    return option || pricingOptions[0];
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const currentPrice = getPriceInfo();
  const poemWordCount = poem ? countWords(poem) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Poetic Studio
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Créez de magnifiques poésies personnalisées en quelques secondes
          </p>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
              <button
                onClick={() => setShowPayment(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <CreditCard className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement sécurisé</h2>
                <p className="text-3xl font-bold text-purple-600">{currentPrice.price}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => handlePaymentInput('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => handlePaymentInput('cardName', e.target.value)}
                    placeholder="JEAN DUPONT"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiry}
                      onChange={(e) => handlePaymentInput('expiry', e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => handlePaymentInput('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isProcessingPayment
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  } text-white flex items-center justify-center gap-3`}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check className="w-6 h-6" />
                      Payer {currentPrice.price}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Paiement 100% sécurisé (Mode simulation)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          
          {/* Pricing Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Choisissez votre formule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingOptions.map((option) => (
                <button
                  key={option.range}
                  onClick={() => setWordCount(option.range)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    wordCount === option.range
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="font-semibold text-gray-800">{option.label}</div>
                  <div className={`text-lg font-bold mt-1 ${
                    option.price === 'Gratuit' ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    {option.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Style de poésie (optionnel)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(style === s.value ? '' : s.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    style === s.value
                      ? 'border-pink-600 bg-pink-50 shadow-md'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <span className="text-xl mr-2">{s.emoji}</span>
                  <span className="font-medium text-gray-700 text-sm">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Input */}
          <div className="mb-6">
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Thème de votre poésie
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: l'amour, la mer, l'automne, les étoiles..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none text-lg"
              onKeyPress={(e) => e.key === 'Enter' && generatePoem()}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generatePoem}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
            } text-white flex items-center justify-center gap-3`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Générer ma poésie ({currentPrice.price})
              </>
            )}
          </button>
        </div>

        {/* Generated Poem */}
        {poem && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Votre poésie</h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {poemWordCount} mots
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg italic">
                {poem}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(poem);
                  alert('Poésie copiée dans le presse-papiers !');
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                📋 Copier la poésie
              </button>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>✨ Vos poésies sont générées par intelligence artificielle</p>
          <p className="mt-2">💝 Chaque poésie est unique et créée spécialement pour vous</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PoeticStudio;