# SideQuest.BN Full-Stack Prototype

This prototype focuses on **Fast Secure Payments** for the Brunei market, featuring a virtual wallet, escrow protection, and automated payouts.

## Key Features
1.  **Wallet & Virtual Card**: Sleek UI with a "SideQuest Virtual Card" and a simulated Brunei "tarus" top-up flow.
2.  **Escrow Protection**: "Pay-to-Post" logic ensures employers have funds. Funds are locked in escrow when a quest starts.
3.  **BND SECURED Badge**: Visual assurance for workers that funds are locked and ready for payout.
4.  **Auto-Payout Engine**: 20-minute countdown after completion proof is submitted. Funds release automatically if no dispute is raised.
5.  **PDF Receipts**: Official receipts with "VERIFIED" stamps generated via `jsPDF`.
6.  **Debug Mode**: A hidden-style button to "Force Auto-Release Now" for instant demonstration.

## How to Run
Since this is a React/Node.js project, you will need to install the dependencies and start both the frontend and backend.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server (Port 3001)
```bash
npm run server
```

### 3. Start the Frontend Development Server (Vite)
```bash
npm run dev
```

### 4. Access the App
Open your browser and go to `http://localhost:5173` (or the port Vite provides).

## Technical Stack
- **Frontend**: React (Vite), Framer Motion, Lucide-React, jsPDF.
- **Backend**: Node.js (Express) with simulated in-memory state.
- **State Management**: React Context API (`PaymentContext`).
