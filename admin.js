import { db } from "./firebaseconfig.js";
import {
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* SERVICES */
window.addService = async () => {
  await addDoc(collection(db, "services"), {
    name: serviceName.value
  });
  alert("Service Added");
};

/* PRODUCTS */
window.addProduct = async () => {
  await addDoc(collection(db, "products"), {
    name: productName.value,
    price: productPrice.value
  });
  alert("Product Added");
};

/* CONTACT */
window.saveContact = async () => {
  await updateDoc(doc(db, "settings", "contact"), {
    phone: phone.value,
    email: email.value,
    address: address.value
  });
  alert("Saved");
};

/* REVIEWS */
async function loadReviews() {
  const snap = await getDocs(collection(db, "reviews"));
  reviews.innerHTML = "";
  snap.forEach(d => {
    if (!d.data().approved) {
      reviews.innerHTML += `
        <div>
          <b>${d.data().name}</b>
          <p>${d.data().message}</p>
          <button onclick="approve('${d.id}')">Approve</button>
          <button onclick="del('${d.id}')">Delete</button>
        </div>`;
    }
  });
}

window.approve = async id =>
  await updateDoc(doc(db, "reviews", id), { approved: true });

window.del = async id =>
  await deleteDoc(doc(db, "reviews", id));

loadReviews();
