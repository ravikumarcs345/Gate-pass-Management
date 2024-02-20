import { useEffect, useState } from 'react';
import Metadata from './layout/metaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Loader from './layout/loader';
import Products from './products/products';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination'

const Home = () => {
    const dispatch = useDispatch()
    const { loading, products, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1)

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }
    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "top-right"
            });
        }
        dispatch(getProducts(null, null, null, null, currentPage))
    }, [dispatch, error, currentPage])
    return (
        <>
            <Metadata title={'Products'} />
            <h1 id="products_heading" >Latest Products</h1>
            {loading ? <Loader /> :
                <>
                    <section id="products" className=" container ">
                        <div className="row">
                            {products && products.map(product => (
                                <Products col={3} key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage ?
                        <div className='d-flex justify-content-center mt-5'>
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />

                        </div> : null}
                </>}

        </>
    )
}
export default Home