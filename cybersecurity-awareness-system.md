# Cybersecurity Awareness & Threat Detection System
### Student Project Documentation

**Project Type:** Web Application  
**Framework:** Next.js 14  
**Deployment Platform:** Vercel  
**Difficulty Level:** Intermediate  
**Estimated Build Time:** 3 – 5 weeks  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals and Objectives](#2-goals-and-objectives)
3. [System Features](#3-system-features)
4. [System Architecture](#4-system-architecture)
5. [Tech Stack](#5-tech-stack)
6. [External APIs](#6-external-apis)
7. [Application Pages and Structure](#7-application-pages-and-structure)
8. [Step-by-Step Build Guide](#8-step-by-step-build-guide)
9. [Deploying to Vercel](#9-deploying-to-vercel)
10. [Security Considerations](#10-security-considerations)
11. [Testing Your System](#11-testing-your-system)
12. [Potential Improvements](#12-potential-improvements)
13. [Conclusion](#13-conclusion)

---

## 1. Project Overview

This system is a web-based Cybersecurity Awareness and Threat Detection platform designed as a student project. It serves two primary purposes: educating everyday users about common cybersecurity threats, and providing practical tools that allow users to assess whether a URL, password, or email header is potentially dangerous.

The system is built entirely with Next.js, which means both the frontend user interface and the backend API logic live within the same project. It requires no separate server setup, no complex database configuration, and can be deployed to the internet for free using Vercel. The result is a live, publicly accessible application that demonstrates real-world cybersecurity concepts using actual threat intelligence APIs.

---

## 2. Goals and Objectives

**Primary Goals**

- Build a fully functional web application that can be demonstrated live online
- Integrate real threat intelligence APIs to produce genuine, non-simulated results
- Educate users about common cybersecurity threats through interactive content
- Provide practical tools that users can use to check suspicious links, passwords, and emails

**Learning Outcomes**

By completing this project, you will gain hands-on experience with Next.js full-stack development, working with third-party REST APIs, protecting sensitive API keys using server-side routes, deploying a production-ready application to Vercel, and understanding core cybersecurity concepts from a developer's perspective.

---

## 3. System Features

### 3.1 URL and Link Scanner

Users can paste any suspicious URL or link into a form and submit it for analysis. The system sends the URL to an external threat intelligence service (Google Safe Browsing or VirusTotal) and returns a result indicating whether the link is safe, suspicious, or confirmed malicious. Results are displayed clearly with a risk rating and a short explanation of any threats detected.

**Key capabilities:**
- Checks links against Google's global Safe Browsing threat database
- Optionally cross-references with VirusTotal's engine for deeper analysis
- Displays threat categories such as phishing, malware, or unwanted software
- Shows a clear safe or unsafe verdict with color-coded indicators

### 3.2 Password Strength and Breach Checker

Users type a password into the checker tool and instantly receive feedback. The system evaluates the password's length, complexity, and character variety locally in the browser. It also checks whether the password has ever appeared in a known data breach using the Have I Been Pwned API — critically, it does this without ever sending the actual password over the internet, thanks to a technique called k-anonymity.

**Key capabilities:**
- Real-time strength meter showing weak, fair, good, or strong ratings
- Scoring based on length, uppercase, lowercase, numbers, and special characters
- Breach check against billions of known compromised passwords
- Tips displayed to the user on how to improve their password

### 3.3 Email Header Analyzer

Users paste the raw header text from a suspicious email into a text area. The system parses this header entirely within the application — no external API required — and checks for common signs of spoofing or malicious routing. It highlights the sender domain, reply-to address, originating IP address, and email relay path, flagging anything that appears inconsistent or suspicious.

**Key capabilities:**
- Extracts key fields such as From, Reply-To, Received, and Message-ID
- Flags mismatches between the visible sender and the actual originating domain
- Detects unusual relay paths that could indicate spoofing
- Provides a plain-language explanation of each flagged issue

### 3.4 Phishing Awareness Quiz

An interactive multi-question quiz that presents users with scenarios, descriptions, and visual examples of phishing attempts. Users must identify what is suspicious about each example. At the end of the quiz, they receive a score, a performance summary, and detailed explanations of each answer. This is the core educational component and works entirely from static quiz data — no API is needed.

**Key capabilities:**
- Multiple quiz categories covering email phishing, SMS smishing, and fake websites
- Immediate feedback after each answer
- Final score with a pass or fail threshold
- Shareable results for social engagement

### 3.5 Cybersecurity News Feed

The dashboard homepage displays a live feed of the latest cybersecurity news pulled from a news API. This keeps the application feeling dynamic and relevant, and reinforces the educational aspect by exposing users to real-world threat events. News articles are displayed as cards with a title, source, publication date, and a link to the full article.

**Key capabilities:**
- Pulls headlines filtered to cybersecurity and information security topics
- Displays source name, publication time, and article summary
- Links to original articles in a new tab
- Refreshes data on each page load

### 3.6 Threat Awareness Library

A static educational section containing articles and guides on the most common cybersecurity threats. Content is written in plain language for non-technical users. Topics covered include phishing and social engineering, malware and ransomware, man-in-the-middle attacks, password attacks, and public Wi-Fi risks. This section requires no external API and is built from content you write and store as markdown or JSON files.

**Key capabilities:**
- Threat category pages with descriptions and real-world examples
- Prevention tips and recommended actions for each threat type
- Beginner-friendly language with no assumed technical knowledge
- Search or filter by threat category

---

## 4. System Architecture

### 4.1 Overview

The application follows a simple two-layer architecture that lives entirely within the Next.js framework:

**Frontend Layer** — All the pages and user interface components that users interact with. Built with React inside Next.js, styled with Tailwind CSS.

**API Layer** — A set of server-side API routes inside the Next.js project (located in the `/app/api` folder). These routes act as a secure middleman between the user's browser and the external threat intelligence APIs. When a user submits a URL to scan, their browser calls your own API route, which then calls VirusTotal or Google Safe Browsing using your secret API key. The key is never exposed to the browser.

### 4.2 Request Flow

When a user submits a URL for scanning, the flow works as follows: the user fills in the form and clicks scan, the browser sends the URL to your Next.js API route, the API route reads the secret API key from environment variables, constructs a request to the external threat API, receives the result, formats it, and returns it to the browser, and finally the browser displays the formatted result to the user.

### 4.3 Data Storage

For this student project, no database is required. All quiz questions are stored as a local JSON file. Threat awareness articles are stored as markdown files. All real-time threat data is fetched on demand from external APIs. User sessions are not persisted — each visit starts fresh.

### 4.4 Folder Structure

The project follows the standard Next.js App Router structure:

```
/app
  /page.tsx              → Homepage / Dashboard
  /scanner/page.tsx      → URL Scanner page
  /password-check/page.tsx → Password checker page
  /email-analyzer/page.tsx → Email header analyzer page
  /learn/page.tsx        → Threat awareness library
  /quiz/page.tsx         → Phishing quiz page
  /about/page.tsx        → About the project
  /api
    /scan-url/route.ts   → API route for URL scanning
    /news/route.ts       → API route for news feed
    /breach-check/route.ts → API route for password breach check

/data
  /quiz-questions.json   → Quiz data
  /threats.json          → Threat library content

/components              → Reusable UI components
/lib                     → Helper functions and utilities
/public                  → Static assets (images, icons)
```

---

## 5. Tech Stack

| Technology | Purpose | Why It Was Chosen |
|---|---|---|
| Next.js 14 | Full-stack framework | Combines frontend and backend in one project |
| React | UI rendering | Component-based, widely used, easy to learn |
| Tailwind CSS | Styling | Fast to write, professional results, no custom CSS files needed |
| TypeScript | Language | Catches bugs early, improves code quality |
| Vercel | Hosting and deployment | Built for Next.js, free tier, instant GitHub deployments |
| Google Safe Browsing API | URL threat checking | Free, reliable, backed by Google's global threat data |
| VirusTotal API | Deep URL scanning | Free tier available, checks against 70+ engines |
| Have I Been Pwned API | Password breach checking | Free, privacy-respecting k-anonymity model |
| NewsAPI | Cybersecurity news | Free for development, easy to query by topic |

---

## 6. External APIs

### 6.1 Google Safe Browsing API

**What it does:** Checks a URL against Google's constantly updated database of unsafe web resources, including phishing sites, malware distribution sites, and unwanted software pages.

**How to get access:** Create a free Google Cloud account at cloud.google.com, create a new project, enable the Safe Browsing API from the API library, and generate an API key. The free tier allows up to 10,000 requests per day, which is more than sufficient for a student project.

**What you get back:** A response indicating whether the URL is clean or flagged, along with the threat type and platform type if a threat is found.

---

### 6.2 VirusTotal API

**What it does:** Submits a URL to be scanned by over 70 antivirus and security vendors simultaneously and returns a combined verdict.

**How to get access:** Create a free account at virustotal.com and find your API key in your profile settings. The free tier allows 4 requests per minute and 500 requests per day.

**What you get back:** A detailed report showing how many engines flagged the URL, which specific engines flagged it, and what threat categories were detected.

---

### 6.3 Have I Been Pwned (HIBP) API

**What it does:** Checks whether a password appears in any known data breach without ever receiving the actual password. It uses a technique called k-anonymity where only the first 5 characters of the password's SHA-1 hash are sent to the API. The API returns all hashes that begin with those 5 characters, and the check is completed locally.

**How to get access:** The Pwned Passwords endpoint at api.pwnedpasswords.com is free and does not require an API key or account. Simply call it directly.

**What you get back:** A list of hash suffixes and the number of times each appeared in breaches. If your password's hash suffix is in the list, the password has been compromised.

---

### 6.4 NewsAPI

**What it does:** Provides access to a large index of news articles from hundreds of sources. You can query by keyword, category, language, and date range.

**How to get access:** Register for a free account at newsapi.org and copy your API key from the dashboard. The free Developer plan allows 100 requests per day and provides access to articles from the past month.

**What you get back:** A list of articles with title, description, source name, publication date, URL, and image URL.

---

## 7. Application Pages and Structure

### Homepage / Dashboard (`/`)

The main landing page of the application. It includes a brief introduction to the system, a summary of the available tools, and the live cybersecurity news feed. It should immediately communicate what the application does and invite the user to explore the tools.

### URL Scanner (`/scanner`)

A clean, focused page with a text input field where users paste a URL, a scan button, and a results area below. Results should be displayed prominently with a clear safe or unsafe indicator, the threat type if found, and a recommendation.

### Password Checker (`/password-check`)

A page with a password input field (with a show/hide toggle), a real-time strength meter that updates as the user types, and a breach check button that queries the HIBP API. Results should be encouraging for strong passwords and clearly cautionary for weak or breached ones.

### Email Header Analyzer (`/email-analyzer`)

A page with a large text area for pasting email headers, an analyze button, and a structured results section that breaks down the parsed header fields. Flagged fields should be highlighted in a warning color with an explanation.

### Threat Awareness Library (`/learn`)

A browsable collection of threat category cards on the index page. Each card links to a detailed page for that threat type covering what it is, how it works, real-world examples, and how to protect yourself. Content is written in plain language.

### Phishing Quiz (`/quiz`)

A step-by-step quiz interface. One question is shown at a time. After the user selects an answer, feedback is shown immediately before moving to the next question. A progress bar shows how far through the quiz the user is. A results screen is shown at the end with the score and explanations.

### About Page (`/about`)

A brief description of the project, its purpose, the technologies used, and the student or team who built it. This is important for academic submission and for anyone who discovers the live site.

---

## 8. Step-by-Step Build Guide

### Phase 1: Project Setup

**Step 1: Install Prerequisites**

Before starting, ensure you have Node.js version 18 or later installed on your computer. You can download it from nodejs.org. Also install Git from git-scm.com if it is not already installed. You will also need a free GitHub account to connect your project to Vercel.

**Step 2: Create the Next.js Project**

Open your terminal and use the official Next.js creation tool to scaffold a new project. During setup, choose TypeScript as your language, Tailwind CSS for styling, and enable the App Router. Give the project a meaningful name such as `cybersecurity-awareness-system`.

**Step 3: Open the Project in Your Code Editor**

Use VS Code or any code editor of your choice. Open the project folder and explore the structure that was generated. The main application code lives in the `/app` folder.

**Step 4: Create a GitHub Repository**

Go to github.com, create a new repository with the same name as your project, and follow the instructions to push your local project to GitHub. This is required for Vercel deployment later.

**Step 5: Run the Development Server**

In your terminal inside the project folder, run the development server. Open your browser and go to localhost:3000 to confirm the default Next.js welcome page loads.

---

### Phase 2: Project Configuration

**Step 6: Set Up Environment Variables**

Create a file named `.env.local` in the root of your project. This file will store all your secret API keys. Add variables for your Google Safe Browsing API key, VirusTotal API key, and NewsAPI key. Never commit this file to GitHub — Next.js automatically excludes it, but double-check that `.env.local` appears in your `.gitignore` file.

**Step 7: Register for All Required APIs**

Register for accounts and obtain API keys for all four services: Google Safe Browsing, VirusTotal, Have I Been Pwned (no key needed), and NewsAPI. Store each key in your `.env.local` file using the variable names you defined.

**Step 8: Plan Your Component Structure**

Before writing any interface code, plan the reusable components you will need across multiple pages. These will likely include a navigation bar, a page header, a result card component for displaying scan results, a loading spinner, an alert or badge component for risk levels, and a news article card. Creating these as reusable components early will save significant time.

**Step 9: Install Additional Packages**

Install any additional npm packages your project needs. For this project, you may want a library for parsing SHA-1 hashes for the HIBP password check, and optionally a date formatting library for the news feed. Install them using npm in your terminal.

---

### Phase 3: Build the Layout and Navigation

**Step 10: Create the Root Layout**

Edit the root layout file in `/app/layout.tsx`. This file wraps every page in your application. Add your site-wide navigation bar here, including links to all the main pages. Also add a footer with the project name and your details.

**Step 11: Style the Navigation Bar**

Build a responsive navigation bar component using Tailwind CSS. It should include your project name or logo on the left and navigation links on the right. On small screens, the links should collapse into a hamburger menu or a simple stack. Make sure the active link is visually highlighted.

**Step 12: Create the Base Homepage Layout**

Build the homepage structure with a hero section that introduces the system, a tools section with clickable cards linking to each tool, and a placeholder area for the news feed. Do not worry about the news feed data yet — just build the layout and use dummy text for now.

---

### Phase 4: Build the API Routes

Before building any of the frontend tool pages, build the backend API routes first. This way you can test them independently before connecting the UI.

**Step 13: Build the URL Scanner API Route**

Create the file `/app/api/scan-url/route.ts`. This route accepts a POST request containing a URL, reads your Google Safe Browsing API key from the environment variables, constructs a request to the Safe Browsing API, and returns the result to the caller. Test this route using a tool like Postman or Insomnia before connecting it to any UI.

**Step 14: Build the News Feed API Route**

Create `/app/api/news/route.ts`. This route calls the NewsAPI with a cybersecurity keyword query, retrieves the latest articles, and returns a cleaned list of article objects to the caller. Handle errors gracefully — if NewsAPI is unavailable, return an empty array rather than crashing.

**Step 15: Build the Password Breach Check API Route**

Create `/app/api/breach-check/route.ts`. This route accepts a POST request with the first 5 characters of a SHA-1 hash (never the full password or hash), calls the Have I Been Pwned Pwned Passwords range endpoint, and returns the list of matching hash suffixes and breach counts. The actual comparison logic will be handled on the frontend.

---

### Phase 5: Build the Tool Pages

**Step 16: Build the URL Scanner Page**

Create `/app/scanner/page.tsx`. Build a form with a text input for the URL and a submit button. On submission, call your `/api/scan-url` route, show a loading state while waiting, and display the results below the form. Use color-coded badges or alerts to show safe (green), suspicious (yellow), or dangerous (red) results.

**Step 17: Build the Password Checker Page**

Create `/app/password-check/page.tsx`. Build a password input with a show/hide toggle. As the user types, calculate the password strength in real time without any API call — this is purely local JavaScript logic evaluating length, character variety, and complexity. Add a separate check breach button that, when clicked, hashes the password using SHA-1, takes the first 5 characters, sends them to your API route, and checks if the full hash appears in the returned results.

**Step 18: Build the Email Header Analyzer Page**

Create `/app/email-analyzer/page.tsx`. Add a large text area for pasting headers and an analyze button. On click, pass the raw header text to a parsing function in your `/lib` utilities folder. This function uses regular expressions to extract key header fields. Display the parsed results in a structured table, with any suspicious fields highlighted in an amber or red color.

**Step 19: Connect the News Feed to the Homepage**

Return to the homepage and connect the news section to your `/api/news` route. Fetch the news data when the page loads and render it as a grid of article cards. Each card should show the article title, source, publication time, a short description, and a read more link.

---

### Phase 6: Build the Educational Content

**Step 20: Create the Quiz Data File**

In your `/data` folder, create a file named `quiz-questions.json`. Write a minimum of 15 questions covering different phishing scenarios. Each question should include the question text, four possible answer options, the index of the correct answer, and an explanation of why that answer is correct. The explanation is shown to the user after they answer.

**Step 21: Build the Phishing Quiz Page**

Create `/app/quiz/page.tsx`. Load the quiz questions from the JSON file. Use React state to track the current question index, the user's selected answer for each question, and whether feedback is being shown. Build the question display, answer option buttons, the next question flow, and the final results screen. Display the score as both a number and a percentage, and show all explanations on the results screen.

**Step 22: Create the Threat Library Content**

In your `/data` folder, create a file named `threats.json` containing entries for each major threat type you want to cover. Each entry should include a title, an icon name or emoji, a short summary, a full description, a list of warning signs, and a list of prevention tips. Cover at least six threat types: phishing, malware, ransomware, social engineering, man-in-the-middle attacks, and password attacks.

**Step 23: Build the Threat Awareness Library Page**

Create `/app/learn/page.tsx`. Load the threats data and display each threat as a card on the index page. Each card should link to a dynamic route such as `/learn/phishing`. Create a dynamic page at `/app/learn/[slug]/page.tsx` that loads the relevant threat entry by its identifier and displays the full content.

---

### Phase 7: Polish and Finalize

**Step 24: Add Loading and Error States**

Go through every page that makes an API call and ensure it handles three states properly: a loading state while the request is in progress (show a spinner or skeleton), a success state when data is returned (show the results), and an error state if the request fails (show a user-friendly error message and a retry option).

**Step 25: Make the Application Responsive**

Review every page on a mobile screen size using your browser's developer tools. Adjust Tailwind CSS classes so that the layout looks clean and usable on screens as small as 375px wide. Pay particular attention to the navigation bar, forms, and result cards.

**Step 26: Write the About Page**

Create `/app/about/page.tsx`. Write a clear description of the project including its purpose, the features it offers, the technologies used, the APIs integrated, and information about yourself or your team. This page is important for academic context and for anyone who visits the live site.

**Step 27: Final Review and Cleanup**

Read through your entire codebase and remove any unused imports, commented-out code, or console.log statements that were used for debugging. Ensure all pages have proper page titles using Next.js metadata. Check that all internal links work correctly. Test all four tool pages with real inputs.

---

## 9. Deploying to Vercel

**Step 28: Push All Changes to GitHub**

Ensure all your latest code is committed and pushed to your GitHub repository. Check that your `.env.local` file is listed in `.gitignore` and has NOT been pushed — your API keys must never appear in your GitHub repository.

**Step 29: Create a Vercel Account**

Go to vercel.com and sign up for a free Hobby account. The easiest way is to sign up using your GitHub account, which automatically links the two services.

**Step 30: Import Your Project**

From the Vercel dashboard, click New Project and select your GitHub repository from the list. Vercel will automatically detect that it is a Next.js project and configure the build settings for you. Do not change the default build settings.

**Step 31: Add Environment Variables**

Before clicking Deploy, expand the Environment Variables section. Add each of your API keys here — use the exact same variable names as in your `.env.local` file. This is how Vercel securely provides your keys to the application without them being in your code.

**Step 32: Deploy**

Click Deploy. Vercel will build your application and publish it to a public URL in the format `your-project-name.vercel.app`. The first deployment typically takes one to three minutes. Once complete, open the URL in your browser and test every feature on the live site.

**Step 33: Set Up Automatic Deployments**

Going forward, every time you push new code to your GitHub repository's main branch, Vercel will automatically rebuild and redeploy your application. This means your live site always stays up to date with no manual steps.

---

## 10. Security Considerations

**Protecting API Keys**

Never write API keys directly in your source code. Always use environment variables. In development, use `.env.local`. In production on Vercel, use the Environment Variables section in the project settings. This ensures keys are never exposed in your GitHub repository or in the browser.

**Server-Side API Calls**

All calls to external APIs that require your secret keys must be made from Next.js API routes (server-side), never from the browser-side React components. The browser should only ever call your own API routes at paths like `/api/scan-url`.

**Input Sanitization**

Before passing any user input to an external API, validate and sanitize it. For the URL scanner, confirm that the input is a valid URL format before sending it to Google Safe Browsing. For the email header analyzer, limit the size of the input to prevent excessively large payloads.

**Rate Limiting Awareness**

Be aware of the rate limits on free API tiers. VirusTotal allows 4 requests per minute on its free plan. If your application is being heavily used in a demo, you may hit this limit. Consider caching results for a short period or adding a cooldown on the scan button to prevent rapid repeated submissions.

**HTTPS**

Vercel automatically provisions and renews SSL certificates for all deployed projects, so your live site will always be served over HTTPS. No additional configuration is needed.

---

## 11. Testing Your System

### Manual Testing Checklist

Before submitting or presenting the project, test every feature using the following inputs:

**URL Scanner**
- Submit a known safe URL such as https://google.com and confirm it returns a safe result
- Submit the test URL https://testsafebrowsing.appspot.com/s/phishing.html which Google provides for testing Safe Browsing integrations, and confirm it returns a threat warning
- Submit an invalid input such as plain text with no URL format and confirm the form shows a validation error

**Password Checker**
- Type a very short simple password like `abc` and confirm the strength meter shows weak
- Type a complex password with mixed characters and confirm the meter shows strong
- Type a commonly known password like `password123` and confirm the breach check reports it as compromised

**Email Header Analyzer**
- Copy a raw email header from your own email client and paste it in — confirm the parser extracts the correct sender and relay information
- Manually construct a header with a mismatched From and Reply-To address and confirm it is flagged

**Phishing Quiz**
- Complete the full quiz and confirm the score is calculated correctly
- Deliberately answer all questions incorrectly and confirm the explanations are shown

**News Feed**
- Load the homepage and confirm news articles appear with titles, sources, and links
- Click a read more link and confirm it opens the correct external article

---

## 12. Potential Improvements

Once the core system is working, consider these enhancements to make the project even more impressive:

**File Scanner** — Extend the URL scanner to accept file uploads and submit them to VirusTotal's file scanning endpoint for malware detection.

**User Accounts and History** — Add authentication using NextAuth.js and a simple database like PlanetScale or Supabase to let users save their scan history and quiz scores.

**Dark Mode** — Add a light and dark mode toggle using Tailwind's dark mode support. This improves usability and is a visible polish feature.

**Threat Alerts by Category** — Allow users to filter the news feed by threat category such as ransomware, phishing, or data breaches.

**Bulk URL Scanning** — Allow users to paste a list of multiple URLs and scan them all in sequence, returning a combined report.

**Certificate Checker** — Add a tool that checks whether a website's SSL certificate is valid, not expired, and matches the domain — a simple but useful security check.

**IP Address Reputation Checker** — Use the AbuseIPDB free API to let users check whether an IP address has been reported for malicious activity.

---

## 13. Conclusion

This Cybersecurity Awareness and Threat Detection System is a strong student project that goes beyond a typical CRUD application. By integrating real threat intelligence APIs, you are building something that produces genuine, useful results — not simulated data. The Next.js and Vercel combination makes it fast to build and trivial to deploy, and the free API tiers mean the entire project can be completed at zero cost.

The system covers both theoretical education (threat library, quiz) and practical tools (URL scanner, password checker, email analyzer), giving it depth and making it a compelling demonstration of applied cybersecurity knowledge.

By following this guide phase by phase, you will have a live, working, publicly accessible application at the end — something you can share a link to, present in a demo, and include in a portfolio.

---

*Documentation prepared for student academic use. All external APIs referenced are subject to their own terms of service and free tier limits.*
