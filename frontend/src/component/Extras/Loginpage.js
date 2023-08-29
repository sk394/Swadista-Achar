import React, { useRef, useState, useEffect, Fragment } from "react";
import "./Loginextra.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, login, register } from "../../actions/userAction";

const Loginpage = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const location = window.location;
  const search = location.search;

  const loginTab = useRef(null);
  const switcherTab = useRef(null);
  const registerTab = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/logo192.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name,
      email: email,
      password: password,
      avatar: avatar,
    };
    dispatch(register(payload));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = search ? search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, alert, error, isAuthenticated, navigate, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  const iconStyles = {
    '--clr': '#00ff0a',
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
           <div class="square">
           <i style={{'--clr': '#00ff0a'}}></i>
            <i style={{'--clr': '#ff0057'}}></i>
            <i style={{'--clr': '#fffd44'}}></i>
            <div class="login" ref={loginTab} onSubmit={loginSubmit}>
                <h2>Login</h2>
                <div class="inputBx">
                <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div class="inputBx">
                <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div class="inputBx">
                    <input type="submit" value="Login" />
                </div>
                <div class="links">
                    <Link to="/password/forgot">Forget Password? </Link>
                    <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                  <p onClick={(e) => switchTabs(e, "register")}>Register</p>
                    <button ref={switcherTab}></button>
                </div>
            </div>
            {/* <div class="login" ref={registerTab} onSubmit={registerSubmit}  encType="multipart/form-data">
                <h2>SignUp</h2>
                <div class="inputBx">
                <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    name="name"
                    onChange={registerDataChange}
                  />
                </div>
                <div class="inputBx">
                <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    name="email"
                    onChange={registerDataChange}
                  />
                </div>
                <div class="inputBx">
                <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    name="password"
                    onChange={registerDataChange}
                  />
                </div>
                <div class="inputBx">
                <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>

                <div class="inputBx">
                    <input type="submit" value="Register" />
                </div>
               
            </div> */}
   
           
                
               
               
               
           
             
            </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Loginpage;
