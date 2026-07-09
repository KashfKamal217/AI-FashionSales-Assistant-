const DashboardCard = ({title,value,color}) => {

    return (

        <div className={`${color} text-white rounded-xl shadow-lg p-6`}>

            <h2 className="text-lg">

                {title}

            </h2>

            <h1 className="text-5xl font-bold mt-5">

                {value}

            </h1>

        </div>

    );

};

export default DashboardCard;