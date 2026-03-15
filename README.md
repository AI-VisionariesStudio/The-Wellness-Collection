# Co-Parenting Academy Platform
### Court-Approved Online Course Platform

---

## 🚀 Getting Started on Windows

### Step 1: Install Prerequisites

**Docker Desktop for Windows**
→ Download from: https://www.docker.com/products/docker-desktop/
→ During install: enable WSL 2 integration
→ After install: start Docker Desktop and wait for it to fully load (whale icon in taskbar)

**Node.js (for running commands)**
→ Download LTS version from: https://nodejs.org
→ This installs Node + npm

---

### Step 2: Set Up Your Project

Open **PowerShell** or **Windows Terminal** and run:

```powershell
# Navigate to where you want the project
cd C:\Users\YourName\Documents

# The project folder is already created. Enter it:
cd coparent-platform

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

---

### Step 3: Configure Environment

1. Open `.env.local` in Notepad or VS Code
2. Replace `NEXTAUTH_SECRET` with a random string:
   - Open PowerShell and run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Copy the output into `.env.local`
3. Add your Stripe test keys (get from stripe.com → Developers → API Keys)

---

### Step 4: Start the Platform

```powershell
# Start database + app with one command
docker-compose up -d

# Wait ~30 seconds for containers to start, then run:
npm run db:push      # Create database tables
npm run db:seed      # Add sample course + admin account
```

→ Open http://localhost:3000 in your browser

**Default Accounts:**
- Admin: `admin@yourplatform.com` / `Admin123!`
- Demo Student: `demo@student.com` / `Student123!`

---

### Step 5: Add Your Videos

Drop your video files (MP4 format recommended) into:
```
coparent-platform/
  public/
    uploads/
      videos/
        lesson-1.mp4
        lesson-2.mp4
        ...
```

Then update video paths in the admin panel or database.

---

## 📁 Project Structure

```
coparent-platform/
├── app/
│   ├── page.tsx              ← Landing page (customize this)
│   ├── dashboard/            ← Student dashboard
│   ├── admin/                ← Admin panel
│   ├── login/                ← Login page
│   ├── register/             ← Registration
│   ├── verify/               ← Certificate verification (for courts)
│   └── api/
│       ├── auth/             ← Authentication
│       ├── progress/         ← Lesson progress tracking
│       └── certificate/      ← Certificate generation & verification
├── prisma/
│   ├── schema.prisma         ← Database structure
│   └── seed.js               ← Sample data
├── docker-compose.yml        ← Database setup
└── .env.local                ← Configuration (never commit this)
```

---

## 🔧 Useful Commands

```powershell
# Start everything
docker-compose up -d && npm run dev

# Stop everything
docker-compose down

# View database visually
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset && npm run db:seed

# View logs
docker-compose logs -f
```

---

## ☁️ When You're Ready for AWS/GCP

This platform is built to deploy with minimal changes:

**AWS (Recommended path):**
1. AWS RDS (PostgreSQL) → replace DATABASE_URL
2. AWS S3 → upload videos there, update video URLs
3. AWS EC2 or ECS → deploy the Next.js app
4. Route 53 → point your domain

**GCP (Alternative):**
1. Cloud SQL (PostgreSQL)
2. Cloud Storage → videos
3. Cloud Run → serverless deployment (scales to zero = cheapest)

Estimated cloud cost: $30–80/month for low-moderate traffic.

---

## 🎓 Certificate Verification

Courts and attorneys can verify certificates at:
`http://yoursite.com/verify`

No login required. Just enter the serial number from the certificate.

---

## 📞 Customizing Platform Name

Search the codebase for "Co-Parenting Academy" and replace with your name.
Or better: set `NEXT_PUBLIC_PLATFORM_NAME` in `.env.local`

---

## ❓ Common Issues

**"Cannot connect to Docker daemon"**
→ Make sure Docker Desktop is running (check taskbar)

**"Port 3000 is already in use"**
→ Something else is using port 3000. Run: `npx kill-port 3000`

**"Prisma client not generated"**
→ Run: `npx prisma generate`

**Database won't start**
→ Run: `docker-compose down -v` then `docker-compose up -d` (this clears data)
