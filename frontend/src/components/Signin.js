import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginThunk } from "../redux/slices/userslice";

function Signin() {
  const { isLoggedIn, currentUser, errStatus, errmsg, isPending } = useSelector(
    (state) => state.userReducer
  );

  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function submit(userCredObj) {
    dispatch(userLoginThunk(userCredObj));
  }

 useEffect(() => {
     if (isLoggedIn) {
        navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">Sign In</h2>

        {errStatus && (
          <div className="alert alert-danger py-2 text-center">{errmsg}</div>
        )}

        {/* Email Input */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleSubmit(submit)}
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "LOG IN"}
        </button>

        <p className="text-center">
          New here?{" "}
          <Link to="/signup1" className="text-primary fw-bold">
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
