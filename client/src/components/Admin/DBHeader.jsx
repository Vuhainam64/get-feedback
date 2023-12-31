import { MdLogout, MdSearch } from "react-icons/md";
import { buttonClick } from "../../animations";
import { BsFillBellFill, BsToggles2 } from "react-icons/bs";
import { motion } from "framer-motion";
import { Avatar } from "../../assets";
import { signOutAction } from "../../ultils/helpers";
import { useSelector } from "react-redux";

function DBHeader() {
  const user = useSelector((state) => state?.user?.user);
  return (
    <div className="w-full flex items-center justify-between gap-3">
      <p className="text-2xl text-headingColor">
        Welcome to Dashboard
        {user && (
          <span className="block text-base text-gray-500">{`Hello ${user?.displayName}...!`}</span>
        )}
      </p>

      <div className=" flex items-center justify-center gap-4 ">
        <div className=" flex items-center justify-center gap-3 px-4 py-2 bg-lightOverlay backdrop-blur-md rounded-md shadow-md">
          <MdSearch className="text-gray-400 text-2xl" />
          <input
            type="text"
            placeholder="Search Here..."
            className="border-none outline-none bg-transparent w-32 text-base font-semibold text-textColor"
          />
          <BsToggles2 className="text-gray-400 text-2xl" />
        </div>

        <motion.div
          {...buttonClick}
          className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center"
        >
          <BsFillBellFill className="text-gray-400 text-xl" />
        </motion.div>

        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-md shadow-md cursor-pointer overflow-hidden">
            <motion.img
              className="w-full h-full object-cover"
              src={user?.photoURL ? user?.photoURL : Avatar}
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
            />
          </div>

          <motion.div
            {...buttonClick}
            onClick={signOutAction}
            className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center"
          >
            <MdLogout className="text-gray-400 text-xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DBHeader;
