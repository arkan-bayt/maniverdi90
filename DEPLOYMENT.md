# 🚀 دليل نشر تطبيق نظام إدارة ماني فيردي

## 📂 مسارات التطبيق:

### 1. **مجلد التطبيق المبني (جاهز للنشر):**
```
/home/arkan/Desktop/mani verdi/client/build/
```

### 2. **الملف المضغوط (للنشر السريع):**
```
/home/arkan/Desktop/mani verdi/client/maniverdi-app.tar.gz
```

## 🌐 خيارات النشر:

### أ) نشر على استضافة مواقع عادية:

1. **حمّل محتويات مجلد `build/` إلى الخادم**
2. **الملفات المطلوبة:**
   - `index.html` (الملف الرئيسي)
   - `static/` (مجلد الملفات الثابتة)
   - `manifest.json`
   - `asset-manifest.json`

### ب) نشر على Netlify:

1. اذهب إلى [netlify.com](https://www.netlify.com)
2. اسحب مجلد `build/` إلى الموقع
3. أو حمّل الملف المضغوط `maniverdi-app.tar.gz`

### ج) نشر على Vercel:

#### الطريقة الأولى - من GitHub (الأفضل):
1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر "New Project" 
3. اتصل بـ GitHub واختر repository: `arkan-bayt/maniverdi90`
4. Vercel سيستخدم `vercel.json` تلقائياً ✅

#### الطريقة الثانية - المجلد المنفصل:
1. استخدم المجلد: `/home/arkan/Desktop/maniverdi-deploy/`
2. أو الملف المضغوط: `/home/arkan/Desktop/maniverdi-vercel-ready.tar.gz`
3. حمّل المجلد مباشرة إلى Vercel

#### إصلاح خطأ react-scripts:
إذا واجهت خطأ `react-scripts: command not found`:
- تأكد من أن Vercel يقرأ `vercel.json` 
- أو استخدم المجلد المنفصل `maniverdi-deploy`

### د) نشر على Firebase Hosting:

```bash
cd "/home/arkan/Desktop/mani verdi/client"
npm install -g firebase-tools
firebase login
firebase init hosting
# اختر build كمجلد عام
firebase deploy
```

## ⚙️ معلومات التطبيق:

### 🔐 بيانات تسجيل الدخول:
- **مدير:** `admin` / `admin` (جميع الصلاحيات)
- **مشرف:** `iraq` / `iraq` (إدارة مستخدمين + كل الميزات)
- **مستخدم:** `mani` / `mani` (صلاحيات أساسية)

### 🌍 اللغات المدعومة:
- العربية (الافتراضية)
- الإنجليزية  
- الإيطالية

### 💾 تخزين البيانات:
- البيانات تُحفظ في localStorage للمتصفح
- لا يحتاج خادم قاعدة بيانات

## 🔧 متطلبات الاستضافة:

- ✅ دعم HTML/CSS/JavaScript
- ✅ دعم Single Page Applications (اختياري)
- ❌ لا يحتاج PHP أو قواعد بيانات
- ❌ لا يحتاج Node.js في الإنتاج

## 📝 ملاحظات مهمة:

1. **للاستضافة مع دومين فرعي:** قم بتعديل `homepage` في `package.json`
2. **للاستضافة مع دومين مخصص:** اتركه كما هو
3. **التطبيق يعمل بدون إنترنت** بعد التحميل الأول

## 🎯 اختبار التطبيق محلياً:

```bash
cd "/home/arkan/Desktop/mani verdi/client/build"
python3 -m http.server 8080
# أو
npx serve -s . -l 8080
```

ثم افتح: http://localhost:8080

---

## 🚨 المشكلة الحالية مع GitHub Pages:

GitHub Pages لا يدعم routing للـ React Apps بشكل مثالي. لحل هذا:

1. **استخدم استضافة أخرى** مثل Netlify أو Vercel
2. **أو استخدم HashRouter بدلاً من BrowserRouter**

---

*جميع الملفات جاهزة في المسارات المذكورة أعلاه* ✅