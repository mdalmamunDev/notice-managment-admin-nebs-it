import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { createElement, useState } from "react";
import { routeLinkGenerators } from "../../utils/routeLinkGenerators";
import { dashboardItems } from "../../constants/router.constants";
import Swal from "sweetalert2";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineArrowRight } from "react-icons/md";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/Auth/authSlice";
import logo from '../../assets/images/logo.svg'

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNome, setOpenNome] = useState({});

  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "     Sure    ",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      confirmButtonColor: "#DC2626",
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(logout());
        localStorage.clear();
        navigate("/auth");
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-[280px] min-h-screen h-full bg-white">
      <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="w-full flex justify-start items-center p-12">
          <img src={logo} alt="Nebs-IT" className="h-10" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1">
            {routeLinkGenerators(dashboardItems, user.role).map(
              ({ name, icon, path, children, rootPath }, indx) =>
                children?.length ? (
                  <li key={indx} className="overflow-hidden">
                    <button
                      onClick={() => {
                        setOpenNome((c) => ({
                          name: c?.name === name ? null : name,
                        }));
                      }}
                      className={cn(
                        "outline-none text-gray-600 text-base w-full px-4 py-3.5 flex items-center justify-between gap-3 transition-all font-normal rounded-lg hover:bg-gray-50",
                        {
                          "bg-gray-50 text-gray-900":
                            name === openNome?.name ||
                            (location.pathname.includes(rootPath) &&
                              !openNome.name),
                        }
                      )}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <div className="text-gray-400">
                          {createElement(icon, { size: "22" })}
                        </div>
                        <span>{name}</span>
                      </div>
                      <MdOutlineArrowRight
                        className={cn("text-gray-400 transition-transform", {
                          "rotate-90":
                            name === openNome?.name ||
                            (location.pathname.includes(rootPath) &&
                              !openNome.name),
                        })}
                        size={20}
                      />
                    </button>
                    <div
                      className={cn(
                        "space-y-0.5 h-0 overflow-hidden transition-all",
                        {
                          "h-fit pt-1":
                            name === openNome?.name ||
                            (location.pathname.includes(rootPath) &&
                              !openNome.name),
                        }
                      )}
                    >
                      {children?.map(({ subName, subPath, subIcon }, inx) => (
                        <NavLink
                          key={inx}
                          to={subPath}
                          className={({ isActive }) =>
                            cn(
                              "text-gray-600 w-full pl-12 pr-4 py-3 flex items-center justify-start gap-3 text-sm font-normal transition-all rounded-lg hover:bg-gray-50",
                              {
                                "bg-gray-50 text-gray-900 border-r-4 border-orange-500":
                                  isActive,
                              }
                            )
                          }
                        >
                          <div className="text-gray-400">
                            {createElement(subIcon, { size: "18" })}
                          </div>
                          <span>{subName}</span>
                        </NavLink>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      setOpenNome((c) => ({
                        name: c?.name === name ? null : name,
                      }));
                    }}
                    key={indx}
                  >
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        cn(
                          "text-gray-600 w-full px-4 py-3.5 flex items-center justify-start gap-3 text-base font-normal transition-all rounded-lg hover:bg-gray-50",
                          {
                            "bg-gray-50 text-gray-900 border-r-4 border-orange-500":
                              isActive,
                          }
                        )
                      }
                    >
                      <div className="text-gray-400">
                        {createElement(icon, { size: "22" })}
                      </div>
                      <span>{name}</span>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto border-t border-gray-100">
          <button
            onClick={handleLogOut}
            className="bg-transparent w-full px-4 py-3 flex items-center justify-start gap-3 text-base outline-none text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
          >
            <FiLogOut className="text-gray-400" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;