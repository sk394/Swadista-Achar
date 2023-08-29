import React, {useState} from 'react';
import "./Header.css";
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';

const UserOptions = ({user}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {cartItems} = useSelector(state => state.cart);

    const options=[
        {icon: <ListAltIcon />, name:"Orders", func:orders},
        {icon: <PersonIcon />, name:"Profile", func:account},
        {
            icon: (
                <ShoppingCartIcon
                    style={{color: cartItems.length>0? "tomato":"unset"}}
                    />
            ),
            name: `Cart(${cartItems.length})`,
            func:cart
        },
        {icon: <ExitToAppIcon />, name:"Logout", func:logoutUser},
    ];

    if(user.role==="admin"){
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func:dashboard
        })
    };

    function dashboard(){
        navigate("/admin/dashboard");
    }

    function orders(){
        navigate("/orders");
    }

    function account(){
        navigate("/account");
    }

    function cart(){
        navigate("/cart");
    }

    function logoutUser(){
        dispatch(logout());
        alert.success("Logged out successfully");
    }











  return (
    <>
    <Backdrop open={open} style={{zIndex:"10"}} />
        <SpeedDial
           ariaLabel='SpeedDial tooltip example'
           onClose={()=>setOpen(false)}
           onOpen={()=>setOpen(true)}
           open={open}
           style={{zIndex:"11"}}
           direction="down"
           className="speedDial"
           icon={<img 
                  className="speedDialIcon"
                  src={user.avatar.url? user.avatar.url : "/logo192.jpeg"}
                  alt="Profile"
                />
                }
           >
            {options.map((item)=> (
              <SpeedDialAction
               key={item.name}
               tooltipTitle={item.name}
               icon={item.icon}
               onClick={item.func}
               tooltipOpen={window.innerWidth <= 600 ? true : false}
               />
            ))}
           </SpeedDial>
    </>
  )
}

export default UserOptions
