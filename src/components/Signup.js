import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import app from "../firebase/firebase";
import swal from "sweetalert";
import { usersRefrence } from "../firebase/firebase";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // verifying recaptcha
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };

  // Request OTP
  const requestOtp = () => {
    setLoading(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // verify OTP
  const verifyOtp = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(otp).then((result) => {
        uploadData();
        swal({
          text: "Successfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate("/login");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // hash & upload pasword
  const uploadData = async () => {
    try {
      // hashing the password using bcryptjs
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(form.password, salt);
      // store hash in the DB
      await addDoc(usersRefrence, {
        name: form.name,
        password: hash,
        mobile: form.mobile,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col mt-4 items-center">
      <h1 className="text-xl font-bold">Sign up</h1>

      {otpSent ? (
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-200"
              >
                OTP
              </label>
              <input
                id="otp"
                name="message"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={verifyOtp}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={20} color="white" /> : "Confirm OTP"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-200"
              >
                Name
              </label>
              <input
                id="user-name"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-200"
              >
                Mobile Number
              </label>
              <input
                type={"number"}
                id="message"
                name="message"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-200"
              >
                Password
              </label>
              <input
                type={"password"}
                id="message"
                name="message"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              onClick={requestOtp}
              className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={20} color="white" /> : "Request OTP"}
            </button>
          </div>
        </>
      )}
      <div>
        <p>
          Already have an account?
          <Link to={"/login"}>
            <span className="text-blue-500 ml-1">Log in</span>
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
