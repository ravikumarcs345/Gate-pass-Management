import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import Search from './search'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown, Image } from 'react-bootstrap'
import { logout } from '../../actions/userActions'
import { toast, Bounce } from 'react-toastify'

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.authState)
  const {items:cartItems}=useSelector(state=>state.cartState)
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const logoutHandler = () => {
    dispatch(logout);

    toast.success('Logout successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
  return (<>
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand   ">
          <Link to="/" >
            <img height="50px" width="80px" alt='SK Logo' src="/images/products/logo.png" className='mx-4  ' />
          </Link>
        </div>
      </div>
      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated ? (
          <Dropdown className='d-inline'>
            <Dropdown.Toggle variant='default text-white px-5 ' id='dropdown-basic'>
              <figure className='avatar avatar-nav'>
                <Image width='50px' src={user.avatar ?? './images/Default_image.jpg'} />
              </figure>
              <span>{user.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu >
              {user.role === 'admin' && <Dropdown.Item onClick={()=>{navigate('/admin/dashboard')}}>Dashboard</Dropdown.Item>}
               <Dropdown.Item onClick={()=>{navigate('/myprofile')}} >Profile</Dropdown.Item> 
               <Dropdown.Item onClick={()=>{navigate('/orders')}} >My Orders</Dropdown.Item> 
              <Dropdown.Item onClick={logoutHandler} className='text-danger'>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>) :
          <Link to="/login" className="btn" id="login_btn">Login</Link>
        }
        <Link to="/cart"><span id="cart" className="ml-3">Cart</span>
        <span className="mx-2" id="cart_count">{cartItems.length}</span>
        <i class="fa fa-regular fa-cart-shopping"></i>
        </Link>
        
      </div>
    </nav>
  </>
  )
}
export default Header