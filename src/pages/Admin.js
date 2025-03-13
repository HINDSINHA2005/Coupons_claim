import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaClipboardList, FaPlus, FaToggleOn, FaToggleOff, FaUser, FaSearch, FaExclamationTriangle } from "react-icons/fa";

const Admin = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingCoupon, setAddingCoupon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCoupons(); // Fetch coupons after login
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      setCoupons(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.trim()) {
      alert("Please enter a coupon code.");
      return;
    }

    setAddingCoupon(true);
    try {
      await addDoc(collection(db, "coupons"), { 
        code: newCoupon, 
        claimedBy: null, 
        available: true,
        createdAt: new Date().toISOString()
      });
      setNewCoupon("");
      fetchCoupons(); // Refresh list after adding
      
      // Show success toast
      const toastContainer = document.getElementById('toastContainer');
      if (toastContainer) {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
          <div class="toast-header bg-success text-white">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            Coupon "${newCoupon}" added successfully!
          </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      alert("Failed to add coupon. Check Firestore rules!");
    } finally {
      setAddingCoupon(false);
    }
  };

  const toggleCouponAvailability = async (couponId, currentStatus) => {
    try {
      await updateDoc(doc(db, "coupons", couponId), { 
        available: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon.id === couponId ? { ...coupon, available: !currentStatus } : coupon
        )
      );
    } catch (error) {
      console.error("Error updating coupon:", error);
      alert("Failed to update coupon status. Check Firestore rules!");
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (coupon.claimedBy && coupon.claimedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-lg-10 col-md-12 mx-auto">
          {/* Card container */}
          <div className="card border-0 shadow-lg">
            {/* Header */}
            <div className="card-header" 
                 style={{background: "linear-gradient(90deg, #343a40 0%, #495057 100%)"}}>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-white mb-0">
                  <FaClipboardList className="me-2" /> Admin Panel
                </h2>
                {user && (
                  <div className="d-flex align-items-center">
                    <div className="bg-light bg-opacity-25 rounded-pill px-3 py-1 text-white me-3">
                      <FaUser className="me-2" /> {user.email}
                    </div>
                    <button className="btn btn-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content */}
            <div className="card-body p-4">
              {/* Search and filter */}
              <div className="row mb-4">
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search coupons or claimed users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-primary bg-gradient text-white">
                    <div className="card-body text-center">
                      <h5>Total Coupons</h5>
                      <h2>{coupons.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-success bg-gradient text-white">
                    <div className="card-body text-center">
                      <h5>Available</h5>
                      <h2>{coupons.filter(c => c.available).length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info bg-gradient text-white">
                    <div className="card-body text-center">
                      <h5>Claimed</h5>
                      <h2>{coupons.filter(c => c.claimedBy).length}</h2>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Coupon list section */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h4 className="mb-0">Coupon List</h4>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading coupons...</p>
                    </div>
                  ) : filteredCoupons.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Claimed By</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCoupons.map((coupon) => (
                            <tr key={coupon.id}>
                              <td>
                                <span className="badge bg-dark">{coupon.code}</span>
                              </td>
                              <td>
                                <span className={`badge ${coupon.available ? "bg-success" : (coupon.claimedBy ? "bg-info" : "bg-secondary")}`}>
                                  {coupon.available ? "Available" : (coupon.claimedBy ? "Claimed" : "Disabled")}
                                </span>
                              </td>
                              <td>{coupon.claimedBy || "-"}</td>
                              <td>
                                <button
                                  className={`btn btn-sm ${coupon.available ? "btn-outline-danger" : "btn-outline-success"}`}
                                  onClick={() => toggleCouponAvailability(coupon.id, coupon.available)}
                                >
                                  {coupon.available ? <FaToggleOn className="me-1" /> : <FaToggleOff className="me-1" />}
                                  {coupon.available ? "Disable" : "Enable"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-5">
                      <FaExclamationTriangle className="text-warning mb-3" size={30} />
                      <p className="mb-0">No coupons found. {searchTerm && "Try a different search term."}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add new coupon section */}
              <div className="card">
                <div className="card-header bg-light">
                  <h4 className="mb-0">Add New Coupon</h4>
                </div>
                <div className="card-body">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter coupon code"
                      value={newCoupon}
                      onChange={(e) => setNewCoupon(e.target.value)}
                      disabled={addingCoupon}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={handleAddCoupon}
                      disabled={addingCoupon}
                    >
                      {addingCoupon ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <FaPlus className="me-2" /> Add Coupon
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="card-footer text-center py-3 text-muted bg-light">
              <small>Admin Dashboard • Coupon Management System</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast container */}
      <div id="toastContainer" className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}></div>
    </div>
  );
};

export default Admin;