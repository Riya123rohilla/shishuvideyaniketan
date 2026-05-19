# GitHub Secret Alert Resolution

## ✅ Security Fixes Applied

All hardcoded API keys have been removed from source code and replaced with environment variables:
- `backend/scripts/initializeAdmin.js` 
- `backend/routes/eventRoutes.js`
- `backend/routes/enquiryRoutes.js`

Sensitive data now only exists in `.env` (which is gitignored).

---

## ⚠️ GitHub Alert Still Showing - Why?

GitHub scans your **entire git history**, not just current files. The exposed key (`AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg`) still exists in commit `eed45ad` from 14 days ago.

---

## 🔐 How to Resolve the Alert

### **Option 1: Rotate the API Key (RECOMMENDED ✅)**

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Select project: `redesign-bbbbf`
   
2. **Navigate to API Credentials**:
   - Go to: **APIs & Services** → **Credentials**
   
3. **Revoke the exposed key**:
   - Find key: `AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg`
   - Click the trash icon to **DELETE** it
   
4. **Create a new API key**:
   - Click **"+ CREATE CREDENTIALS"** → **"API Key"**
   - Copy the new key
   
5. **Update your `.env` file**:
   ```bash
   FIREBASE_API_KEY=YOUR_NEW_API_KEY_HERE
   ```

6. **Close the GitHub alert**:
   - Go to GitHub Security → Secret scanning
   - Click on the alert
   - Click **"Close as..."** → **"Revoked"**
   - Add note: "API key has been rotated"

---

### **Option 2: Clean Git History (Advanced ⚠️)**

**WARNING**: This rewrites history and requires force push. All collaborators must re-clone.

```powershell
# Backup first!
cd "c:\Users\user\Desktop\for vs code\Shishu-Vidya-Niketan"
git clone . ../Shishu-Vidya-Niketan-backup

# Remove sensitive files from ALL history
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch backend/scripts/initializeAdmin.js backend/routes/eventRoutes.js backend/routes/enquiryRoutes.js" `
  --prune-empty --tag-name-filter cat -- --all

# Add files back (now with env vars)
git add backend/scripts/initializeAdmin.js backend/routes/eventRoutes.js backend/routes/enquiryRoutes.js
git commit -m "Security: Use environment variables for Firebase config"

# Force push to GitHub
git push origin main --force

# Clean up refs
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## ✅ Recommended Action Plan

1. **Rotate API key in Google Cloud Console** (5 minutes)
2. **Update `.env` with new key**
3. **Test your app locally** to ensure it still works
4. **Close GitHub alert as "Revoked"**

**DO NOT** commit the new `.env` file - it's already in `.gitignore`.

---

## Current Security Status

✅ No hardcoded secrets in source code  
✅ `.env` file is gitignored  
✅ `.env.example` provided for reference  
⚠️ Old key exposed in git history (needs rotation)  

---

## Questions?

After rotating the key and dismissing the alert, the warning will disappear within 24-48 hours.
