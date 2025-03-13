import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FaGift } from "react-icons/fa";
import Cookies from "js-cookie";

const CouponClaim = () => {
  const [coupon, setCoupon] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userIP, setUserIP] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api64.ipify.org?format=json");
        const data = await res.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error("Failed to fetch IP", error);
      }
    };
    fetchIP();
  }, []);

  const handleClaimCoupon = async () => {
    setLoading(true);
    setMessage("");

    if (!userIP) {
      setMessage("Error fetching IP. Please try again.");
      setLoading(false);
      return;
    }

    const lastClaimTime = Cookies.get("lastClaimTime");
    const lastClaimIP = Cookies.get("lastClaimIP");
    const now = Date.now();

    if (lastClaimTime && lastClaimIP === userIP && now - parseInt(lastClaimTime) < 24 * 60 * 60 * 1000) {
      setMessage("You can only claim a coupon once every 24 hours.");
      setLoading(false);
      return;
    }

    try {
      const couponsRef = collection(db, "coupons");
      const availableCouponsQuery = query(couponsRef, where("claimedBy", "==", null), where("available", "==", true));
      const querySnapshot = await getDocs(availableCouponsQuery);

      if (!querySnapshot.empty) {
        const selectedCoupon = querySnapshot.docs[0];
        const couponRef = doc(db, "coupons", selectedCoupon.id);

        // Step 1: Mark coupon as claimed in Firestore
        await updateDoc(couponRef, { claimedBy: userIP, available: false });

        // Step 2: Add claim record
        await addDoc(collection(db, "claims"), { couponId: selectedCoupon.id, claimedByIP: userIP, timestamp: now });

        // Step 3: Store in cookies to prevent abuse
        Cookies.set("lastClaimTime", now, { expires: 1 });
        Cookies.set("lastClaimIP", userIP, { expires: 1 });

        setCoupon(selectedCoupon.data().code);
        setMessage("Coupon claimed successfully!");
      } else {
        setMessage("No available coupons at the moment.");
      }
    } catch (error) {
      setMessage("Error claiming coupon. Please try again.");
      console.error("Error claiming coupon:", error);
    }

    setLoading(false);
  };

  return (
    <div className="container text-center mt-5">
      <h2><FaGift /> Claim Your Coupon</h2>
      <button className="btn btn-primary mt-3" onClick={handleClaimCoupon} disabled={loading}>
        {loading ? "Processing..." : "Get Coupon"}
      </button>
      {message && <p className="mt-3 alert alert-info">{message}</p>}
      {coupon && <h4 className="mt-3">Your Coupon Code: <strong>{coupon}</strong></h4>}
    </div>
  );
};

export default CouponClaim;
