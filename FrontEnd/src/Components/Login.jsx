import { useState } from "react";
import logo1 from '../assets/facebook-app-symbol.png'
import logo2 from '../assets/google.png'
import { useNavigate } from "react-router-dom";
import animationData from "../assets/animations/loading.json"
const Login = () => {
  const Navigate = useNavigate()
  const [slide, setSlide] = useState(false);
  const [pop, setPop] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [hide, setHide] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorE, setErrorE] = useState("");
  const [errorP, setErrorP] = useState("");
  const [errorBackend, setErrorBackend] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailS, setEmailS] = useState("");
  const [passwordS, setPasswordS] = useState("");
  const [tick, setTick] =useState(false);
  const handleSlide = () => {
    setFadeOut(true);
    setTimeout(() => {
      setSlide(!slide);

      setPop(true);
    }, 300);

    setTimeout(() => {
      setHide(!hide);
    }, 800);

    setTimeout(() => {
      setFadeOut(false);
    }, 600);

    setTimeout(() => {
      setPop(false);
    }, 700);
  };



  const loginApi = async ({
    email,
    password,
  }) => {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json(); 
      throw new Error(err.error || "login failed");  
    }
    return res.json();
  };
  const handleSignIn = async () => {
    try {
      setEmailS("")
      setPasswordS("")
      setLoading(true);
      const res = await loginApi({ email: emailS, password: passwordS });
      localStorage.setItem("token", res.token);
      Navigate("/");
      

    } catch (err) {
      if (err instanceof Error) 
      {

        setErrorBackend(err.message);
        setTimeout(()=>{
          setErrorBackend("");
        },600)
      }
    } finally {
      setLoading(false);
    }
  };
  const SignUpApi = async ( {name,
    email,
    password})=> {
  
  
    const res = await fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "signup failed");
    }
    return res.json();
  };
  const handleSignUp = async () => {
    try {
      let val1 = true,
        val2 = true;
        if (!email.includes("@")) {
          setErrorE("Email id must include @");
          val1 = false;
        }

      if (password.length <= 6) {
        setErrorP("Password must be greater than 6");
        val2 = false;
      }
      if (val1 == false || val2 == false) return;
      setErrorE("");
      setErrorP("");
      setName("")
      setEmail("")
      setPassword("")
      setLoading(true);
      const res = await SignUpApi({
        name: name,
        email: email,
        password: password,
      });
      setLoading(false);
      setTick(true);
      localStorage.setItem("token", res.token);
    } catch (err) {
      if (err instanceof Error) setErrorBackend(err.message);
    } finally{
      setTimeout(()=>{
        setTick(false);
      }, 3500)
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-[#E0F4F0]   flex justify-center items-center gap-4 ">
        <div className="w-[90%] h-[55%] md:w-[70%] md:h-[80%] border rounded-2xl border-none bg-white flex flex-wrap   relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden">
          {loading && (
            <div className="w-full h-full flex justify-center items-center bg-[#D1E8E4] absolute z-40">
                <Lottie
      animationData={animationData}
      loop={true}
      className="w-full h-full"
    />
                </div>
                )}
       { tick && ( <div className="w-full h-full flex justify-center items-center bg-[#D1E8E4] absolute z-40"> 
         
              </div>)
       }
          <div className="text-black z-50 text-3xl  ">{errorBackend}</div>
          <div
            className={`flex flex-col justify-center items-center gap-4 w-[35%] h-full   rounded-l-2xl bg-[#1b5AA7] z-2 absolute ${slide ? "left-[65%] rounded-r-2xl rounded-l-none" : "left-0"} ${pop ? "scale-x-[2.5]" : "scale-x-[1]"} transition-all ease-in duration-700 `}
          >
            {slide ? (
              <h1
                className={` text-2xl text-center md:text-3xl font-semibold text-white ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500`}
              >
                Hello, Friend
              </h1>
            ) : (
              <h1
                className={`text-2xl text-center md:text-3xl font-semibold text-white ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500`}
              >
                Welcome Back!
              </h1>
            )}
            {slide ? (
              <div
                className={`text-center p-3 text-white ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500`}
              >
                Enter your personal details and start journey with us
              </div>
            ) : (
              <div
                className={`text-center p-3 text-white  ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500`}
              >
                To keep connected with us please login with your personal info
              </div>
            )}
            {slide ? (
              <button
                onClick={handleSlide}
                className={`bg-white text-[#1b5AA7] w-[30%] h-10 z-2 border-white rounded-4xl ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500 `}
              >
                SIGN UP
              </button>
            ) : (
              <button
                onClick={handleSlide}
                className={`bg-white z-2 border-white text-[#1b5AA7] w-[30%] h-10 rounded-4xl ${fadeOut ? "opacity-0" : "opacity-100"} transition-all duration-500 `}
              >
                SIGN IN
              </button>
            )}
          </div>

        
          {hide && (
            <div
              className={`w-[65%] h-full  bg-white rounded-r-2xl absolute hidden ${slide ? "right-[35%] rounded-l-none" : "right-0"} transition-all ease-in duration-900 flex flex-col justify-evenly items-center`}
            >
              <div
                className={` text-black flex flex-col justify-center items-center gap-5  `}
              >
                <h1
                  className={`text-[#1F8A70] font-semibold text-4xl  transition-all `}
                >
                  Sign in to JANSEWA
                </h1>
                <div className="flex justify-center gap-2">
               
                <img src={logo1} alt="error" className="w-full h-full object-contain" />
                 
                  <div
                    className={`border  border-gray-300 rounded-[100%] w-9 text-center  transition-all `}
                  >
                   <img src={logo2} alt="error" />
                  </div>
                  <div
                    className={`border  border-gray-300 rounded-[100%] w-9 text-center  transition-all `}
                  >
                    inn
                  </div>
                </div>
                <div className={`text-gray-600 transition-all duration-1000`}>
                  or use your email account
                </div>
              </div>
              <form
                action=""
                className=" flex flex-col justify-center items-center gap-3 w-[60%]"
              >
                <input
                  type="email"
                  placeholder="Email"
                  className={`placeholder-gray-400 bg-gray-100  h-12 w-full p-3  transition-all `}
                />
                <input
                  type="text"
                  placeholder="Password"
                  className={`placeholder-gray-400 bg-gray-100  h-12 w-full p-3  transition-all `}
                />
                <div className={`text-black  transition-all `}>
                  Forgot your password?
                </div>
                <button
                  className={`w-[60%] rounded-3xl font-bold bg-gradient-to-br from-[#2FB7A4] to-[#27A896] transition-all `}
                >
                  SIGN UP
                </button>
              </form>
            </div>
          )}
          {hide ? (
            <div
              className={`w-[65%] h-full  bg-white absolute ${slide ? "right-[35%]" : "right-0"} transition-all ease-in duration-900 flex flex-col justify-evenly items-center`}
            >
              <div
                className={` text-black flex flex-col justify-center items-center gap-5  `}
              >
                <h1
                  className={` text-[#1b5AA7] mt-4  h-10 font-semibold text-3xl text-center md:text-4xl  transition-all `}
                >
                  Sign in to JANSEWA
                </h1>
                <div className="flex justify-center gap-2">
                 
               
                 
                </div>
                <div className={`text-[#1b5AA7] transition-all duration-1000 font-medium`}>
                  or use your email account
                </div>
              </div>
              <form
                action=""
                className=" flex flex-col justify-center items-center gap-3 w-[60%]"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={emailS}
                  onChange={(e) => setEmailS(e.target.value)}
                  className={`placeholder-gray-400 bg-gray-100 text-black  h-12 w-full p-3  transition-all `}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={passwordS}
                  onChange={(e) => setPasswordS(e.target.value)}
                  className={`placeholder-gray-400 bg-gray-100 text-black  h-12 w-full p-3  transition-all `}
                />
                <div className={`text-[#1b5AA7]  transition-all text-center font-medium `}>
                  Forgot your password?
                </div>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className={` w-[40%] rounded-3xl bg-[#1b5AA7] text-white mt-4  h-10 rounded-3xl  font-bold transition-all  hover:shadow-lg hover:scale-105 `}
                >
                  SIGN IN
                </button>
              </form>
            </div>
          ) : (
            <div
              className={`w-[65%] h-full  bg-white rounded-r-2xl absolute ${slide ? "right-[35%]" : "right-0"} transition-all ease-in duration-900 flex flex-col justify-evenly items-center `}
            >
              <div className=" text-black flex flex-col justify-center items-center gap-5 ">
                <h1
                  className={`text-[#1b5AA7] font-semibold text-3xl md:text-4xl  transition-all `}
                >
                  Create Account
                </h1>

                <div className={`text-[#1b5AA7]  transition-all text-center `}>
                  or use your email for registration
                </div>
              </div>
              <form
                action=""
                className=" flex flex-col justify-center items-center gap-3 w-[60%]"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className={`placeholder-gray-400 bg-gray-100 text-black h-12 w-full p-3  transition-all duration-500`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`placeholder-gray-400 bg-gray-100 text-black h-12 w-full p-3  transition-all duration-500`}
                />
                {errorE && <p className="text-red-500 text-sm  ">{errorE}</p>}
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`placeholder-gray-400 bg-gray-100 text-black  h-12 w-full p-3  transition-all duration-500`}
                />
                {errorP && <p className="text-red-500 text-sm ">{errorP}</p>}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSignUp}
                  className={` w-[40%] rounded-3xl bg-[#1b5AA7] text-white mt-4  h-10 font-bold  transition-all  hover:shadow-lg hover:scale-105`}
                >
                  SIGN UP
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Login;
