import React from "react";
import { Link } from "react-router-dom";
import CouponClaim from "../components/CouponClaim";

const Home = () => {
  return (
    <div className="container-fluid min-vh-100 bg-light py-5" 
         style={{background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)"}}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-primary shadow-lg">
            <div className="card-header text-center p-4" 
                 style={{background: "linear-gradient(90deg, #6610f2 0%, #6f42c1 100%)"}}>
              <h1 className="text-white fw-bold">Welcome to the Coupon App</h1>
              <p className="text-white-50 mb-0">Discover amazing deals and exclusive offers</p>
            </div>
            
            <div className="card-body p-5">
              <div className="border border-2 border-primary rounded p-4 mb-4"
                   style={{borderStyle: "dashed", background: "linear-gradient(90deg, rgba(102, 16, 242, 0.05) 0%, rgba(111, 66, 193, 0.05) 100%)"}}>
                <CouponClaim />
              </div>
              
              <div className="text-center mt-4">
                <Link to="/login" className="btn btn-lg shadow-sm" 
                      style={{background: "linear-gradient(90deg, #6610f2 0%, #6f42c1 100%)", color: "white", 
                             transition: "all 0.3s ease"}}>
                  Admin Login
                </Link>
              </div>
            </div>
            
            <div className="card-footer text-center text-muted p-3"
                 style={{background: "linear-gradient(90deg, rgba(102, 16, 242, 0.1) 0%, rgba(111, 66, 193, 0.1) 100%)"}}>
              <small>© {new Date().getFullYear()} Coupon App. All rights reserved.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;