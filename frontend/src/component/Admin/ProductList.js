import React, {useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import "./productList.css";
import {useDispatch, useSelector} from 'react-redux';
import { clearErrors, getAdminProduct, deleteProduct } from '../../actions/productAction';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import {useAlert} from 'react-alert';
import MetaData from '../layout/MetaData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';



const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { error, products} = useSelector(state => state.products);
  const {error: deleteError, isDeleted} = useSelector(state => state.product);

  const deleteHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error){
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError){
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted){
      alert.success('Product deleted successfully');
      navigate('/admin/dashboard');
      dispatch({type: DELETE_PRODUCT_RESET});
    }
    dispatch(getAdminProduct());
  }, [dispatch, alert, error,deleteError, isDeleted, navigate ]);



  const columns =[
    {field:"id", headerName:"Product ID", minWidth:200, flex:0.5},
    {field:"name", headerName:"Product Name", minWidth:200, flex:1},
    {field:"stock", headerName:"Stock", type:"number", minWidth:100, flex:0.5},
    {field:"price", headerName:"Price", type:"number", minWidth:100, flex:0.5},
    {field:"actions", headerName:"Actions", minWidth:150, flex:0.3,sortable:false,type:"number",
        renderCell: (params) => {
          return(
            <>
              <Link to={`/admin/product/${params.row.id}`}>
                <EditIcon />
              </Link>
              <Button onClick={() => deleteHandler(params.row.id)}>
                <DeleteIcon />
              </Button>
            </>
          );
        }},
  ];
  const rows = [];
  products && products.forEach((item)=>{
    rows.push({
      id: item._id,
      name: item.name,
      stock: item.Stock,
      price: item.price,
    });
  });

 

  return (
   <>
    <MetaData title={'All Products --Admin'} />
    <div className="dashboard">
      <Sidebar />
      <div className="productListContainer">
        <h1 id="productListHeading">All Products</h1>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            className="productListTable"
            autoHeight/>
      </div>
    </div>
   </>
  )
}

export default ProductList;
