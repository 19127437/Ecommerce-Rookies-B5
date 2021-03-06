import React, { useRef, useState } from 'react';
import NavbarAdmin from "../../navBarAdmin/Navbaradmin";
import Sidebar from "../../siderBar/sideBar";
import {Link, useParams} from "react-router-dom";
import {get, post, put} from "../../../../service/httpservice";
import {useEffect} from "react";
import {toast} from "react-toastify";
import swal from "sweetalert";


export default function EditProduct({props})  {
    const endpoint = "/products";
    let {id } = useParams();
    const [productList, setProductList] = useState([]);
    const [cateList, setCateList] = useState([])
    const [loading,setLoading] = useState(false)


    function getListCategory(){
        get('/category').then(response =>{
            if(response.status === 200){
                setCateList(response.data)
            }
        });
    }
    function getProductList(){
        get( '/products/' + id).then(response => {
            if (response.status === 200) {
                setProductList(response.data);
                console.log("successsssssssssss")
            }
        });
    }
    useEffect(() => {
        getProductList();
        getListCategory();
    }, []);
    const [product, setproduct] = useState({
        name: '',
        description: '',
        price: 0.0 ,
        image: [],
        categoryid:''
    })

    const handletitleChange = event => {
        product.name = event.target.value
        setproduct(product)
    };

    const handleDescriptionChange = event => {
        product.description = event.target.value
        setproduct(product)
    };

    const handlePriceChange = event => {
        product.price = parseFloat(event.target.value)
        setproduct(product)
    };
    const handleCategoryChange = event => {
        product.categoryid = event.target.value
        setproduct(product)
    };

    const  uploadImage = async e=>{
        const files = e.target.files
        const data = new FormData()
        data.append('file',files[0])
        data.append('upload_preset','darwin')
        setLoading(true)
        const res = await fetch(
            'https://api.cloudinary.com/v1_1/dkzkr4aqz/image/upload',
            {
                method: 'POST',
                body: data
            }
        )
        const file = await res.json()
        if(file.secure_url !== null){
            product.image.push(file.secure_url)
        }
        setproduct(product)
        setLoading(false)

    }
    const putProduct = (e) => {
        e.preventDefault();
        if(product.name == ""){
            product.name=productList.name
        }
        if(product.description == ""){
            product.description = productList.description
        }
        if(product.price == ""){
            product.price = productList.price
        }
        if(product.image == ""){
            product.image = (productList.image)
        }
        if(product.categoryid == ""){
            product.categoryid = productList.categoryid
        }
        console.log(product)
        const body = JSON.stringify({
            name: product.name,
            price: product.price,
            categoryid: product.categoryid,
            description: product.description,
            image: product.image
        });
        console.log("haha" + body);
        put('/products/'+id, body)
            .then((response) => {
                if (response.status === 200) {
                    swal({
                        title: "Good job!",
                        text: "You clicked the button!",
                        icon: "success"
                    })
                    getProductList();

                }
            }).catch((error) => {
            let message = "Add product failed!";
            if (!error.response) message = "Connection error! Please try again later";
            else {
                console.log(error.response.status);
                switch (error.response.status) {
                    case 400: message = "The product name is already exist!"; break;
                    default: break;
                }
            }
            swal({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        });
    }




    return(
        <>
                <NavbarAdmin/>
                <div className="row">
                    <Sidebar/>
                    <div className="col-lg-8 " style={{ paddingTop: "10px" , marginLeft:"100px"}}>
                        <section className="content-main" style={{ maxWidth: "1200px" }}>
                            <form  onSubmit={putProduct}>
                                <div className="content-header" style={{ marginTop: "60px" , color:"red" }}>
                                    <h2  style={{textAlign:"center" , paddingBottom:"20px"}} className="content-title" >EDIT PRODUCT</h2>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-xl-8 col-lg-8">
                                        <div className="card mb-4 shadow-sm">
                                            <div className="card-body">
                                                <div className="mb-4">
                                                    <label htmlFor="product_title" className="form-label">
                                                        Product title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Type here"
                                                        className="form-control"
                                                        id="product_title"
                                                        defaultValue={productList.name}
                                                        onChange={handletitleChange}

                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_price" className="form-label">
                                                        Price
                                                    </label>
                                                    <input
                                                        onChange={handlePriceChange}
                                                        type="number"
                                                        defaultValue={productList.price}
                                                        className="form-control"
                                                        id="product_price"
                                                        required
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_price" className="form-label">
                                                        Category
                                                    </label>
                                                    <select onChange={handleCategoryChange}   id="category-select" name="category" form="edit-form" style={{marginLeft:"15px"}}>
                                                        {/*<option key="" value={productList.categoryid}>{productList.categoryid}</option>*/}
                                                        {cateList.map((cate) => (
                                                            (cate.name === productList.categoryid) ? <option key={cate.name} value={cate.id}>{ productList.categoryid}</option> :<option key={cate.name} value={cate.id}>{cate.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Description Product</label>
                                                    <textarea
                                                        onChange={handleDescriptionChange}
                                                        defaultValue={productList.description}
                                                        placeholder="Type here"
                                                        className="form-control"
                                                        rows="7"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Images</label>

                                                        <img src={productList.image} alt="Avatar" className="img-fluid my-5" style={{width: "80px"}}/>
                                                    {product.image === null?
                                                        null
                                                        :
                                                        <img
                                                            src={product.image}
                                                            alt="Avatar" className="img-fluid my-5" style={{width: "80px"}}/>
                                                    }
                                                    <input
                                                        type ="file"
                                                        onChange={uploadImage}
                                                        className=" fa fa-image"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </form>

                        </section>
                    </div>
                </div>
        </>
    )
}
