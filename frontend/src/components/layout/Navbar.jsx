import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = () => {

    return (

        <header className="bg-white h-20 shadow-sm flex justify-between items-center px-8">

            <div>

                <h1 className="text-3xl font-bold">
                    AI Fashion Sales Assistant
                </h1>

                <p className="text-gray-500">
                    Welcome back, Admin 👋
                </p>

            </div>

            <div className="flex items-center gap-6">

                <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 h-11 w-72 shadow-sm">

    <FaSearch className="text-gray-400 text-lg" />

    <input
        type="text"
        placeholder="Search..."
        className="ml-3 flex-1 outline-none bg-transparent"
    />

</div>

                <FaBell
                    size={22}
                    className="cursor-pointer"
                />

                <FaUserCircle
                    size={40}
                    className="text-blue-600 cursor-pointer"
                />

            </div>

        </header>

    );

};

export default Navbar;