# Eaglenet - Logistics Management System

Eaglenet is a comprehensive logistics and shipment management web application designed to streamline operations for customers, administrators, and super administrators. It provides a seamless platform for booking shipments, tracking packages, managing orders, and generating reports.

## 🚀 Features

### 🌍 Public Interface
- **Home**: Overview of services and value proposition.
- **Services**: Detailed breakdown of logistics solutions.
- **Tracking**: Real-time package tracking for anyone with a tracking ID.
- **Quote**: Instant shipping quote calculator.
- **Contact**: Support and inquiry forms.

### 👤 User Dashboard
- **Overview**: Personal dashboard showing active shipments and recent activity.
- **Book Shipment**: Easy-to-use form for creating new shipment requests.
- **My Shipments**: List of all personal shipments with status updates.
- **Payments**: Transaction history and payment status.

### 🛡️ Admin Dashboard
- **Overview**: High-level metrics (Total Users, Bookings, Revenue).
- **Order Management**: View, update, and manage all customer orders.
- **User Management**: View and manage registered users.
- **Reports**: Generate and export detailed business reports.
- **Payments**: Monitor all financial transactions.
- **Notifications**: System-wide alerts and updates.

### ⚡ Tech Stack

**Frontend:**
- **React**: UI library for building dynamic interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Fast build tool and development server.
- **Lucide React**: Beautiful, consistent icons.
- **Recharts**: Data visualization for dashboards.
- **Framer Motion**: Smooth animations and transitions.

**Backend (Inferred):**
- **PHP**: Server-side logic (API endpoints).
- **MySQL**: Database for storing users, shipments, and orders.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/eaglenet.git
    cd eaglenet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 🔄 Project Flow

1.  **User Registration**: Customers sign up to access the platform.
2.  **Booking**: Users request a quote and book a shipment.
3.  **Processing**: Admins receive the order, verify details, and update status (Pending -> In Transit).
4.  **Tracking**: Users track their package in real-time using the tracking ID.
5.  **Delivery**: Admins mark the shipment as "Delivered" upon completion.
6.  **Reporting**: Admins generate reports to analyze business performance.

## 🎨 Design System

The application follows a professional **Black/White/Gray** color scheme to convey reliability and sophistication.
- **Primary**: Gray-900 (Dark Gray/Black)
- **Secondary**: Gray-500 (Medium Gray)
- **Backgrounds**: Gray-50/White
- **Accents**: Semantic colors (Green for success, Yellow for pending, Red for failed) are used sparingly for status indicators.

## 📱 Responsiveness

Eaglenet is fully responsive, ensuring a seamless experience across:
- **Desktop**: Full-featured dashboards with detailed tables.
- **Tablet**: Adaptive layouts with optimized columns.
- **Mobile**: Stacked views, hidden non-essential columns, and touch-friendly interfaces.
