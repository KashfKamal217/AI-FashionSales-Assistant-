import DashboardCard from "../../components/dashboard/DashboardCard";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentOrders from "../../components/dashboard/RecentOrders";

const Dashboard = () => {

    const dashboardData = [

        {
            title: "Products",
            value: 120,
            color: "bg-blue-500"
        },

        {
            title: "Orders",
            value: 85,
            color: "bg-green-500"
        },

        {
            title: "Customers",
            value: 250,
            color: "bg-purple-500"
        },

        {
            title: "AI Chats",
            value: 425,
            color: "bg-orange-500"
        }

    ];

    return (

        <div>

            <h1 className="text-4xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-6">

                {dashboardData.map((item,index)=>(
                    <DashboardCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        color={item.color}
                    />
                ))}

            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="col-span-2">

                    <StatsCard/>

                </div>

                <div>

                    <RecentOrders/>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;