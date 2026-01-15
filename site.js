import { db, storage } from "./firebaseconfig.js";
import {
  collection, getDocs, addDoc, doc, getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { ref, getDownloadURL } from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";

/* LOGO */
getDownloadURL(ref(storage, "logo.png"))
.then(url => logo.src = url);

/* SERVICES */
const services = await getDocs(collection(db,"services"));
services.forEach(d=>{
  servicesList.innerHTML+=`<div class="card">${d.data().name}</div>`;
});

/* PRODUCTS */
const products = await getDocs(collection(db,"products"));
products.forEach(d=>{
  productsList.innerHTML+=`<div class="card">${d.data().name}<br>Rs.${d.data().price}</div>`;
});

/* REVIEWS */
const reviews = await getDocs(collection(db,"reviews"));
reviews.forEach(d=>{
  if(d.data().approved){
    reviewsList.innerHTML+=`
      <div class="card review">
        "${d.data().message}"
        <span>- ${d.data().name}</span>
      </div>`;
  }
});

/* CONTACT */
const c = await getDoc(doc(db,"settings","contact"));
if(c.exists()){
  phone.innerText = "Phone: "+c.data().phone;
  email.innerText = "Email: "+c.data().email;
  address.innerText = "Address: "+c.data().address;
}

/* SEND REVIEW */
window.sendReview = async()=>{
  await addDoc(collection(db,"reviews"),{
    name:rname.value,
    email:remail.value,
    message:rmsg.value,
    approved:false
  });
  alert("Review submitted for admin approval");
};

window.openWhatsApp=()=>{
  window.open("https://wa.me/94771234567","_blank");
};
