"use client"

import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FaLocationDot } from "react-icons/fa6"
import { useDispatch, useSelector } from "react-redux"
import { IoIosSearch } from "react-icons/io"
import { LuShoppingCart } from "react-icons/lu"
import { IoMdNotificationsOutline } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { serverUrl } from "../utils/config"
import { getSocket } from "../utils/socket"
import axios from "axios"
import { setSearchItems, setShop, setUserData } from "../redux/userSlice"
import { FiPlus } from "react-icons/fi"
import { TbReceipt2 } from "react-icons/tb"
import { ThemeToggle } from "./theme-toggle"

function Nav() {
  const { city, userData, cartItems, pendingOrdersCount } = useSelector((state) => state.user)
  const [showSearch, setShowSearch] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  // Notification state
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Fetch notifications on mount
  useEffect(() => {
    if (!userData?._id) return;
    axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount((res.data.notifications || []).filter(n => !n.read).length);
        }
      });
  }, [userData?._id]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!userData?._id) return;
    const socket = getSocket();
    socket.on("notification:new", notif => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    return () => {
      socket.off("notification:new");
    };
  }, [userData?._id]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${serverUrl}/api/notification/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setShop(null))
      navigate("/signin")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchItems = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search-items?city=${city}&query=${input}`, {
        withCredentials: true,
      })
      dispatch(setSearchItems(result.data))
    } catch (error) {
      dispatch(setSearchItems(null))
      console.log(error)
    }
  }, [city, input, dispatch])

  useEffect(() => {
    if (input) {
      handleSearchItems()
    } else {
      dispatch(setSearchItems(null))
    }
  }, [handleSearchItems, input, dispatch])

  return (
    <nav
      className="w-full h-16 flex items-center justify-between gap-8 px-6 fixed top-0 left-0 z-50 bg-background border-b border-border"
    >
      {/* Mobile Search Box */}
      {showSearch && userData?.role === "user" && (
        <div className="w-[90%] h-16 bg-background/90 backdrop-blur-xl shadow-2xl rounded-2xl items-center gap-5 z-50 flex fixed left-[5%] top-20 border border-primary/20 animate-fade-in" style={{boxShadow:'0 4px 24px 0 rgba(31,38,135,0.15)'}}>
          <div className="flex items-center w-[30%] overflow-hidden gap-3 px-4 border-r border-primary/20">
            <FaLocationDot className="w-6 h-6 text-primary flex-shrink-0 drop-shadow" />
            <div className="w-full truncate text-muted-foreground text-sm font-semibold">{city || "searching.."}</div>
          </div>
          <div className="w-[70%] flex items-center gap-3 pr-4">
            <IoIosSearch className="w-6 h-6 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="search delicious food..."
              className="text-sm text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent font-medium"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Zingo</h1>

      {/* Desktop Search Box */}
      {userData?.role === "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-10 bg-background rounded-lg items-center gap-4 hidden md:flex border border-border shadow-sm">
          <div className="flex items-center w-[30%] overflow-hidden gap-3 px-4 border-r border-primary/20">
            <FaLocationDot className="w-6 h-6 text-primary flex-shrink-0 drop-shadow" />
            <div className="w-full truncate text-muted-foreground text-sm font-semibold">{city || "searching.."}</div>
          </div>
          <div className="w-[70%] flex items-center gap-3 pr-3">
            <IoIosSearch className="w-6 h-6 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="search delicious food..."
              className="text-sm text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>
        </div>
      )}

  {/* Right Side Icons */}
  <div className="flex items-center gap-5">
        {/* Mobile search toggle */}
        {userData?.role === "user" &&
          (!showSearch ? (
            <IoIosSearch
              className="w-6 h-6 text-primary md:hidden cursor-pointer hover:text-pink-500 transition-transform duration-300 transform hover:scale-125"
              onClick={() => setShowSearch(true)}
            />
          ) : (
            <RxCross2
              className="w-6 h-6 text-primary md:hidden cursor-pointer hover:text-pink-500 transition-transform duration-300 transform hover:scale-125"
              onClick={() => setShowSearch(false)}
            />
          ))}

  {/* Role Based UI */}
        {userData?.role === "owner" ? (
          <>
            {/* Add Food Item */}
            <button
              onClick={() => navigate("/additem")}
              className="hidden md:flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg bg-primary text-primary-foreground hover:brightness-95 text-sm shadow-sm"
            >
              <FiPlus size={16} />
              <span>Add Food Item</span>
            </button>
            <button
              onClick={() => navigate("/additem")}
              className="flex md:hidden items-center justify-center p-2 cursor-pointer rounded-lg bg-primary text-primary-foreground"
            >
              <FiPlus size={18} />
            </button>

            {/* Pending Orders */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm shadow-sm"
              onClick={() => navigate("/pending-orders")}
            >
              <TbReceipt2 className="w-5 h-5" />
              <span>My Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="absolute -right-1 -top-1 text-xs font-bold text-primary-foreground bg-primary rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <div
              className="flex md:hidden items-center justify-center relative p-2 rounded-lg bg-primary text-primary-foreground cursor-pointer shadow-sm"
              onClick={() => navigate("/pending-orders")}
            >
              <TbReceipt2 className="w-5 h-5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -right-1 -top-1 text-xs font-bold text-primary-foreground bg-primary rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
          </>
        ) : userData?.role === "deliveryBoy" ? (
          <button
            onClick={() => navigate("/my-delivered-orders")}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm shadow-sm"
          >
            My Orders
          </button>
        ) : (
          <>
            {/* Theme Toggle */}
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
              <ThemeToggle />
            </div>

            {/* Notification Bell - FIXED POSITIONING */}
            <div className="relative cursor-pointer notification-container" onClick={() => setShowNotifications(v => !v)}>
              <IoMdNotificationsOutline className="w-6 h-6 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 text-xs font-bold text-primary-foreground bg-primary rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
              
              {/* Notification Dropdown - PROPERLY POSITIONED */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background shadow-2xl rounded-lg p-4 border border-border z-[9999] notification-container">
                  <div className="font-bold text-lg text-primary mb-2">Notifications</div>
                  {notifications.length === 0 && <div className="text-muted-foreground text-sm">No notifications yet.</div>}
                  {notifications.map(n => (
                    <div key={n._id} className={`mb-2 p-2 rounded-lg cursor-pointer transition-colors ${n.read ? 'bg-muted hover:bg-muted/80' : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'}`}
                      onClick={() => { if (!n.read) markAsRead(n._id); }}
                    >
                      <div className="text-sm text-foreground">{n.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                      {!n.read && <span className="text-xs text-yellow-500 font-bold">New</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Cart */}
            <div className="relative cursor-pointer" onClick={() => navigate("/cart")}> 
              <LuShoppingCart className="w-6 h-6 text-foreground" />
              {cartItems?.length > 0 && (
                <span className="absolute -right-2 -top-2 text-xs font-bold text-primary-foreground bg-primary rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cartItems?.length}
                </span>
              )}
            </div>

            {/* User Orders → only desktop */}
            {userData?.role === "user" && (
              <button
                onClick={() => navigate("/my-orders")}
                className="hidden md:block px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm shadow-sm"
              >
                My Orders
              </button>
            )}
          </>
        )}

        {/* Profile icon + Popup */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-lg shadow-sm font-extrabold cursor-pointer"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1)}
          </div>

          {showInfo && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-background shadow-md rounded-lg p-4 flex flex-col gap-3 z-50 border border-border">
              <div className="text-base font-semibold text-primary">{userData?.fullName}</div>

              {/* Mobile: My Orders */}
              {userData?.role === "user" && (
                <div
                  className="md:hidden text-primary cursor-pointer hover:underline"
                  onClick={() => {
                    setShowInfo(false)
                    navigate("/my-orders")
                  }}
                >
                  My Orders
                </div>
              )}

              <div
                className="text-primary cursor-pointer hover:underline"
                onClick={handleLogOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for notifications - only show when notifications are open */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black/10 z-[9998]" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </nav>
  )
}

export default Nav;