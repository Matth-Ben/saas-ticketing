import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Board, boardService } from '../services/boardService'
import { companySettingsService, CompanySettings } from '../services/companySettingsService'
import { quoteService, QuoteLineType } from '../services/quoteService'

function CreateQuote() {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const [, setBoard] = useState<Board | null>(null)
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // État des sections ouvertes/fermées
  const [openSections, setOpenSections] = useState({
    appearance: false,
    quoteInfo: false,
    clientInfo: false,
    products: false,
    financial: false,
    delivery: false
  })

  // État du devis
  const [quote, setQuote] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    validUntil: '',
    hourlyRate: 50,
    margin: 20,
    color: '#3b82f6',
    logo: '',
  })

  // Lignes du devis
  const [lines, setLines] = useState<Array<{
    id: string
    type: QuoteLineType
    title: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    estimatedHours?: number
    category?: string
  }>>([
    {
      id: '1',
      type: QuoteLineType.TASK,
      title: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      estimatedHours: 0,
      category: '',
    }
  ])

  // Conditions de livraison et paiement
  const [delivery, setDelivery] = useState({
    deliveryTime: '30 jours',
    deliveryMethod: 'Livraison par email',
    deliveryAddress: '',
  })

  const [payment, setPayment] = useState({
    paymentTerms: '30 jours',
    paymentMethod: 'Virement bancaire',
    advancePayment: 30,
    bankDetails: '',
  })

  // Listes prédéfinies pour les dropdowns
  const deliveryTimes = [
    '7 jours',
    '15 jours',
    '30 jours',
    '45 jours',
    '60 jours',
    '90 jours',
    'Sur mesure'
  ]

  const deliveryMethods = [
    'Livraison par email',
    'Livraison en main propre',
    'Livraison par courrier',
    'Livraison par transporteur',
    'Téléchargement',
    'Sur site client'
  ]

  const paymentTerms = [
    'À la commande',
    '7 jours',
    '15 jours',
    '30 jours',
    '45 jours',
    '60 jours',
    '90 jours'
  ]

  const paymentMethods = [
    'Virement bancaire',
    'Chèque',
    'Espèces',
    'Carte bancaire',
    'PayPal',
    'Stripe',
    'Prélèvement automatique'
  ]

  const advancePayments = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  const commonServices = [
    'Développement web',
    'Développement mobile',
    'Design UI/UX',
    'Intégration API',
    'Maintenance',
    'Formation',
    'Consulting',
    'Audit technique',
    'Optimisation SEO',
    'Hébergement',
    'Support technique',
    'Migration de données'
  ]

  const commonMaterials = [
    'Licence logiciel',
    'Hébergement web',
    'Nom de domaine',
    'Certificat SSL',
    'Template premium',
    'Plugin/Extension',
    'API tierce',
    'Matériel informatique'
  ]

  const categories = [
    'Développement',
    'Design',
    'Marketing',
    'Formation',
    'Maintenance',
    'Consulting',
    'Infrastructure',
    'Sécurité',
    'Performance',
    'Migration',
    'Intégration',
    'Support'
  ]

  // Listes prédéfinies pour toutes les sections

  const quoteTitles = [
    'Développement de site web',
    'Application mobile',
    'Refonte de site web',
    'Maintenance et support',
    'Formation utilisateurs',
    'Audit technique',
    'Migration de données',
    'Intégration API',
    'Optimisation SEO',
    'Design UI/UX',
    'Consulting stratégique',
    'Hébergement et infrastructure'
  ]

  const clientNames = [
    'Entreprise ABC',
    'Startup Tech',
    'Agence Marketing',
    'Commerce en ligne',
    'Association',
    'Freelance',
    'PME',
    'Grande entreprise',
    'Collectivité',
    'Particulier'
  ]

  const hourlyRates = [
    25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
    110, 120, 130, 140, 150, 160, 170, 180, 190, 200
  ]

  const margins = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
  ]

  const validUntilOptions = [
    '7 jours',
    '15 jours',
    '30 jours',
    '45 jours',
    '60 jours',
    '90 jours',
    '6 mois',
    '1 an'
  ]

  useEffect(() => {
    loadData()
  }, [boardId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Charger le projet et les paramètres de l'entreprise
      const [boardData, companyData] = await Promise.all([
        boardId ? boardService.getById(boardId) : Promise.resolve(null),
        companySettingsService.get()
      ])

      setBoard(boardData)
      setCompanySettings(companyData)

      // Pré-remplir avec les données du projet
      if (boardData) {
        setQuote(prev => ({
          ...prev,
          title: `Devis - ${boardData.name}`,
          clientName: boardData.clientName || boardData.name,
          clientEmail: boardData.clientEmail || '',
          clientAddress: boardData.clientAddress || '',
          clientPhone: boardData.clientPhone || '',
          hourlyRate: companyData.defaultHourlyRate,
          margin: companyData.defaultMargin,
        }))
      }

      if (companyData) {
        setQuote(prev => ({
          ...prev,
          hourlyRate: prev.hourlyRate || companyData.defaultHourlyRate,
          margin: prev.margin || companyData.defaultMargin,
          logo: companyData.logo || '',
        }))
      }
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleQuoteChange = (field: string, value: any) => {
    setQuote(prev => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleLineChange = (id: string, field: string, value: any) => {
    setLines(prev => prev.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, [field]: value }
        
        // Recalculer le total si nécessaire
        if (field === 'quantity' || field === 'unitPrice') {
          updatedLine.totalPrice = updatedLine.quantity * updatedLine.unitPrice
        }
        
        return updatedLine
      }
      return line
    }))
  }

  const addLine = () => {
    const newId = (lines.length + 1).toString()
    setLines(prev => [...prev, {
      id: newId,
      type: QuoteLineType.TASK,
      title: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      estimatedHours: 0,
      category: '',
    }])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(prev => prev.filter(line => line.id !== id))
    }
  }

  const calculateTotal = () => {
    const subtotal = lines.reduce((sum, line) => sum + line.totalPrice, 0)
    const totalWithMargin = subtotal * (1 + quote.margin / 100)
    return { subtotal, totalWithMargin }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!boardId) {
        setError('ID du projet manquant')
        return
      }

      // Créer le devis
      const newQuote = await quoteService.create({
        boardId,
        title: quote.title,
        description: quote.description,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientAddress: quote.clientAddress,
        validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString() : undefined,
        totalAmount: calculateTotal().totalWithMargin,
        totalHours: lines.reduce((sum, line) => sum + (line.estimatedHours || 0), 0),
        hourlyRate: quote.hourlyRate,
        margin: quote.margin,
      })

      // Créer les lignes du devis
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.title.trim()) {
          await quoteService.addLine(newQuote.id, {
            lineNumber: i + 1,
            type: line.type,
            title: line.title,
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            totalPrice: line.totalPrice,
            estimatedHours: line.estimatedHours,
            category: line.category,
          })
        }
      }

      setSuccess('Devis créé avec succès !')
      setTimeout(() => {
        navigate(`/boards`)
      }, 2000)
    } catch (err) {
      console.error('Failed to create quote:', err)
      setError('Erreur lors de la création du devis')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
      </div>
    )
  }

  const { subtotal, totalWithMargin } = calculateTotal()

  return (
    <div className="h-full max-h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📄 Créer un nouveau devis
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Créez un devis professionnel avec rendu en temps réel
          </p>
        </div> 

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Aperçu en temps réel */}
          <div className="col-span-5 lg:sticky lg:top-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-white">
              {/* En-tête */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: quote.color }}>
                <div className="flex items-center gap-4">
                  {quote.logo && (
                    <img src={quote.logo} alt="Logo" className="h-12 w-auto" />
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {companySettings?.name || 'Votre Entreprise'}
                    </h1>
                    {companySettings && (
                      <p className="text-sm text-gray-600">
                        {companySettingsService.formatFullAddress(companySettings)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: quote.color }}>
                    DEVIS
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Informations du devis */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {quote.title || 'Titre du devis'}
                </h2>
                {quote.description && (
                  <p className="text-gray-600 mb-4">{quote.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                    <p className="text-gray-600">{quote.clientName || 'Nom du client'}</p>
                    {quote.clientEmail && <p className="text-gray-600">{quote.clientEmail}</p>}
                    {quote.clientPhone && <p className="text-gray-600">{quote.clientPhone}</p>}
                    {quote.clientAddress && <p className="text-gray-600">{quote.clientAddress}</p>}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Validité</h3>
                    <p className="text-gray-600">
                      {quote.validUntil 
                        ? new Date(quote.validUntil).toLocaleDateString('fr-FR')
                        : 'Non spécifiée'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Lignes du devis */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Prestations</h3>
                <div className="space-y-2">
                  {lines.map((line, index) => (
                    <div key={line.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {line.title || `Ligne ${index + 1}`}
                        </div>
                        {line.description && (
                          <div className="text-sm text-gray-600">{line.description}</div>
                        )}
                        <div className="text-sm text-gray-500">
                          {line.quantity} × {quoteService.formatAmount(line.unitPrice)}
                          {line.estimatedHours && ` (${quoteService.formatHours(line.estimatedHours)})`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {quoteService.formatAmount(line.totalPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="mb-6">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Sous-total HT</span>
                  <span className="font-medium">{quoteService.formatAmount(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Marge ({quote.margin}%)</span>
                  <span className="font-medium">{quoteService.formatAmount(totalWithMargin - subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t-2 border-gray-200" style={{ borderColor: quote.color }}>
                  <span className="text-lg font-semibold text-gray-900">Total HT</span>
                  <span className="text-lg font-bold" style={{ color: quote.color }}>
                    {quoteService.formatAmount(totalWithMargin)}
                  </span>
                </div>
              </div>

              {/* Conditions */}
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Livraison:</strong> {delivery.deliveryTime} - {delivery.deliveryMethod}</p>
                <p><strong>Paiement:</strong> {payment.paymentTerms} - {payment.paymentMethod}</p>
                {payment.advancePayment > 0 && (
                  <p><strong>Acompte:</strong> {payment.advancePayment}% à la commande</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Formulaire de création */}
          <div className="col-span-3 space-y-6">
            {/* Informations générales */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('appearance')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🎨 Apparence
                </h2>
                <span className={`transform transition-transform ${openSections.appearance ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openSections.appearance && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Couleur du devis
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.color}
                      onChange={(e) => handleQuoteChange('color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="#3b82f6">🔵 Bleu (professionnel)</option>
                      <option value="#10b981">🟢 Vert (naturel)</option>
                      <option value="#f59e0b">🟡 Jaune (énergique)</option>
                      <option value="#ef4444">🔴 Rouge (urgent)</option>
                      <option value="#8b5cf6">🟣 Violet (créatif)</option>
                      <option value="#06b6d4">🔵 Cyan (moderne)</option>
                      <option value="#f97316">🟠 Orange (chaleureux)</option>
                      <option value="#84cc16">🟢 Lime (frais)</option>
                      <option value="#ec4899">🩷 Rose (élégant)</option>
                      <option value="#6366f1">🟦 Indigo (professionnel)</option>
                      <option value="#14b8a6">🟢 Teal (équilibré)</option>
                      <option value="#f43f5e">🩷 Rose (dynamique)</option>
                    </select>
                    <input
                      type="color"
                      value={quote.color}
                      onChange={(e) => handleQuoteChange('color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                      title="Couleur personnalisée"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo (URL)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.logo}
                      onChange={(e) => handleQuoteChange('logo', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Aucun logo</option>
                      <option value="https://via.placeholder.com/150x50/3b82f6/ffffff?text=LOGO">Logo exemple 1</option>
                      <option value="https://via.placeholder.com/150x50/10b981/ffffff?text=LOGO">Logo exemple 2</option>
                      <option value="https://via.placeholder.com/150x50/f59e0b/ffffff?text=LOGO">Logo exemple 3</option>
                    </select>
                    <input
                      type="url"
                      value={quote.logo}
                      onChange={(e) => handleQuoteChange('logo', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="URL personnalisée..."
                    />
                  </div>
                </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations du devis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('quoteInfo')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  📋 Informations du devis
                </h2>
                <span className={`transform transition-transform ${openSections.quoteInfo ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openSections.quoteInfo && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre du devis *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.title}
                      onChange={(e) => handleQuoteChange('title', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Sélectionner un titre...</option>
                      {quoteTitles.map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={quote.title}
                      onChange={(e) => handleQuoteChange('title', e.target.value)}
                      placeholder="Ou saisir manuellement..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={quote.description}
                    onChange={(e) => handleQuoteChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Description détaillée du projet..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validité du devis
                    </label>
                    <select
                      value={quote.validUntil}
                      onChange={(e) => {
                        const selectedOption = e.target.value
                        if (selectedOption === 'custom') {
                          // Laisser l'utilisateur saisir une date personnalisée
                          handleQuoteChange('validUntil', '')
                        } else {
                          // Calculer la date basée sur l'option sélectionnée
                          const today = new Date()
                          const validDate = new Date(today)
                          
                          switch (selectedOption) {
                            case '7 jours':
                              validDate.setDate(today.getDate() + 7)
                              break
                            case '15 jours':
                              validDate.setDate(today.getDate() + 15)
                              break
                            case '30 jours':
                              validDate.setDate(today.getDate() + 30)
                              break
                            case '45 jours':
                              validDate.setDate(today.getDate() + 45)
                              break
                            case '60 jours':
                              validDate.setDate(today.getDate() + 60)
                              break
                            case '90 jours':
                              validDate.setDate(today.getDate() + 90)
                              break
                            case '6 mois':
                              validDate.setMonth(today.getMonth() + 6)
                              break
                            case '1 an':
                              validDate.setFullYear(today.getFullYear() + 1)
                              break
                            default:
                              validDate.setDate(today.getDate() + 30)
                          }
                          
                          handleQuoteChange('validUntil', validDate.toISOString().split('T')[0])
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {validUntilOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                      <option value="custom">Date personnalisée</option>
                    </select>
                  </div>
                  
                  {quote.validUntil && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date personnalisée
                      </label>
                      <input
                        type="date"
                        value={quote.validUntil}
                        onChange={(e) => handleQuoteChange('validUntil', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations du client */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('clientInfo')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  👤 Informations du client
                </h2>
                <span className={`transform transition-transform ${openSections.clientInfo ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openSections.clientInfo && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du client *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.clientName}
                      onChange={(e) => handleQuoteChange('clientName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Sélectionner un client...</option>
                      {clientNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={quote.clientName}
                      onChange={(e) => handleQuoteChange('clientName', e.target.value)}
                      placeholder="Ou saisir manuellement..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={quote.clientEmail}
                      onChange={(e) => handleQuoteChange('clientEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={quote.clientPhone}
                      onChange={(e) => handleQuoteChange('clientPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse
                  </label>
                  <textarea
                    value={quote.clientAddress}
                    onChange={(e) => handleQuoteChange('clientAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Adresse complète du client..."
                  />
                </div>
                  </div>
                </div>
              )}
            </div>

            {/* Produits et services */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🛍️ Produits et services
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addLine()
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Ajouter
                  </button>
                  <span className={`transform transition-transform ${openSections.products ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>
              
              {openSections.products && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                {lines.map((line, index) => (
                  <div key={line.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Ligne {index + 1}
                      </h3>
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Type
                        </label>
                        <select
                          value={line.type}
                          onChange={(e) => handleLineChange(line.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value={QuoteLineType.TASK}>Tâche</option>
                          <option value={QuoteLineType.SERVICE}>Service</option>
                          <option value={QuoteLineType.MATERIAL}>Matériel</option>
                          <option value={QuoteLineType.DISCOUNT}>Remise</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={line.category}
                          onChange={(e) => handleLineChange(line.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Sélectionner une catégorie...</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Titre *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={line.title}
                          onChange={(e) => handleLineChange(line.id, 'title', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Sélectionner un service...</option>
                          {line.type === QuoteLineType.SERVICE && commonServices.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                          {line.type === QuoteLineType.MATERIAL && commonMaterials.map((material) => (
                            <option key={material} value={material}>{material}</option>
                          ))}
                          {line.type === QuoteLineType.TASK && (
                            <>
                              {commonServices.map((service) => (
                                <option key={service} value={service}>{service}</option>
                              ))}
                            </>
                          )}
                          {line.type === QuoteLineType.DISCOUNT && (
                            <>
                              <option value="Remise commerciale">Remise commerciale</option>
                              <option value="Remise fidélité">Remise fidélité</option>
                              <option value="Remise volume">Remise volume</option>
                              <option value="Remise early bird">Remise early bird</option>
                            </>
                          )}
                        </select>
                        <input
                          type="text"
                          value={line.title}
                          onChange={(e) => handleLineChange(line.id, 'title', e.target.value)}
                          placeholder="Ou saisir manuellement..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={line.description}
                        onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantité
                        </label>
                        <div className="flex gap-1">
                          <select
                            value={line.quantity}
                            onChange={(e) => handleLineChange(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <input
                            type="number"
                            value={line.quantity}
                            onChange={(e) => handleLineChange(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="Custom"
                            className="w-20 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Prix unitaire (€)
                        </label>
                        <div className="flex gap-1">
                          <select
                            value={line.unitPrice}
                            onChange={(e) => handleLineChange(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value={0}>Sélectionner...</option>
                            <option value={25}>25€</option>
                            <option value={50}>50€</option>
                            <option value={75}>75€</option>
                            <option value={100}>100€</option>
                            <option value={150}>150€</option>
                            <option value={200}>200€</option>
                            <option value={300}>300€</option>
                            <option value={500}>500€</option>
                            <option value={750}>750€</option>
                            <option value={1000}>1000€</option>
                            <option value={1500}>1500€</option>
                            <option value={2000}>2000€</option>
                          </select>
                          <input
                            type="number"
                            value={line.unitPrice}
                            onChange={(e) => handleLineChange(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            placeholder="Custom"
                            className="w-24 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Heures estimées
                        </label>
                        <div className="flex gap-1">
                          <select
                            value={line.estimatedHours || 0}
                            onChange={(e) => handleLineChange(line.id, 'estimatedHours', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value={0}>0h</option>
                            <option value={0.5}>30min</option>
                            <option value={1}>1h</option>
                            <option value={2}>2h</option>
                            <option value={4}>4h</option>
                            <option value={8}>8h (1 jour)</option>
                            <option value={16}>16h (2 jours)</option>
                            <option value={24}>24h (3 jours)</option>
                            <option value={40}>40h (1 semaine)</option>
                            <option value={80}>80h (2 semaines)</option>
                            <option value={160}>160h (1 mois)</option>
                          </select>
                          <input
                            type="number"
                            value={line.estimatedHours || 0}
                            onChange={(e) => handleLineChange(line.id, 'estimatedHours', parseFloat(e.target.value) || 0)}
                            placeholder="Custom"
                            className="w-20 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Total (€)
                        </label>
                        <input
                          type="number"
                          value={line.totalPrice}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
            </div>

            {/* Paramètres financiers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('financial')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  💰 Paramètres financiers
                </h2>
                <span className={`transform transition-transform ${openSections.financial ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openSections.financial && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taux horaire (€/h)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.hourlyRate}
                      onChange={(e) => handleQuoteChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {hourlyRates.map((rate) => (
                        <option key={rate} value={rate}>{rate}€/h</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={quote.hourlyRate}
                      onChange={(e) => handleQuoteChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      placeholder="Custom"
                      className="w-24 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marge (%)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={quote.margin}
                      onChange={(e) => handleQuoteChange('margin', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {margins.map((margin) => (
                        <option key={margin} value={margin}>
                          {margin === 0 ? 'Aucune marge' : `${margin}%`}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={quote.margin}
                      onChange={(e) => handleQuoteChange('margin', parseFloat(e.target.value) || 0)}
                      placeholder="Custom"
                      className="w-20 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>
                  </div>
                </div>
              )}
            </div>

            {/* Livraison et paiement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection('delivery')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🚚 Livraison et paiement
                </h2>
                <span className={`transform transition-transform ${openSections.delivery ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openSections.delivery && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Délai de livraison
                    </label>
                    <select
                      value={delivery.deliveryTime}
                      onChange={(e) => setDelivery(prev => ({ ...prev, deliveryTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {deliveryTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mode de livraison
                    </label>
                    <select
                      value={delivery.deliveryMethod}
                      onChange={(e) => setDelivery(prev => ({ ...prev, deliveryMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {deliveryMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse de livraison
                  </label>
                  <textarea
                    value={delivery.deliveryAddress}
                    onChange={(e) => setDelivery(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Conditions de paiement
                    </label>
                    <select
                      value={payment.paymentTerms}
                      onChange={(e) => setPayment(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {paymentTerms.map((term) => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mode de paiement
                    </label>
                    <select
                      value={payment.paymentMethod}
                      onChange={(e) => setPayment(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Acompte (%)
                    </label>
                    <select
                      value={payment.advancePayment}
                      onChange={(e) => setPayment(prev => ({ ...prev, advancePayment: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {advancePayments.map((percent) => (
                        <option key={percent} value={percent}>
                          {percent === 0 ? 'Aucun acompte' : `${percent}%`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Coordonnées bancaires
                  </label>
                  <textarea
                    value={payment.bankDetails}
                    onChange={(e) => setPayment(prev => ({ ...prev, bankDetails: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="IBAN, BIC, etc."
                  />
                </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !quote.title || !quote.clientName}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Création...' : '💾 Créer le devis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuote
