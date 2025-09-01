# token-prisale-fe

A comprehensive Solana-based token trading platform built with Next.js, featuring real-time trading charts, token creation, and social trading features.

## 🚀 Features

### Core Functionality
- **Token Creation & Launch**: Create and launch new tokens with custom metadata
- **Real-time Trading**: Live trading interface with TradingView charts integration
- **Social Trading**: Chat and social features for traders
- **Token Discovery**: Browse and filter tokens with real-time updates
- **Wallet Integration**: Full Solana wallet support with multiple adapters

### Technical Features
- **Real-time Updates**: WebSocket integration for live token and trade updates
- **Advanced Charts**: TradingView charting library with custom data feeds
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Solana Program Integration**: Direct integration with custom Solana programs

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### Blockchain & Web3
- **Solana Web3.js** - Solana blockchain interaction
- **Anchor Framework** - Solana program development
- **Raydium SDK** - DEX integration
- **Metaplex** - NFT and metadata standards

### Additional Libraries
- **TradingView Charting Library** - Professional trading charts
- **React Query** - Data fetching and caching
- **Socket.io** - Real-time communication
- **Pinata SDK** - IPFS file storage

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create-coin/       # Token creation interface
│   ├── dashboard/         # User dashboard
│   ├── profile/          # User profile management
│   └── trading/          # Trading interface
├── components/            # React components
│   ├── TVChart/          # TradingView chart components
│   ├── trading/          # Trading-related components
│   ├── cards/            # UI card components
│   └── modals/           # Modal components
├── program/               # Solana program integration
│   ├── pumpfun.ts        # Main program interface
│   └── web3.ts           # Web3 utilities
├── contexts/              # React contexts
│   ├── SocketContext.tsx # WebSocket management
│   └── SolanaWalletProvider.tsx # Wallet integration
└── utils/                 # Utility functions
    ├── types.ts          # TypeScript type definitions
    └── fileUpload.ts     # File upload utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn or npm
- Solana CLI tools
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/topsecretagent007/token-prisale-fe.git
   cd token-prisale-fe
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=your_solana_rpc_url
   NEXT_PUBLIC_PROGRAM_ID=your_program_id
   NEXT_PUBLIC_LIMITE_SOLAMOUNT=your_limit
   ```

4. **Run the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

   The application will be available at `http://localhost:7501`

## 🔧 Available Scripts

- `yarn dev` - Start development server on port 7501
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🌟 Key Features Explained

### Token Creation
- Create new tokens with custom metadata
- Upload images and metadata to IPFS via Pinata
- Configure token supply, presale settings, and social links
- Launch tokens directly on Solana

### Trading Interface
- Real-time price charts using TradingView
- Live order book and trade history
- Social trading features with chat
- Token holder information and analytics

### Real-time Updates
- WebSocket integration for live token updates
- Program log listeners for Solana events
- Instant trade execution notifications
- Live market data updates

## 🔗 Integration Points

### Solana Programs
- **Pumpfun Program**: Main token creation and trading logic
- **Agents Land Listener**: Real-time program log monitoring
- **Token Swap Handler**: Automated market making

### External Services
- **Pinata**: IPFS file storage for metadata and images
- **TradingView**: Professional charting library
- **Raydium**: DEX integration for token swaps

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Modern dark interface with accent colors
- **Loading States**: Smooth loading animations and spinners
- **Toast Notifications**: User feedback for actions
- **Modal System**: Clean modal interfaces for forms

## 🔒 Security Features

- **Wallet Authentication**: Secure Solana wallet integration
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error handling throughout
- **Type Safety**: Full TypeScript coverage

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface elements
- Mobile-optimized trading charts
- Responsive navigation

## 🤝 Contributing

This is a private repository. For questions or collaboration, please contact the maintainer.

## 📞 Contact Information

- **Telegram**: [@topsecretagent_007](https://t.me/topsecretagent_007)
- **Twitter**: [@lendon1114](https://twitter.com/lendon1114)
- **Email**: lendonbracewell1114@gmail.com
- **GitHub**: [@topsecretagent007](https://github.com/topsecretagent007)

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Solana Foundation for the blockchain infrastructure
- TradingView for the charting library
- Anchor Framework team for Solana program development tools
- Raydium for DEX integration capabilities

---

**Note**: This is a closed-source, private project. Please respect the intellectual property rights and do not redistribute without permission.
