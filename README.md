# Smart Bookmark App

A real-time bookmark manager built using **Next.js, Supabase, and Tailwind CSS**.

## 🌐 Live Demo
https://smart-bookmark-vercel.vercel.app

## 💻 GitHub Repo
https://github.com/ManojCCCC/smart-bookmark

---

## ✨ Features

- 🔐 Google OAuth Login (Supabase Auth)
- ➕ Add bookmarks (Title + URL)
- 🔒 Private bookmarks per user (Row Level Security)
- ❌ Delete bookmarks
- ⚡ Real-time updates across tabs (Supabase Realtime)
- 🚀 Deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** Supabase (Auth + PostgreSQL + Realtime)  
- **Deployment:** Vercel  

---

## 🗄 Database Schema

**Table: bookmarks**

| Column      | Type       | Description |
|------------|-----------|-------------|
| id         | uuid (PK) | Unique bookmark ID |
| user_id    | uuid      | References authenticated user |
| title      | text      | Bookmark title |
| url        | text      | Bookmark link |
| created_at | timestamp | Created time |

---

## 🚧 Challenges Faced & Solutions

### 1. Google OAuth configuration issues
**Problem:** Google login failed due to incorrect redirect URLs between Supabase, Google Cloud, and Vercel.  
**Solution:** Added correct Site URL and Redirect URLs in Supabase and Google Cloud Console.

---

### 2. Supabase environment variables error on Vercel
**Problem:** Deployment failed with `supabaseUrl is required`.  
**Solution:** Added environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel and redeployed.

---

### 3. Realtime not updating initially
**Problem:** Realtime updates were not working across tabs.  
**Solution:** Enabled Realtime for the bookmarks table and subscribed to database changes using Supabase Realtime.

---

### 4. Handling user session after deployment
**Problem:** Google login worked locally but failed on the live site due to missing Site URL configuration.  
**Solution:** Added the Vercel domain in Supabase → Authentication → URL Configuration and updated Redirect URLs.

---

### 5. Ensuring bookmarks are private per user
**Problem:** All bookmarks were visible initially because Row Level Security (RLS) was not configured.  
**Solution:** Enabled RLS and created a policy allowing access only when:


--------------------------------------------------------------------------------------------


---

## 🔐 Security

Row Level Security (RLS) ensures each user can only access their own bookmarks.

---


---

## ▶️ Run Locally

```bash
npm install
npm run dev
