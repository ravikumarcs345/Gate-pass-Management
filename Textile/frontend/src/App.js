import './App.css';
import Home from './component/home';
import Footer from './component/layout/footer';
import Header from './component/layout/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify';
import ProductDetails from './component/products/productDetails';
import ProductSearch from './component/products/productSearch';
import Login from './component/user/login';
import Register from './component/user/register';
import store from './store'
import {loadUser} from './actions/userActions'
import { useEffect, useState } from 'react';

import ProtectedRoute from './component/route/ProtectedRoute';
import UpdateProfile from './component/user/UpdateProfile';
import Profile from './component/user/profile';
import UpdatePassword from './component/user/updatePassword';
import ForgotPassword from './component/user/forgotPassword';
import ResetPassword from './component/user/resetPassword';
import Cart from './component/cart/cart';
import Shipping from './component/cart/shipping';
import ConfirmOrder from './component/cart/confirmOrder';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './component/cart/payment';
import OrderSuccess from './component/cart/orderSuccess';
import UserOrders from './component/order/userOrders';
import OrderDetail from './component/order/orderDetails';
import Dashboard from './component/admin/dashboard';
import ProductList from './component/admin/productList';
import NewProduct from './component/admin/newProduct';
import UpdateProduct from './component/admin/updateProduct';
import OrderList from './component/admin/orderList';
import UpdateOrder from './component/admin/updateOrder';
import UserList from './component/admin/userList';
import UserUpdate from './component/admin/userUpdate';
import ReviewList from './component/admin/reviewList';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("")
 useEffect(() => {
   store.dispatch(loadUser)
    async function getStripeApiKey(){
      const {data} = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
  },[])
  return (
    <BrowserRouter>
      <div className='app'>
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search/:keyword' element={<ProductSearch />} />
              <Route path='/product/:id' element={<ProductDetails />} />
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>  } />
              <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute> } />
              <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute> } />
              <Route path='/password/forgot' element={<ForgotPassword/>} />
              <Route path='/password/reset/:token' element={<ResetPassword/> } />
              <Route path='/cart' element={<Cart/> } />
              <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute> } />
              <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute> } />
              <Route path='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute> } />
              <Route path='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute> } />
              <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute> } />
              {stripeApiKey && <Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute> } />}  
            </Routes>
          </div>
          {/* Admin Routes */}
          <Routes>
                  <Route path='/admin/dashboard' element={ <ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute> } />
                  <Route path='/admin/products' element={ <ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute> } />
                  <Route path='/admin/products/create' element={ <ProtectedRoute isAdmin={true}><NewProduct/></ProtectedRoute> } />
                  <Route path='/admin/product/:id' element={ <ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute> } />
                  <Route path='/admin/orders' element={ <ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute> } />
                  <Route path='/admin/order/:id' element={ <ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute> } />
                  <Route path='/admin/users' element={ <ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute> } />
                  <Route path='/admin/user/:id' element={ <ProtectedRoute isAdmin={true}><UserUpdate/></ProtectedRoute> } />
                  <Route path='/admin/reviews' element={ <ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute> } />
                </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
