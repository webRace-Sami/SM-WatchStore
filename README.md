# SM WatchStore ⌚✨

> **Authorized Luxury Horology & Exclusive Timepiece Inventory Management Platform**

SM WatchStore is a modern, responsive full-stack e-commerce and stock management system built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, a **custom Vanilla CSS luxury design system**, and **Vercel deployment readiness**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Luxury Boutique Design**: Obsidian `#080A0F` and Champagne Gold `#D4AF37` visual aesthetics with glassmorphism and fluid micro-animations.
- **Dynamic Tiered Courier Delivery**:
  - Buyer pays standard courier fee.
  - **Orders > Rs. 25,000**: **50% OFF Courier Delivery**.
  - **Orders >= Rs. 50,000**: **100% FREE Courier Delivery**.
  - Real-time animated **Courier Progress Meter** on the cart drawer and checkout.
- **Payment Options**:
  - **Full 100% Payment** (upfront).
  - **Half 50% Advance Payment** (to reserve and initiate packaging; balance upon courier dispatch).
  - **Strictly No Cash on Delivery (COD)** policy enforcement.
- **WhatsApp Screenshot Submission**:
  - Single-click **"Send Payment Screenshot on WhatsApp"** button pre-filling Order Reference ID, Customer Name, and Amount Transferred.
  - Option to upload transfer screenshot directly on the website during checkout or post-order.
- **Live Order Tracking**:
  - Real-time visual status timeline: `[Pending Verification] -> [Payment Confirmed] -> [Packed] -> [Courier on the Way (with Tracking #)] -> [Delivered]`.

### 🔐 Authentication & Password Security
- **Strict Password Reset Flow**:
  - **No "Forgot Password" or "Reset Password" buttons** on the login screen.
  - Prominent notice on login screen:
    > *"if you forgot password email: samiullahnawaz942@gmail.com to get access again or to reset password."*
  - Users can update their password securely inside their account settings after logging in, while `username` / `userId` remains permanently immutable.

### 👑 Admin Management Suite (Desktop & Mobile)
- **Watch Stock Inventory**:
  - Manage prices, discount prices, stock counts, brands, models, movements, case sizes, dial finishes, and water resistance.
- **Multi-Source Image Manager**:
  - **Google / Web Image URLs**: Auto-cleans Google search redirect links with instant live verification.
  - **Device Gallery / Local Storage Upload**: Instant file upload from smartphone or desktop storage.
  - **Preset Luxury Photo Library**: One-click selection from curated high-definition watch photography.
- **Courier & Tax Settings**:
  - Configure base courier prices, GST tax %, 50% off threshold (Rs. 25,000), and free delivery threshold (Rs. 50,000).
- **Store Operations & Showroom**:
  - Live **Showroom Open / Closed toggle** and operating hours display.
  - Physical showroom address in Gulberg III, Lahore with Google Maps integration.
  - Manage official Bank accounts, EasyPaisa, JazzCash, and Raast details.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14/15 (App Router) & React 18
- **Language**: TypeScript
- **ORM & Database**: Prisma ORM with SQLite (Development) / PostgreSQL / Supabase / Neon / Vercel Postgres (Production)
- **Styling**: Custom Vanilla CSS Luxury Design System
- **Authentication**: JWT & bcryptjs password hashing
- **Icons**: Lucide React
- **Deployment**: Vercel Ready

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/webRace-Sami/SM-WatchStore.git
cd SM-WatchStore
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sm_watchstore_secret_token_942_luxury"
NEXT_PUBLIC_APP_NAME="SM WatchStore"
NEXT_PUBLIC_ADMIN_EMAIL="samiullahnawaz942@gmail.com"
NEXT_PUBLIC_DEFAULT_WHATSAPP="+923008942942"
```

### 3. Initialize Database & Seed
```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or configured port) in your browser.

---

## 🔑 Default Credentials

- **Admin Account**:
  - **Username**: `admin`
  - **Password**: `admin123`
- **Customer Demo Account**:
  - **Username**: `customer1`
  - **Password**: `password123`

---

## 📜 Store Policies

- **Strict Return Policy**: *"No material refundable. All timepieces are authentic and verified by certified master watchmakers before dispatch."*
- **No Cash on Delivery**: Advance payment required with WhatsApp screenshot verification.

---

## 📄 Proprietary Rights & Ownership
Private & Proprietary — © 2026 **SM WatchStore**. All software engineering, digital architecture, and intellectual property rights are exclusively reserved to **WebRace Co.**
