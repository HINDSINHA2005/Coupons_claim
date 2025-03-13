import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

// Function to get user's IP address
const getUserIP = async () => {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
};

// Function to get cookie value
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

// Function to set cookie with expiration
const setCookie = (name, value, hours) => {
  let expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Function to claim a coupon
export const claimCoupon = async () => {
  const userIP = await getUserIP();
  const sessionCookie = getCookie("claimedCoupon");

  if (!userIP) return "Could not verify your IP. Try again.";

  // Check if user has already claimed
  const claimsRef = collection(db, "claims");
  const claimQuery = query(claimsRef, where("ip", "==", userIP));
  const claimSnap = await getDocs(claimQuery);

  if (!claimSnap.empty || sessionCookie) {
    return "You have already claimed a coupon. Try later.";
  }

  // Get an available coupon
  const couponsRef = collection(db, "coupons");
  const couponQuery = query(couponsRef, where("isClaimed", "==", false));
  const couponSnap = await getDocs(couponQuery);

  if (couponSnap.empty) {
    return "No coupons available right now.";
  }

  const couponDoc = couponSnap.docs[0]; // Round-robin: Assign first available coupon
  const couponData = couponDoc.data();

  // Mark coupon as claimed
  await updateDoc(doc(db, "coupons", couponDoc.id), { isClaimed: true });

  // Store claim info
  await updateDoc(doc(db, "claims", userIP), { ip: userIP, timestamp: new Date() });

  // Set session cookie to prevent re-claiming
  setCookie("claimedCoupon", "true", 1); // Expires in 1 hour

  return `Coupon claimed: ${couponData.code}`;
};
