import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaComments,
    FaRobot
} from "react-icons/fa";

const Sidebar = () => {

    const menu = [

        {
            title: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/"
        },

        {
            title: "Products",
            icon: <FaBox />,
            path: "/products"
        },

        {
            title: "Orders",
            icon: <FaShoppingCart />,
            path: "/orders"
        },

        {
            title: "Customers",
            icon: <FaUsers />,
            path: "/customers"
        },

        {
            title: "Conversations",
            icon: <FaComments />,
            path: "/conversations"
        },

        {
            title: "AI Chat",
            icon: <FaRobot />,
            path: "/chat"
        }

    ];

    return (

        <aside className="hidden md:flex md:w-72 bg-slate-900 text-white min-h-screen shadow-2xl flex flex-col">

           <div className="border-b border-slate-700 px-6 py-6">

    <div className="flex items-center gap-3">

        <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-2xl">
            👗
        </div>

        <div>

            <h1 className="text-2xl font-bold">
                FashionHub
            </h1>

            <p className="text-gray-400 text-sm">
                AI Sales Assistant
            </p>

        </div>

    </div>

</div>

            <nav className="mt-6">

                {menu.map((item, index) => (

                    <NavLink
    key={index}
    to={item.path}
    className={({ isActive }) =>
        `mx-3 my-1 flex items-center gap-4 rounded-xl px-5 py-3 transition-all duration-300 ${
            isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-slate-800"
        }`
    }
>
    <span className="text-lg">
        {item.icon}
    </span>

    <span className="font-medium">
        {item.title}
    </span>
</NavLink>

                ))}

            </nav>

        </aside>

    );

};

export default Sidebar;