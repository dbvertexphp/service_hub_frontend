// <<<<<<< HEAD
import React, { useEffect } from "react";

// Material Dashboard 2 React layouts
import Dashboard from "Admin/layouts/dashboard";
import Tables from "Admin/layouts/tables";
import Supplier_Tables from "Admin/layouts/supplier_tables";

import Category_tables from "Admin/layouts/category_tables";
import Contact_tables from "Admin/layouts/contact_tables";
import Product_tables from "Admin/layouts/product_list";
import Fertilizer_tables from "Admin/layouts/fertilizer_list";
import Tools_tables from "Admin/layouts/tools_list";
import Update_Payments from "Admin/layouts/update_payments";
import OrderList from "Admin/layouts/order_list";

import Transaction_tables from "Admin/layouts/transaction_tables";
import Home from "Website/page/home";
import Profile from "Admin/layouts/profile";
import Addcategory from "Admin/layouts/addcategory";
import AddFertilizerProduct from "Admin/layouts/addFertilizerProduct";
import AddTools from "Admin/layouts/addTools";
import Addsubcategory from "Admin/layouts/addsubcategory";
import Addprivacypolicy from "Admin/layouts/addPrvicayPolicy";
import Addaboutus from "Admin/layouts/addAboutUs";
import Addtermsconditions from "Admin/layouts/addTC";
import SignIn from "Admin/layouts/authentication/sign-in";
import User_Transaction_tables from "Admin/layouts/user_transaction_tables";
import Notification_tables from "Admin/layouts/components/notification";
import SubCategoryList from "Admin/layouts/subCategoryList";
import OrderProductList from "Admin/layouts/order_product_list";
// import TestTable from "Admin/layouts/testTable";

import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Sign in",
    key: "Home",
    icon: <Icon fontSize="small">Home</Icon>,
    route: "/",
    component: <Home />,
  },
  {
    type: "collapse",
    name: "Sign in",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/admin",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User List",
    key: "tables",
    icon: <Icon fontSize="small">User</Icon>,
    route: "/tables",
    component: <Tables />,
  },

  //   {
  //     type: "collapse",
  //     name: "Supplier List",
  //     key: "supplier-tables",
  //     icon: <Icon fontSize="small">User</Icon>,
  //     route: "/supplier-tables",
  //     component: <Supplier_Tables />,
  //   },

  //   {
  //     type: "collapse",
  //     name: "Category List",
  //     key: "category-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/category-list",
  //     component: <Category_tables />,
  //   },
  // {
  //   type: "collapse",
  //   name: "Add Fertilizer Product",
  //   key: "add-fertilizer-product",
  //   icon: <Icon fontSize="small">leaderboard</Icon>,
  //   route: "/add-fertilizer-product",
  //   component: <AddFertilizerProduct />,
  // },
  // {
  //   type: "collapse",
  //   name: "Add Tools",
  //   key: "add-tools",
  //   icon: <Icon fontSize="small">leaderboard</Icon>,
  //   route: "/add-tools",
  //   component: <AddTools />,
  // },
  {
    type: "collapse",
    name: "Contact us List",
    key: "contact-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/contact-list",
    component: <Contact_tables />,
  },
  //   {
  //     type: "collapse",
  //     name: "Product List",
  //     key: "product-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/product-list",
  //     component: <Product_tables />,
  //   },

  //   {
  //     type: "collapse",
  //     name: "Fertilizer List",
  //     key: "fertilizer-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/fertilizer-list",
  //     component: <Fertilizer_tables />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Tools List",
  //     key: "tools-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/tools-list",
  //     component: <Tools_tables />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Order List",
  //     key: "order-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/order-list",
  //     component: <OrderList />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Order Product List",
  //     key: "order-product-list",
  //     icon: <Icon fontSize="small">leaderboard</Icon>,
  //     route: "/order-product-list",
  //     component: <OrderProductList />,
  //   },
  {
    type: "collapse",
    name: "User Transaction List",
    key: "user-transaction-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/user-transaction-list/:user_id",
    component: <User_Transaction_tables />,
  },
  {
    type: "collapse",
    name: "Notification List",
    key: "notification-list",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notification-list",
    component: <Notification_tables />,
  },
  {
    type: "collapse",
    name: "Add Privacy Policy",
    key: "add-privacy-policy",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/add-privacy-policy",
    component: <Addprivacypolicy />,
  },
  {
    type: "collapse",
    name: "Add About Us",
    key: "add-about-us",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/add-about-us",
    component: <Addaboutus />,
  },
  {
    type: "collapse",
    name: "Add Terms Conditions",
    key: "add-terms-conditions",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/add-terms-conditions",
    component: <Addtermsconditions />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];

export default routes;
