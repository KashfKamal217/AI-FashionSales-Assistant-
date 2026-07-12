import { useState } from "react";

import customersData from "../../ data/customers";

import CustomerHeader from "../../components/customers/CustomerHeader";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerModal from "../../components/customers/CustomerModal";
import DeleteCustomerModal from "../../components/customers/DeleteCustomerModal";

export default function Customers() {

    const [customers, setCustomers] = useState(customersData);

    const [showModal, setShowModal] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [deleteCustomer, setDeleteCustomer] = useState(null);

    // =====================
    // ADD CUSTOMER
    // =====================

    const addCustomer = (newCustomer) => {

        setCustomers((prev) => [

            ...prev,

            newCustomer

        ]);

    };

    // =====================
    // UPDATE CUSTOMER
    // =====================

    const updateCustomer = (updatedCustomer) => {

        setCustomers(

            customers.map((customer) =>

                customer.id === updatedCustomer.id

                    ? updatedCustomer

                    : customer

            )

        );

    };

    // =====================
    // SAVE
    // =====================

    const handleSave = (customer) => {

        if (editingCustomer) {

            updateCustomer(customer);

        }

        else {

            addCustomer(customer);

        }

        setEditingCustomer(null);

        setShowModal(false);

    };

    // =====================
    // EDIT
    // =====================

    const handleEdit = (customer) => {

        setEditingCustomer(customer);

        setShowModal(true);

    };

    // =====================
    // DELETE
    // =====================

    const handleDelete = () => {

        setCustomers(

            customers.filter(

                (customer) => customer.id !== deleteCustomer.id

            )

        );

        setDeleteCustomer(null);

    };

    // =====================
    // VIEW
    // =====================

    const handleView = (customer) => {

        alert(

`Customer : ${customer.name}

Phone : ${customer.phone}

Instagram : ${customer.instagram}

City : ${customer.city}

Address : ${customer.address}

Orders : ${customer.orders}

Status : ${customer.status}`

        );

    };

    return (

        <div>

            <CustomerHeader

                openModal={() => {

                    setEditingCustomer(null);

                    setShowModal(true);

                }}

            />

            <CustomerTable

                customers={customers}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={(customer) => setDeleteCustomer(customer)}

            />

            <CustomerModal

                isOpen={showModal}

                editingCustomer={editingCustomer}

                onClose={() => {

                    setShowModal(false);

                    setEditingCustomer(null);

                }}

                onSave={handleSave}

            />

            <DeleteCustomerModal

                isOpen={deleteCustomer !== null}

                customer={deleteCustomer}

                onClose={() => setDeleteCustomer(null)}

                onConfirm={handleDelete}

            />

        </div>

    );

}