import React, { useState } from "react";
import { toast } from "react-toastify";
import loader from "../assets/loaders/gif3.webp";
import "react-toastify/dist/ReactToastify.css";

export default function Register({ ratio, setLogin }) {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    if (loading) return;
    setLogin(true);
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    fetch("https://squid-b.onrender.com/user/register", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          setLogin(true);
          toast(data.message);
        } else {
          toast(data.message);
        }
        setLoading(false);
      });
  };
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="md:mycontainer">
        <section className="">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 bg-transparent">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-white">
                  Create an account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      for="name"
                      className="block mb-2 text-base font-medium text-gray-900 text-white"
                    >
                      Full Name
                    </label>
                    <input
                      value={input.name}
                      onChange={handleChange}
                      type="text"
                      name="name"
                      id="name"
                      className="bg-transparent border border-gray-300 text-white text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      className="block mb-2 text-base font-medium text-gray-900 text-white"
                    >
                      Your email
                    </label>
                    <input
                      value={input.email}
                      onChange={handleChange}
                      type="email"
                      name="email"
                      id="email"
                      className="bg-transparent border border-gray-300 text-white text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      className="block mb-2 text-base font-medium text-gray-900 text-white"
                    >
                      Password
                    </label>
                    <input
                      value={input.password}
                      onChange={handleChange}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-transparent border border-gray-300 text-base text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      for="confirm-password"
                      className="block mb-2 text-base font-medium text-gray-900 text-white"
                    >
                      Confirm password
                    </label>
                    <input
                      value={input.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      name="confirmPassword"
                      id="confirm-password"
                      placeholder="••••••••"
                      className="bg-transparent border border-gray-300 text-white text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="terms"
                        className="font-light text-gray-500 dark:text-gray-300 text-base"
                      >
                        I accept the{" "}
                        <a
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                          href="#"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white bg-indigo-700 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {loading ? (
                      <img
                        className="loader-gif show"
                        width="20px"
                        height="20px"
                        src={loader}
                        alt=""
                      />
                    ) : (
                      "Register"
                    )}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-base">
                    Already have an account?{" "}
                    <a
                      onClick={handleClick}
                      className="font-medium text-indigo-600 hover:underline dark:text-primary-500 hover:cursor-pointer"
                    >
                      Login here
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
