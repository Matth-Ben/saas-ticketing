import { Quote, quoteService } from '../../services/quoteService'
import { companySettingsService, CompanySettings } from '../../services/companySettingsService'

interface QuotePDFExportProps {
  quote: Quote
}

function QuotePDFExport({ quote }: QuotePDFExportProps) {
  const handleExportPDF = async () => {
    try {
      // Récupérer les paramètres de l'entreprise
      const companySettings = await companySettingsService.get()
      
      // Pour l'instant, on utilise une approche simple avec window.print()
      // Plus tard, on pourra implémenter une vraie génération PDF avec jsPDF
      
      // Créer une nouvelle fenêtre avec le contenu du devis
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez les bloqueurs de popup.')
        return
      }

      const htmlContent = generateQuoteHTML(quote, companySettings)
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error)
      alert('Erreur lors de l\'export PDF')
    }
  }

  const generateQuoteHTML = (quote: Quote, companySettings: CompanySettings): string => {
    const currentDate = new Date().toLocaleDateString('fr-FR')
    const validUntilDate = quote.validUntil 
      ? new Date(quote.validUntil).toLocaleDateString('fr-FR')
      : 'Non spécifiée'

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devis ${quote.quoteNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 20px;
        }
        .company-info {
            flex: 1;
        }
        .quote-info {
            text-align: right;
            flex: 1;
        }
        .quote-title {
            font-size: 24px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .quote-number {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .client-info {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .client-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #3B82F6;
        }
        .lines-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .lines-table th,
        .lines-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .lines-table th {
            background-color: #3B82F6;
            color: white;
            font-weight: bold;
        }
        .lines-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals {
            margin-left: auto;
            width: 300px;
            margin-bottom: 30px;
        }
        .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals td {
            padding: 8px 12px;
            border: 1px solid #ddd;
        }
        .totals .label {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .totals .amount {
            text-align: right;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-draft { background-color: #e5e7eb; color: #374151; }
        .status-sent { background-color: #dbeafe; color: #1d4ed8; }
        .status-accepted { background-color: #dcfce7; color: #166534; }
        .status-rejected { background-color: #fee2e2; color: #dc2626; }
        .status-invoiced { background-color: #f3e8ff; color: #7c3aed; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h1>${companySettings.name}</h1>
            ${companySettingsService.formatFullAddress(companySettings) ? `<p>${companySettingsService.formatFullAddress(companySettings)}</p>` : ''}
            ${companySettings.phone ? `<p>Téléphone: ${companySettings.phone}</p>` : ''}
            ${companySettings.email ? `<p>Email: ${companySettings.email}</p>` : ''}
            ${companySettings.website ? `<p>Site web: ${companySettings.website}</p>` : ''}
        </div>
        <div class="quote-info">
            <div class="quote-title">DEVIS</div>
            <div class="quote-number">${quote.quoteNumber}</div>
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Validité:</strong> ${validUntilDate}</p>
            <p><strong>Statut:</strong> 
                <span class="status-badge status-${quote.status}">
                    ${quoteService.getStatusLabel(quote.status)}
                </span>
            </p>
        </div>
    </div>

    <div class="client-info">
        <div class="client-title">CLIENT</div>
        <p><strong>${quote.clientName}</strong></p>
        ${quote.clientEmail ? `<p>Email: ${quote.clientEmail}</p>` : ''}
        ${quote.clientAddress ? `<p>Adresse: ${quote.clientAddress}</p>` : ''}
    </div>

    ${quote.description ? `
    <div style="margin-bottom: 30px;">
        <h3>Description du projet</h3>
        <p>${quote.description}</p>
    </div>
    ` : ''}

    <table class="lines-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 40%;">Description</th>
                <th style="width: 10%;" class="text-center">Qté</th>
                <th style="width: 15%;" class="text-right">Prix unitaire</th>
                <th style="width: 15%;" class="text-right">Total</th>
                <th style="width: 15%;" class="text-center">Heures</th>
            </tr>
        </thead>
        <tbody>
            ${quote.lines?.map((line, index) => `
                <tr>
                    <td class="text-center">${line.lineNumber}</td>
                    <td>
                        <strong>${line.title}</strong>
                        ${line.description ? `<br><small>${line.description}</small>` : ''}
                        ${line.card ? `<br><small><em>Lien: ${line.card.key} - ${line.card.title}</em></small>` : ''}
                    </td>
                    <td class="text-center">${line.quantity}</td>
                    <td class="text-right">${quoteService.formatAmount(line.unitPrice)}</td>
                    <td class="text-right"><strong>${quoteService.formatAmount(line.totalPrice)}</strong></td>
                    <td class="text-center">${line.estimatedHours ? quoteService.formatHours(line.estimatedHours) : '-'}</td>
                </tr>
            `).join('') || ''}
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td class="label">Sous-total HT</td>
                <td class="amount">${quoteService.formatAmount(quote.totalAmount)}</td>
            </tr>
            <tr>
                <td class="label">Marge (${quote.margin}%)</td>
                <td class="amount">${quoteService.formatAmount(quote.totalAmount * (quote.margin / 100))}</td>
            </tr>
            <tr style="background-color: #e5e7eb;">
                <td class="label"><strong>TOTAL HT</strong></td>
                <td class="amount"><strong>${quoteService.formatAmount(quote.totalAmount * (1 + quote.margin / 100))}</strong></td>
            </tr>
            <tr>
                <td class="label">TVA (20%)</td>
                <td class="amount">${quoteService.formatAmount(quote.totalAmount * (1 + quote.margin / 100) * 0.2)}</td>
            </tr>
            <tr style="background-color: #3B82F6; color: white;">
                <td class="label"><strong>TOTAL TTC</strong></td>
                <td class="amount"><strong>${quoteService.formatAmount(quote.totalAmount * (1 + quote.margin / 100) * 1.2)}</strong></td>
            </tr>
        </table>
    </div>

    <div style="margin-top: 30px;">
        <h3>Résumé</h3>
        <p><strong>Total des heures estimées:</strong> ${quoteService.formatHours(quote.totalHours)}</p>
        <p><strong>Taux horaire moyen:</strong> ${quoteService.formatAmount(quote.hourlyRate)}/h</p>
    </div>

    <div class="footer">
        <p><strong>Conditions générales:</strong></p>
        <ul>
            <li>Ce devis est valable jusqu'au ${validUntilDate}</li>
            <li>Les prix sont exprimés en euros HT</li>
            <li>Les délais de paiement sont de 30 jours</li>
            <li>En cas d'acceptation, un acompte de 30% sera demandé</li>
        </ul>
        ${companySettings.siret || companySettings.vatNumber ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p><strong>Informations légales:</strong></p>
            ${companySettings.siret ? `<p>SIRET: ${companySettings.siret}</p>` : ''}
            ${companySettings.vatNumber ? `<p>N° TVA: ${companySettings.vatNumber}</p>` : ''}
        </div>
        ` : ''}
        <p style="margin-top: 20px; text-align: center;">
            <em>Merci de votre confiance !</em>
        </p>
    </div>
</body>
</html>
    `
  }

  return (
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
    >
      📄 Exporter PDF
    </button>
  )
}

export default QuotePDFExport
