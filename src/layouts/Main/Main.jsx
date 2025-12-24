import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Main = () => {
  return (
    <div className="flex text-start min-h-screen">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 pl-[280px] bg-gray-100">
        <div className="sticky top-0 w-full z-10 ps-1 pb-0 mb-4 border-b border-white/30">
          <Header />
        </div>
        {/* <div className="bg-[#E6E6FF] w-full px-6 py-2 mt-1 mb-5">
          <h2 className="text-blue-600 text-lg font-semibold">Over View</h2>
        </div> */}
        <div className="p-[24px] pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
