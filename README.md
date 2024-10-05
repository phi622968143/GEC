## Required
### Frontend
- install axios
- install react-script
- install react-router-dom
- install Tailwind CSS
### Backend
## Backend

for backend you need to add media dir  
which include product_img product_audio product_description dirs in it,  
py(thon) manage.py runserver to start backend server

## Frontend
### Modified directory
The directory in backend/media is wrong, so I modified it into correct  
### Directory
frontend is for React+Vite  
frontend_ts is for React+Vite+TS  
### Port
I didn't use 3000 as port  
1140 is for React+Vite  
3920 is for React+Vite+TS
### Framework
For the sake of speed, I had changed framework to __React+Vite__
### Styling
Change the styling from __Bootstrap__ to __Tailwind CSS__
### ProductList
The origin setting is return Loading if there's no product on list  
I modified it to navigate to /upload if there's no product on list  
### CartPage
I fixed the problem about delete item  
Delete the item that cart_items.product === product.id  
in the return, cartItem is cartItems.cart_items, product is cartItem.product_info
```js
cartItems.cart_items.map((cartItem) => {
          const product = cartItems.product_info.find(
            (product) => product.id === cartItem.product
          );

          return (
            <div key={cartItem.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {product ? product.name : "Unkown Product"}
                  </h3>

                  {productImages[product.id] &&
                  productImages[product.id].length > 0 ? (
                    <img
                      src={BackendServerURL + productImages[product.id][0].img}
                      alt={product ? product.name : "Image"}
                      style={{ width: "150px" }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <p>數量: {cartItem.quantity}</p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => handleDeal(cartItem.id)}
                  >
                    Checkout
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
                    onClick={() => handleDelete(cartItem.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
```
### Other
- If U don't want to use TypeScript, please delete frontend_ts directory after git clone  
- If U only want to use TypeScript, please delete frontend directory after git clone
