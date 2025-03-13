import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"; // Added sign-in icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // Redirect to Admin Page after login
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5" 
         style={{background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"}}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-lg">
            <div className="card-header text-center py-4" 
                 style={{background: "linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)"}}>
              <h2 className="text-white mb-0">
                <FaSignInAlt className="me-2" />Admin Login
              </h2>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <div className="me-2">⚠️</div>
                  <div>{error}</div>
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaUser className="text-primary" />
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaLock className="text-primary" />
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-lg w-100 text-white shadow-sm mb-3"
                  disabled={loading}
                  style={{background: "linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)"}}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>Login <FaSignInAlt className="ms-2" /></>
                  )}
                </button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-link text-decoration-none" 
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center py-3 text-muted"
                 style={{background: "rgba(13, 110, 253, 0.05)"}}>
              <small>Secure Admin Portal • {new Date().getFullYear()}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;