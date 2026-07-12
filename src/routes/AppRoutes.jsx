import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Orders from "../pages/Orders/ Orders";
import Customers from"../pages/Customers/Customers";
import Conversations from"../pages/Conversations/Conversations";
import Chat from "../pages/Chat/Chat";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <MainLayout>

                <Routes>

                   <Route path="/" element={<Dashboard />} />

                    <Route path="/products" element={<Products />} />

                    <Route path="/orders" element={<Orders />} />

                    <Route path="/customers" element={<Customers />} />

                    <Route path="/conversations" element={<Conversations />} />

                    <Route path="/chat" element={<Chat />} />

                </Routes>

            </MainLayout>

        </BrowserRouter>

    );

}