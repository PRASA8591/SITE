import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDijkYp6_KD3B3UXfNs59LgTUeaKOFDZ7s",
  authDomain: "prasatek-8a823.firebaseapp.com",
  projectId: "prasatek-8a823",
  storageBucket: "prasatek-8a823.firebasestorage.app",
  messagingSenderId: "1057332753842",
  appId: "1:1057332753842:web:ecb1ec9728e6dc9c59e0ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- TRANSLATION SYSTEM ---
const translations = {
  en: {
    navServices: "Services",
    navProducts: "Products",
    navReviews: "Reviews",
    navContact: "Contact",
    langBtn: "සිංහල",
    heroTitle: "Your Trusted Technology Partner",
    heroDesc: "Professional Repairs & Custom PC Solutions tailored to your needs.",
    heroBtn: "Explore Our Services",
    srvTitle: "Our Services",
    srvSubtitle: "High-quality tech solutions for every individual and business.",
    prdTitle: "Featured Products",
    prdSubtitle: "Get the best components and hardware at competitive prices.",
    contactTitle: "Get in Touch",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelAddress: "Our Location",
    inquiryTitle: "Quick Inquiry",
    placeholderName: "Your Name",
    placeholderInquiry: "How can we help?",
    btnWA: "Chat on WhatsApp",
    revTitle: "What Clients Say",
    revSubtitle: "Real feedback from our valued customers.",
    addRev: "Write a Review",
    btnReview: "Submit Review",
    rights: "All Rights Reserved.",
    toastFill: "Please fill all fields",
    searchPlaceholder: "Search products...",
    statsHappy: "Happy Clients",
    statsRepairs: "Repairs Done",
    statsExperience: "Years Experience"
  },
  si: {
    navServices: "සේවාවන්",
    navProducts: "නිෂ්පාදන",
    navReviews: "පාරිභෝගික අදහස්",
    navContact: "සම්බන්ධ වන්න",
    langBtn: "English",
    heroTitle: "ඔබේ විශ්වාසවන්ත තාක්ෂණික සහකරු",
    heroDesc: "ප්‍රමුඛ පෙළේ අලුත්වැඩියාවන් සහ පාරිභෝගික අවශ්‍යතාවන්ට සරිලන පරිගණක විසඳුම්.",
    heroBtn: "අපගේ සේවාවන් බලන්න",
    srvTitle: "අපගේ සේවාවන්",
    srvSubtitle: "සෑම පුද්ගලයෙකුටම සහ ව්‍යාපාරයකටම උසස් තත්ත්වයේ තාක්ෂණික විසඳුම්.",
    prdTitle: "විශේෂිත නිෂ්පාදන",
    prdSubtitle: "හොඳම උපාංග සහ දෘඩාංග තරඟකාරී මිල ගණන් යටතේ ලබා ගන්න.",
    contactTitle: "සම්බන්ධ වන්න",
    labelPhone: "දුරකථන අංකය",
    labelEmail: "විද්‍යුත් තැපෑල",
    labelAddress: "අපගේ ලිපිනය",
    inquiryTitle: "ඉක්මන් විමසුම",
    placeholderName: "ඔබේ නම",
    placeholderInquiry: "අපෙන් ඔබට විය යුතු සේවාව කුමක්ද?",
    btnWA: "WhatsApp හරහා විමසන්න",
    revTitle: "පාරිභෝගික අදහස්",
    revSubtitle: "අපගේ හිතවත් පාරිභෝගිකයින්ගෙන් සැබෑ ප්‍රතිචාර.",
    addRev: "අදහසක් එකතු කරන්න",
    btnReview: "අදහස යොමු කරන්න",
    rights: "සියලුම හිමිකම් ඇවිරිණි.",
    toastReview: "ඔබගේ අදහසට ස්තූතියි! එය යොමු කරන ලදි.",
    toastLang: "සිංහල භාෂාව තෝරා ගන්නා ලදි",
    toastFill: "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න",
    searchPlaceholder: "නිෂ්පාදන සොයන්න...",
    statsHappy: "සතුටුදායක පාරිභෝගිකයින්",
    statsRepairs: "අළුත්වැඩියාවන්",
    statsExperience: "වසරක අත්දැකීම්"
  }
};

let currentLang = localStorage.getItem("lang") || "en";
let shopPhone = "94771234567";

// --- CORE FUNCTIONS ---
const showToast = (msg) => {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
};

const updateUI = () => {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[currentLang][key];
      } else {
        el.innerText = translations[currentLang][key];
      }
    }
  });
  document.getElementById("langBtn").innerText = translations[currentLang].langBtn;
  document.documentElement.lang = currentLang;
  loadContent(); // Reload dynamic content for language specific fields
};

window.toggleLang = () => {
  currentLang = currentLang === "en" ? "si" : "en";
  localStorage.setItem("lang", currentLang);
  updateUI();
  showToast(translations[currentLang].toastLang);
};

// --- DATA LOADING ---
async function loadContent() {
  // Services
  try {
    const sSnap = await getDocs(collection(db, "services"));
    let sHtml = "";
    sSnap.forEach(doc => {
      const d = doc.data();
      const name = currentLang === 'si' && d.name_si ? d.name_si : d.name;
      const desc = currentLang === 'si' && d.desc_si ? d.desc_si : d.desc;
      sHtml += `
        <div class="glass-card card">
          <i class="${d.icon || 'fa-solid fa-microchip'}"></i>
          <h3>${name}</h3>
          <p>${desc}</p>
        </div>`;
    });
    document.getElementById("servicesList").innerHTML = sHtml || "<p>Coming soon...</p>";
  } catch (e) { console.error("Error loading services", e); }

  // Products
  try {
    const q = query(collection(db, "products"), limit(12)); // Limit for speed
    const pSnap = await getDocs(q);
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    pSnap.forEach(doc => {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "glass-card card product-item";
      card.setAttribute("data-name", d.name.toLowerCase());
      card.innerHTML = `
        <div style="height: 150px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
             <i class="fa-solid fa-laptop" style="font-size: 3rem; opacity: 0.5;"></i>
        </div>
        <h3>${d.name}</h3>
        <p style="color: var(--primary); font-weight: 700; font-size: 1.2rem; margin-top: 10px;">
          ${d.price ? 'Rs. ' + parseInt(d.price).toLocaleString() : 'Call for Price'}
        </p>`;
      productsList.appendChild(card);
    });
    if (pSnap.empty) productsList.innerHTML = "<p>Stock updates coming soon!</p>";
  } catch (e) { console.error("Error loading products", e); }

  // Reviews
  try {
    const q = query(collection(db, "reviews"), where("approved", "==", true));
    const rSnap = await getDocs(q);
    let rHtml = "";
    rSnap.forEach(doc => {
      const d = doc.data();
      rHtml += `
        <div class="glass-card review-card" style="font-style: italic;">
          <div style="color: #f1c40f; margin-bottom: 12px; font-size: 0.8rem;">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <p>"${d.message}"</p>
          <b style="display: block; margin-top: 15px;">- ${d.name}</b>
        </div>`;
    });
    document.getElementById("reviewsList").innerHTML = rHtml || "<p>No reviews yet. Be the first!</p>";
  } catch (e) { console.error("Error loading reviews", e); }
}

async function loadSettings() {
  try {
    const snap = await getDocs(collection(db, "settings"));
    snap.forEach(doc => {
      const d = doc.data();
      if (d.phone) {
        document.getElementById("cPhone").innerText = d.phone;
        let p = d.phone.replace(/[^0-9]/g, '');
        // Force +94 logic: if it starts with 0 and is 10 digits, replace 0 with 94. 
        // If it starts with 7 and is 9 digits, prepend 94.
        if (p.startsWith('0') && p.length === 10) p = '94' + p.substring(1);
        else if (p.length === 9) p = '94' + p;
        shopPhone = p;
      }
      if (d.email) document.getElementById("cEmail").innerText = d.email;
      if (d.address) {
        document.getElementById("cAddress").innerText = d.address;
        if (document.getElementById("footerAddress")) document.getElementById("footerAddress").innerText = d.address;
      }
      if (d.mapUrl) document.getElementById("mapFrame").src = d.mapUrl;
    });
  } catch (e) { console.error("Error loading settings", e); }
}

// --- SEARCH LOGIC ---
window.searchProducts = (val) => {
  const qStr = val.toLowerCase();
  document.querySelectorAll(".product-item").forEach(item => {
    const name = item.getAttribute("data-name");
    item.style.display = name.includes(qStr) ? "block" : "none";
  });
};

// --- ACTIONS ---
window.sendWhatsApp = () => {
  const name = document.getElementById("qName").value || "Customer";
  const msg = document.getElementById("qMsg").value || translations[currentLang].heroDesc;
  const text = `Hi PrasaTek, I'm ${name}. ${msg}`;
  window.open(`https://wa.me/${shopPhone}?text=${encodeURIComponent(text)}`, '_blank');
};

window.submitReview = async () => {
  const name = document.getElementById("rName").value;
  const msg = document.getElementById("rMsg").value;
  if (!name || !msg) return showToast(translations[currentLang].toastFill);

  try {
    await addDoc(collection(db, "reviews"), {
      name,
      message: msg,
      approved: false,
      timestamp: new Date()
    });
    showToast(translations[currentLang].toastReview);
    document.getElementById("rName").value = "";
    document.getElementById("rMsg").value = "";
  } catch (e) { showToast("Error submitting review"); }
};

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  loadSettings();
});
