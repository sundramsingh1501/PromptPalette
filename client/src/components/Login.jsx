import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { delay, motion } from "motion/react";
import axios from "axios"
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin,backendUrl,setToken,setUser } = useContext(AppContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try{
      
      if(state === "Login"){
         const {data} = await axios.post(`${backendUrl}/api/user/login`,{email,password}) 
        if(data.success){
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem("token",data.token)
          setShowLogin(false)
        }
        else{
          toast.error(data.message)
        }
      }else{
        const {data}= await axios.post(`${backendUrl}/api/user/register`,{name,email,password})
        if(data.success){
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem("token",data.token)
          setShowLogin(false)
        }else{
          toast.error(data.message)
        }
      }
    }catch(error){
      console.log(error.message);
    toast.error(error.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center px-4">
      <motion.form onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white w-full max-w-md p-8 sm:p-10 rounded-xl text-slate-600 shadow-xl"
      >
        {/* Close icon */}
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-5 right-5 cursor-pointer w-5 h-5"
        />

        {/* Header */}
        <h1 className="text-center text-2xl text-neutral-700 font-semibold mb-1">
          {state}
        </h1>
        <p className="text-center text-sm mb-5">
          {state === "Login"
            ? "Welcome back! Please sign in to continue."
            : "Join us! Create your account below."}
        </p>

        {/* Full Name (only for signup) */}
        {state !== "Login" && (
          <div className="border px-5 py-2.5 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.user_icon} alt="User" className="w-4" />
            <input
              onChange={e=> setName(e.target.value)} value={name}
              type="text"
              className="outline-none text-sm w-full"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="border px-5 py-2.5 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="Email" className="w-4" />
          <input
            onChange={e=> setEmail(e.target.value)} value={email}
            type="email"
            className="outline-none text-sm w-full"
            placeholder="Email ID"
            required
          />
        </div>

        {/* Password */}
        <div className="border px-5 py-2.5 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="Lock" className="w-4" />
          <input
            onChange={e=> setPassword(e.target.value)} value={password}
            type="password"
            className="outline-none text-sm w-full"
            placeholder="Password"
            required
          />
        </div>

        {/* Forgot password */}
        <p className="text-sm text-blue-600 my-4 cursor-pointer hover:underline">
          Forgot password?
        </p>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2.5 rounded-full text-sm font-medium"
        >
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {/* Toggle login/signup */}
        <p className="mt-5 text-center text-sm">
          {state === "Login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Sign Up")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
