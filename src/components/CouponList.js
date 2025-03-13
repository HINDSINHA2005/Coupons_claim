import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      setCoupons(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchCoupons();
  }, []);

  return (
    <div>
      <h3>Available Coupons</h3>
      <ul className="list-group">
        {coupons.map(coupon => (
          <li key={coupon.id} className="list-group-item">
            {coupon.code} - {coupon.isClaimed ? "Claimed" : "Available"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponList;
