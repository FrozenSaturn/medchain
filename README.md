<div align="center">
  <img src="public/logomain.png" alt="MedConnect Logo" width="150"/>
  <h1>MedConnect</h1>
  <p>A modern, decentralized healthcare platform connecting patients, doctors, and administrators.</p>
</div>

---

**MedConnect** is a next-generation healthcare application built with Next.js, Supabase, and blockchain technology. It aims to streamline medical interactions by providing a transparent, secure, and efficient platform for managing appointments, medical records, and payments. By leveraging NFTs for medical records, MedConnect puts patients in control of their own data.

## ✨ Core Features

MedConnect offers a role-based experience tailored to the needs of each user group.

### 🧑‍⚕️ For Patients

- **Secure Authentication**: Easy and secure login to the patient portal.
- **Find Doctors**: Search for available doctors and view their profiles.
- **Book Appointments**: Schedule appointments with preferred doctors seamlessly.
- **Medical Records as NFTs**: View and manage your medical history as non-fungible tokens, ensuring data ownership and portability.
- **Payment System**: Handle payments for treatments and appointments within the app.
- **Appointment Status**: Track the status of your upcoming appointments.

### 🩺 For Doctors

- **Appointment Queue**: View and manage a queue of upcoming patient appointments.
- **Patient History**: Access relevant patient medical records to provide informed care.
- **Diagnosis Submission**: Submit diagnoses and treatment notes directly to the patient's record.
- **Profile Management**: Maintain a professional profile for patients to view.

### ⚙️ For Admins

- **Role Verification**: Manage and verify the roles of users (Patients, Doctors).
- **Appointment Oversight**: View and manage all appointments on the platform.
- **Payment Tracking**: Monitor and track all financial transactions.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Web3 & Blockchain**: [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/) for NFT integration.
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **CORE BlockChain**: [High security (BTC-level), Scalability, Low fees, EVM support](https://coredao.org/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd MedConnect
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Supabase project credentials. You can find these in your Supabase project's dashboard under `Project Settings > API`.

    ```.env.local
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **Set up the database:**

    You can set up the database schema by running the SQL commands found in `supabase.sql` or `medchain.sql` in the Supabase SQL editor.

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

6.  Open the deployed MedConnect URL in your browser to see the application.

## 📁 Project Structure

Of course. Here is the project structure you provided, formatted as a markdown code block:

```markdown
MedConnect/
├── app/ # Next.js App Router: pages and API routes
│ ├── (auth)/ # Authentication routes (login, signup)
│ ├── dashboard/ # Main dashboards (admin, doctor, patient)
│ └── api/ # API routes
├── components/ # Shared UI components (built with shadcn/ui)
├── components-for-dash/ # Larger components specific to dashboards
├── lib/ # Libraries and utilities
│ └── supabase/ # Supabase client, server, and middleware logic
├── providers/ # React context providers (Theme, Wagmi)
├── public/ # Static assets (images, logos)
└── tailwind.config.ts # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and open a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is likely under the MIT License. Please add a LICENSE file to confirm.

## 🔧 Key Features Deep Dive

### **🤖 AI-Powered Medical Assistant**

The platform features a sophisticated RAG (Retrieval-Augmented Generation) chatbot that:

- Accesses medical database for context-aware responses
- Provides health insights based on patient data
- Assists doctors with diagnosis and treatment recommendations
- Maintains patient confidentiality while offering personalized advice

### **🏷️ Medical Records as NFTs**

- **Smart Contract Integration**: Custom ERC-721 contracts for medical records
- **IPFS Storage**: Medical documents stored on decentralized IPFS network
- **Patient Ownership**: Patients control their medical data through NFT ownership
- **Immutable Records**: Blockchain ensures data integrity and prevents tampering
- **Portable Health Data**: NFTs can be transferred between healthcare providers

### **📁 Decentralized File Storage**

- **Pinata Integration**: Professional IPFS pinning service
- **Secure Upload**: Files uploaded directly to IPFS via Pinata
- **Metadata Management**: JSON metadata stored alongside medical files
- **Access Control**: Role-based access to medical documents
- **Version Control**: Track changes in medical records over time

### **🔐 Role-Based Access Control**

- **Patient Portal**: View medical NFTs
- **Doctor Portal**: Access patient records, submit diagnoses, manage appointments
- **Admin Portal**: Oversee platform operations, verify roles, track transactions
- **Smart Contract Verification**: Blockchain-based role verification

## 🎨 UI/UX Features

### **Modern Design System**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components with Radix UI
- **Smooth Animations**: Framer Motion for delightful interactions
- **Loading States**: Skeleton components and loading indicators

### **Interactive Components**

- **Real-time Chat**: WebSocket-powered AI assistant
- **Drag & Drop**: File upload with visual feedback
- **Data Visualization**: Charts and graphs for health metrics
- **3D Elements**: Three.js integration for immersive experiences
- **Toast Notifications**: User feedback with Sonner

## 🤝 Security & Privacy

### **Data Protection**

- **End-to-End Encryption**: All sensitive data encrypted in transit and at rest
- **Role-Based Permissions**: Granular access control
- **Audit Trails**: Complete transaction and access logging
- **Data Anonymization**: AI processing with privacy protection

### **Blockchain Security**

- **Smart Contract Audits**: Security-reviewed contracts
- **Multi-Signature Wallets**: Enhanced security for admin operations
- **Gas Optimization**: Efficient blockchain transactions
- **Fallback Mechanisms**: Backup systems for critical operations

## 🤝 Deployment

### **Vercel Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Environment Variables for Production**

Ensure all environment variables are set in your production environment:

- Supabase credentials
- GEMINI API keys
- Pinata Client Secret
- Blockchain network settings

## 🙏 Acknowledgments

- **Supabase** for the excellent backend infrastructure
- **Vercel** for the amazing deployment platform
- **shadcn/ui** for the beautiful component library
- **Google AI** for the powerful Gemini model
- **Pinata** for reliable IPFS services
- **Wagmi** for seamless Web3 integration

<div align="center">
  <p><strong>Built with ❤️ for the future of healthcare</strong></p>
  <p>Star ⭐ this repository if you find it helpful!</p>
</div>
