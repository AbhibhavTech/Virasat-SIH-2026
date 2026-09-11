export const declaration = {
  name: 'initiateBookingHandoff',
  description: 'Generate official government booking handoff links (ASI online ticketing, IRCTC rail tickets, State Tourism transport) with destination pre-fill parameters.',
  parameters: {
    type: 'OBJECT',
    properties: {
      booking_type: {
        type: 'STRING',
        description: 'Type of booking: "monument_ticket", "train", "bus", or "hotel".',
      },
      destination: {
        type: 'STRING',
        description: 'Monument name or destination city.',
      },
      date: {
        type: 'STRING',
        description: 'Travel date in YYYY-MM-DD or readable format.',
      },
    },
    required: ['booking_type', 'destination'],
  },
};

export async function execute(args: {
  booking_type: string;
  destination: string;
  date?: string;
}): Promise<any> {
  const bType = args.booking_type.toLowerCase();
  const dest = args.destination.trim();

  if (bType === 'monument_ticket' || bType.includes('monument') || bType.includes('asi')) {
    return {
      service: 'Archaeological Survey of India (ASI) E-Ticketing',
      official_portal: 'https://asi.payumoney.com',
      alternate_portal: 'https://monuments.asi.nic.in',
      destination: dest,
      instructions: [
        'Select the circle/monument on the official ASI ticket portal.',
        'Choose your entry slot (Forenoon or Afternoon).',
        'Indian citizens get a subsidized rate with Photo ID verification; foreign travelers use the international entry counter.',
        'QR e-tickets are delivered directly to your mobile number and email.',
      ],
      direct_url: `https://asi.payumoney.com/`,
      handshake_status: 'READY',
    };
  }

  if (bType === 'train' || bType.includes('rail')) {
    return {
      service: 'Indian Railways (IRCTC)',
      official_portal: 'https://www.irctc.co.in/nget/',
      destination: dest,
      instructions: [
        `Search trains toward destination "${dest}".`,
        'Reserve seats under General, Tatkal, or Foreign Tourist Quota if applicable.',
        'Keep original government ID ready during train journey.',
      ],
      direct_url: 'https://www.irctc.co.in/nget/train-search',
      handshake_status: 'READY',
    };
  }

  if (bType === 'hotel' || bType.includes('hotel') || bType.includes('stay')) {
    return {
      service: 'State Tourism Development Corporation Hotels',
      destination: dest,
      instructions: [
        `Browse RTDC / MPTDC / KSTDC / KTDC heritage tourist bungalows in ${dest}.`,
        'Government tourism guest houses offer prime locations next to major monuments.',
      ],
      direct_url: 'https://tourism.gov.in/stay',
      handshake_status: 'READY',
    };
  }

  return {
    service: 'Incredible India Official Travel Desk',
    official_portal: 'https://www.incredibleindia.gov.in',
    destination: dest,
    direct_url: 'https://www.incredibleindia.gov.in',
    handshake_status: 'READY',
  };
}
