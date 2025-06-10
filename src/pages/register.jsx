import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils.js";

const Register = () => {
  const userStructure = {
    username: "",
    password: "",
    email: "",
    name: "",
  };

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState(userStructure);

  function handelChange(e) {
    const name = e.target.id;
    const value = e.target.value;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  useEffect(() => {
    const fetch = async () => {
      const response = await api.get("/check");
      if (response.data.code === 200) {
        navigate("/");
      }
    };
    fetch();
  }, [navigate]);

  async function handelSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post("/user/register", {
        ...newUser,
      });
      if (response.data.code === 200) navigate("/login");
      else if (response.data.code === 202) {
        setError(response.data.message);
        setNewUser((prevUser) => ({
          ...prevUser,
          password: "",
        }));
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (error) {
      setError("Server down, try later!");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }

  function handelLoginClick(e) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 flex-col">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 rounded-2xl shadow-lg transform transition-all hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Register
        </h2>

        <form onSubmit={handelSubmit}>
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="username"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              id="username"
              value={newUser.username}
              onChange={handelChange}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
              placeholder="Enter username"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="name"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              autoComplete="name"
              id="name"
              value={newUser.name}
              onChange={handelChange}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
              placeholder="Enter name"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              id="email"
              value={newUser.email}
              onChange={handelChange}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
              placeholder="Enter email"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={newUser.password}
              onChange={handelChange}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
              placeholder="********"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          {error && (
            <p className="w-full px-3 py-2 sm:py-3 text-center text-red-500 text-sm mt-1">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Register
          </button>
        </form>
        <p>Already registered?</p>
        <button
          type="submit"
          onClick={handelLoginClick}
          className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
