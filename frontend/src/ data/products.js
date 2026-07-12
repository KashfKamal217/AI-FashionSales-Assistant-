import maxi from "../assets/ images/maxi.jpg";
import shirt from "../assets/ images/shirt.jpg";
import bag from "../assets/ images/bag.jpg";
import shoes from "../assets/ images/shoes.jpg";
const products = [
    {
        id: 1,
        image: maxi,
        name: "Black Embroidered Maxi",
        category: "Women's Collection",
        price: 4999,
        stock: 18,
        rating: 4.8,
        discount: "10%",
        status: "In Stock"
    },
    {
        id: 2,
        image: shirt,
        name: "Men's Shirt",
        category: "Men's Collection",
        price: 2499,
        stock: 42,
        rating: 4.6,
        discount: "15%",
        status: "In Stock"
    },
    {
        id: 3,
        image: bag,
        name: "Leather Handbag",
        category: "Accessories",
        price: 3499,
        stock: 15,
        rating: 4.7,
        discount: "5%",
        status: "Low Stock"
    },
    {
        id: 4,
        image: shoes,
        name: "Running Shoes",
        category: "Shoes",
        price: 2999,
        stock: 0,
        rating: 4.5,
        discount: "20%",
        status: "Out of Stock"
    }
];

export default products;