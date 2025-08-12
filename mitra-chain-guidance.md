Of course. I've updated the architecture guide to include a new section detailing the specific pages and the overall user flow for the MitraChain platform.

Here is the complete, updated guidance.

***

# MitraChain: Feature & Data Architecture

This document outlines the core features, user roles, data architecture, and page structure for **MitraChain**, a Web3 marketplace connecting franchise owners with prospective business partners on the Internet Computer.

---

## 1. 🏛️ Core Vision & Architecture

MitraChain's vision is to create a transparent, efficient, and user-owned platform for the franchise industry. It will empower both franchisors to expand their network and entrepreneurs to find and launch their ideal business.

The platform will run entirely on the Internet Computer (ICP), with a **Motoko** backend for logic and data, a **React** frontend for the user interface, and multi-wallet support for secure, decentralized authentication and asset management. Governance will eventually be handed over to the community via an **SNS DAO**.

---

## 2. 👥 User Roles

The platform is designed for three primary roles:

1.  **Franchisor (The Business Owner):** An entity or individual who owns a franchise brand and wants to find partners to open new locations. Their goal is to showcase their brand and manage applications from potential franchisees.
2.  **Franchisee (The Investor/Operator):** An entrepreneur or investor looking for business opportunities. Their goal is to discover, research, and apply for franchises that match their interests and budget.
3.  **Platform DAO (The Community):** Initially the admin, but eventually the community of token holders who will govern the platform, vote on new features, and manage platform-wide parameters like listing fees.

---

## 3. ✨ Feature Breakdown

Here are the key features organized by user journey and platform function.

### a. Marketplace & Discovery Features

* **Franchise Listings:** Franchisors can create, edit, and publish detailed listings for their business opportunities.
* **Rich Franchise Profiles:** Each franchise has a dedicated page with a detailed description, history, mission, financial details, and support information.
* **Advanced Search & Filtering:** Franchisees can search for opportunities using filters like industry, investment level, location, and keywords.
* **User Reviews & Ratings:** Verified franchisees can leave reviews on their experience with a franchisor, building a transparent reputation system on-chain.
* **Favorites/Watchlist:** Users can save franchises they are interested in to a personal dashboard.

### b. User Dashboards & Management

* **Franchisor Dashboard:** View and manage listings, track applications, communicate with applicants, and issue `FranchiseLicenseNFT`s.
* **Franchisee Dashboard:** View saved franchises, manage submitted applications, and view owned `FranchiseLicenseNFT`s.

### c. Communication & Application

* **Secure On-Chain Messaging:** A built-in, secure messaging system for direct communication between interested franchisees and franchisors.
* **Standardized Application Process:** A guided, multi-step application form for franchisees.

### d. Web3 & DAO Features

* **Multi-Wallet Integration:** Users connect using their preferred ICP wallet (e.g., Internet Identity, NFID, Plug Wallet) for authentication and asset management.
* **NFT-Based Franchise Licenses (ICRC-7):** Successful agreements result in the minting of an ICRC-7 compliant NFT to the franchisee's wallet, serving as verifiable proof of ownership.
* **DAO Governance:** Token holders can create and vote on proposals to govern the platform.

---

## 4. 📄 Pages & User Flow

This section outlines the sitemap and structure of the MitraChain dApp.

### a. Public Pages (No Login Required)

1.  **Landing Page (`/`)**: This is the main entry point. It will feature:
    * A compelling headline and value proposition.
    * A prominent search bar.
    * Featured franchise categories (e.g., "Trending in F&B," "Low Investment").
    * Testimonials from successful partners.
    * A clear "Connect Wallet" call-to-action in the navigation bar.
2.  **Browse Franchises (`/franchises`)**: The core marketplace page.
    * A grid or list view of all active franchise listings.
    * Advanced filtering and sorting options on the sidebar.
3.  **Franchise Details Page (`/franchise/:id`)**: A dynamic page for each individual franchise.
    * Displays all information from the `Franchise` data model.
    * Includes a photo/video gallery, detailed description, financial data, and user reviews.
    * A call-to-action to "Apply Now" or "Contact Franchisor."
4.  **How It Works (`/how-it-works`)**: Explains the process for both franchisors and franchisees.
5.  **About Us (`/about`)**: Shares the mission and vision of MitraChain.

### b. Authentication & Registration Flow

1.  **Connect Wallet (Login)**: Instead of a traditional login, users click "Connect Wallet." A modal will appear allowing them to choose their preferred wallet (Internet Identity, NFID, etc.). This action authenticates them to the dApp.
2.  **User Profile Setup (Registration)**: After connecting for the first time, the user is redirected to a one-time setup page (`/profile-setup`). Here, they will fill in the details for their `UserProfile` (name, email, role selection).

### c. Authenticated Pages (Wallet Connected)

1.  **Dashboard (`/dashboard`)**: The main hub for a logged-in user. It will have tabs for different functions.
    * **For Franchisees:** Shows their favorited listings, active applications, and owned `FranchiseLicenseNFT`s.
    * **For Franchisors:** Shows their created listings, incoming applications, and tools to manage them.
2.  **Create/Edit Franchise Listing (`/dashboard/create-listing`)**: A form for franchisors to add a new franchise opportunity or edit an existing one.
3.  **Application Form (`/franchise/:id/apply`)**: The guided form a franchisee fills out to apply for a specific franchise.
4.  **Settings (`/settings`)**: Allows users to update their `UserProfile` information.

---

## 5. 🗄️ Data Schema Architecture

This section defines the core data structures (types) that will be used in the Motoko backend.

### `UserProfile`

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `principal` | `Principal` | The user's unique wallet Principal. **(Primary Key)** |
| `name` | `Text` | The user's full name. |
| `email` | `Text` | Contact email address. |
| `bio` | `Text` | A short biography or company description. |
| `role` | `Variant { franchisor; franchisee }` | Defines the user's primary role. |
| `createdAt` | `Nat` | Timestamp of when the profile was created. |

### `Franchise`

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `Nat` | A unique identifier for the franchise. **(Primary Key)** |
| `owner` | `Principal` | The `Principal` of the `UserProfile` who owns this listing. |
| `name` | `Text` | The name of the franchise brand. |
| `category` | `Text` | Industry category (e.g., "F&B", "Retail"). |
| `description` | `Text` | A detailed description of the business. |
| `investmentRange` | `Record { min: Nat; max: Nat }` | The estimated range for initial investment. |
| `royaltyFee` | `Float` | The percentage of revenue paid as a royalty. |
| `gallery` | `[Text]` | An array of URLs to images/videos. |
| `isActive` | `Bool` | Whether the listing is currently active and visible. |
| `createdAt` | `Nat` | Timestamp of when the listing was created. |

### `Application`

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `Nat` | A unique identifier for the application. **(Primary Key)** |
| `franchiseId` | `Nat` | The ID of the `Franchise` being applied for. |
| `applicantPrincipal` | `Principal` | The `Principal` of the franchisee who is applying. |
| `status` | `Variant { submitted; inReview; approved; rejected }`| The current status of the application. |
| `coverLetter` | `Text` | A message from the applicant to the franchisor. |
| `submittedAt` | `Nat` | Timestamp of when the application was submitted. |

### `FranchiseLicenseNFT` (ICRC-7)

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `nftId` | `Nat` | The unique ID of the NFT within the collection. **(Primary Key)** |
| `franchiseId`| `Nat` | Links back to the `Franchise` this license is for. |
| `name` | `Text` | ICRC-7: The name of the NFT (e.g., "MitraChain License #123"). |
| `description`| `Text` | ICRC-7: Description of the license. |
| `image` | `Text` | ICRC-7: URL to the visual representation of the license. |
| `attributes`| `[Record { trait_type: Text; value: Text }]` | ICRC-7: Custom attributes (e.g., "Location", "Issue Date"). |
| `issuedAt` | `Nat` | Timestamp of when the license was minted. |