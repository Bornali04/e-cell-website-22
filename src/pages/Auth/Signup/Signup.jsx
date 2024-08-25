import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import NavbarTeam from "../../../components/shared/Navbar/NavbarTeam";
import Footer from "../../../components/shared/Footer/Footer";
import { toast } from "react-toastify";
const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [signingup, setSigningup] = useState(false);
  const [verifyotp, setVerifyotp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpgoing, setOtpgoing] = useState(false);
  const [disablebtn, setDisablebtn] = useState(false);
  const [disablesendotp, setDisablesendotp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userimg, setUserimg] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [bio, setBio] = useState("Author");

  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    document.title = "Signup | E-Cell NIT Silchar";
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const isSignUpFormFilled = () => {
    return (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      otp !== "" &&
      confirmpwd !== "" &&
      bio !== "" &&
      userimg !== ""
    );
  };

  const formhandlesubmit = async (e) => {
    e.preventDefault();

    // console.log("isSignUpFormFilled:", isSignUpFormFilled());
    if (!isSignUpFormFilled()) {
      toast.error("Please fill all the required fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (confirmpwd !== password) {
      // setMessage("! Passwords are not same.");
      toast.error("Passwords are not same", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        setMessage("");
      }, 5000);
      return;
    }
    setDisablebtn(true);
    try {
      setVerifyotp(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_APIMAIN}/verify-otp`,
        {
          otp,
          email,
        }
      );

      if (response.data.message === "OTP verified successfully") {
        console.log("OTP verified");
      } else {
        toast.error("Wrong OTP. Please try again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
    } catch (error) {
      // console.log("Error verifying OTP:", error);
      toast.error("Wrong OTP. Please try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } finally {
      setVerifyotp(false);
      setDisablebtn(false);
    }
    setDisablebtn(true);
    setSigningup(true);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_APIMAIN}/signup`, {
        name,
        email,
        password,
        bio,
        userimg,
      })
      .then((response) => {
        console.log(response.data);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmpwd("");
        setOtp("");
        // setMessage(
        //   `Signup completed! You will be redirected to login page after 5 seconds.`
        // );
        toast.success(
          `Signup completed! You will be redirected to login page after 5 seconds`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 5000);
        setSigningup(false);
        setDisablebtn(false);
      })
      .catch((error) => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmpwd("");
        setOtp("");

        if (error.response && error.response.data.error === "Email already exists") {
          // setMessage("Email already exists");
          toast.info(`Email already exists`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (
          error.response &&
          error.response.data.error === "Password should not be less than 8 characters"
        ) {
          // setMessage("Password cannot be less than 8 characters");
          toast.error(`Password cannot be less than 8 characters`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          // setMessage("Signup failed. Please try again.");
          toast.error(`Signup failed. Please try again`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        setTimeout(() => {
          setMessage("");
        }, 5000);
        setSigningup(false);
        setDisablebtn(false);
      });
  };

  const hangleGoToLogin = () => {
    navigate("/login");
  };

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const sendOTP = async (e) => {
    e.preventDefault();

    if (name == "") {
      toast.error("Please enter your name", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email id", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    try {
      setDisablesendotp(true);
      setOtpgoing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_APIMAIN}/send-otp`,
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success(
          "OTP sent successfully! Please check your inbox as well as SPAM folder.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      }
    } catch (error) {
      // console.log("Error sending OTP:", error);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setOtpgoing(false);
      setDisablesendotp(false);
    }
  };

  return (
    <>
      <NavbarTeam />
      <div className="signuptopcont">
        <div className="formcontsignup">
          <h1 className="okwelcometoecell">Welcome to E-Cell, NITS</h1>
          <h4 className="enterdtlssignup">Please enter your details.</h4>
          <form className="formsignaccoutn">
            <div className="inputdicdignup">
              <h3>Name</h3>
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="inputdicdignup">
              <h3>Email</h3>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ display: "none" }}>
              <div className="inputdicdignup">
                <h3>Bio</h3>
                <input
                  type="text"
                  placeholder="Enter your Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="inputdicdignup">
                <h3>Profile pic</h3>
                <input
                  type="text"
                  placeholder="Enter your Profile img link"
                  value={userimg}
                  onChange={(e) => setUserimg(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                onClick={sendOTP}
                disabled={disablesendotp || disablebtn}
                style={{
                  opacity: disablesendotp || disablebtn ? 0.5 : 1,
                  cursor: disablesendotp || disablebtn ? "not-allowed" : "pointer",
                }}
                className="btnotpsend"
                id="newotpsending"
              >
                Send OTP
              </button>
            </div>

            {otpgoing && (
              <p className="statusmsgssubmt">
                Sending otp...Please be patient it might take 10 seconds.
              </p>
            )}

            <div className="inputdicdignup">
              <h3>OTP</h3>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="inputdicdignup">
              <h3>Password</h3>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="labelshowpass">
                <input
                  className="inputshowpass"
                  type="checkbox"
                  name="showPassword"
                  id="showPassword"
                  checked={showPassword}
                  onChange={handleShowPassword}
                />
                Show password
              </label>
            </div>

            <div className="inputdicdignup">
              <h3>Confirm Password</h3>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmpwd}
                onChange={(e) => setConfirmpwd(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btnsubmittodb"
              onClick={formhandlesubmit}
              disabled={disablebtn || disablesendotp}
              style={{
                opacity: disablebtn || disablesendotp ? 0.5 : 1,
                cursor: disablebtn || disablesendotp ? "not-allowed" : "pointer",
              }}
            >
              {signingup ? "Creating account" : "Sign up"}
            </button>

            <div className="statusmeshs">
              {message && <p className="msgaftersignuplogin">{message}</p>}
              {verifyotp && <p className="statusmsgssubmt">Verifying otp...</p>}
            </div>
            <div className="bottomredirectlogin">
              <h4 className="logexistingaccount">Already have an account?</h4>
              <button
                onClick={hangleGoToLogin}
                disabled={disablebtn || disablesendotp}
                style={{
                  cursor: disablebtn || disablesendotp ? "not-allowed" : "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        <div className="imgbgholdersignup">
          <img
            src="https://res.cloudinary.com/dp92qug2f/image/upload/v1686499643/Photo_zxxmw5.svg"
            alt=""
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
