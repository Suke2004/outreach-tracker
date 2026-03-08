# ColdMail CRM - Internship Outreach Manager

A complete mini CRM designed for tracking cold emails, managing follow-ups, and monitoring internship outreach responses. The project operates primarily around helping users systematize their internship search processes efficiently.

## Features

- **Dashboard:** Offers a high-level overview of outreach statistics, including response rates and upcoming follow-ups.
- **Contacts Management:** Keep a structured list of all the technical recruiters, hiring managers, and engineers you have contacted.
- **Follow-ups Tracker:** Easily view and manage which contacts require a follow-up and when.
- **Email Templates:** Store and reuse successful cold email templates to streamline your initial outreach and follow-ups.
- **Analytics:** Visualize metrics on your outreach effectiveness (e.g., open rates, reply rates, interview conversions).
- **Pipeline View:** A Kanban-style board to track the status of different companies and opportunities in your funnel.

## Tech Stack

This project is built with modern web technologies to ensure a fast, responsive, and maintainable application:

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **TypeScript:** For type safety and better developer experience
- **Styling:** Tailwind CSS with modern design elements using Shadcn UI
- **Routing:** React Router DOM (v6)
- **State Management & Data Fetching:** TanStack React Query
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. We recommend using `npm` or `pnpm` as your package manager.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd outreach-tracker
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   *Alternatively, if using pnpm:*
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory based on the `.env.example` structure, and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Open your browser and navigate to `http://localhost:5173`.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Starts the local development server using Vite.
- `npm run build`: Bundles the application for production inside the `dist` folder.
- `npm run lint`: Runs ESLint to find and fix any problems in the code.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs the Vitest test suite.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
