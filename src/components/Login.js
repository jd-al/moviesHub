import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { query, where, getDocs } from "firebase/firestore";
import { usersRefrence } from "../firebase/firebase";
import { AppState } from "../App";
import bcrypt from "bcryptjs";

const Login = () => {
  const navigate = useNavigate();
  const useAppState = useContext(AppState);
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // login section
  const login = async () => {
    setLoading(true);
    try {
      const userQuery = query(
        usersRefrence,
        where("mobile", "==", form.mobile)
      );
      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach((doc) => {
        const _data = doc.data();
        // comapring the data with bcrypt
        const isUser = bcrypt.compareSync(form.password, _data.password);

        // grant access based on matched credentials
        if (isUser) {
          useAppState.setLogin(true);
          // set the user name
          useAppState.setUserName(_data.name);
          swal({
            title: "Logged In",
            icon: "success",
            buttons: false,
            timer: 3000,
          });
          navigate("/");
        } else {
          swal({
            title: "Invalid Credentials",
            icon: "error",
            buttons: false,
            timer: 3000,
          });
        }
      });
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col mt-4 items-center">
      <h1 className="text-xl font-bold">Log in</h1>
      <div className="p-2 w-full md:w-1/3">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-200">
            Mobile Number
          </label>
          <input
            type={"Number"}
            id="mobile"
            name="message"
            autoComplete="on"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 w-full md:w-1/3">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-200">
            Password
          </label>
          <input
            id="message"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-gray-100 bg-opacity-90 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="p-2 w-full">
        <button
          onClick={login}
          className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
        >
          {loading ? <TailSpin height={20} color="white" /> : "Log in"}
        </button>
      </div>
      <div>
        <p>
          Do't have an account?
          <Link to={"/signup"}>
            <span className="text-blue-500 ml-1">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
