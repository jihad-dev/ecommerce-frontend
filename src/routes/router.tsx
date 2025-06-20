import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/Mainlayout";
import Home from "../Pages/Home/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Products from "../Pages/Products/Products";
import Dashboard from "../components/layout/Dashboard";
import AdminHome from "../Pages/AdminPage/AdminHome";
import Customers from "../Pages/AdminPage/Customers";
import PrivateRoute from "../utils/PrivateRoute";
import Profile from "../Pages/Profile/Profile";
import DynamicCategory from "../utils/DynamicCategory";
import Cart from "../Pages/Cart/Cart";
import ViewUserInfo from "../Pages/AdminPage/ViewUserInfo";
import ChangeStatus from "../Pages/AdminPage/ChangeStatus";
import AllProducts from "../Pages/AdminPage/AllProducts";
import AllAdmin from "../Pages/AdminPage/AllAdmin";
import CreateAdmin from "../Pages/AdminPage/CreateAdmin";
import ViewAdminInfo from "../Pages/AdminPage/ViewAdminInfo";
import AddProduct from "../Pages/AdminPage/AddProduct";
import ViewProductFullDetails from "../Pages/AdminPage/ViewProductFullDetails";
import AllCategories from "../Pages/AdminPage/AllCategories";
import AddCategories from "../Pages/AdminPage/AddCategories";
import Unauthorized from "../utils/Unauthorized";
import ProductDetails from "../Pages/Products/ProductDetails";
import Order from "../Pages/Order/Order";
import MyOrder from "../Pages/My-order/My-order";
import ViewAllOrders from "../Pages/AdminPage/ViewAllOrders";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/products",
        element: <Products />,
        
      },
      {
        path: "/profile",
        element: <PrivateRoute><Profile /></PrivateRoute>,
      },
      {
        path: "/category/:category",
        element: <DynamicCategory />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      }
      
      
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Dashboard/>
      </PrivateRoute>
    ),
    children: [
      {
        path:"/dashboard/admin-home",
        element:<PrivateRoute allowedRoles={["admin"]}><AdminHome/></PrivateRoute>
      },
      {
        path: "/dashboard/products",
        element: <PrivateRoute allowedRoles={["admin"]}><AllProducts/></PrivateRoute>
      },
      {
        path: "/dashboard/customers",
        element: <PrivateRoute allowedRoles={["admin"]}><Customers/></PrivateRoute>
      },
      {
        path: "/dashboard/customers/:id",
        element: <PrivateRoute allowedRoles={["admin"]}><ViewUserInfo/></PrivateRoute>
      },
      {
        path: "/dashboard/customers/change-status/:id",
        element: <PrivateRoute allowedRoles={["admin"]}><ChangeStatus/></PrivateRoute>
      },
      {
        path: "/dashboard/All-admin",
        element: <PrivateRoute allowedRoles={["admin"]}><AllAdmin/></PrivateRoute>
      },
      {
        path: "/dashboard/admin/create-admin",
        element: <PrivateRoute allowedRoles={["admin"]}><CreateAdmin/></PrivateRoute>
      },
      {
        path: "/dashboard/admin/admin-info/:id",
        element: <PrivateRoute allowedRoles={["admin"]}><ViewAdminInfo/></PrivateRoute>
      },
      {
        path: "/dashboard/products/add-product",
        element: <PrivateRoute allowedRoles={["admin"]}><AddProduct/></PrivateRoute>
      },
      {
        path: "/dashboard/products/view-product/:id",
        element: <PrivateRoute allowedRoles={["admin"]}><ViewProductFullDetails/></PrivateRoute>
      },
      {
        path: "/dashboard/categories",
        element: <PrivateRoute allowedRoles={["admin"]}><AllCategories/></PrivateRoute>
      },
      {
        path: "/dashboard/categories/add-category",
        element: <PrivateRoute allowedRoles={["admin"]}><AddCategories/></PrivateRoute>
      },

      {
        path: "/dashboard/orders",
        element: <PrivateRoute allowedRoles={["admin"]}><ViewAllOrders/></PrivateRoute>
      }
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/my-order",
    element: <MyOrder />,
  },
]);

