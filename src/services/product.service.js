const ProductModel = require("../models/product.model");

class ProductService{
    async addProduct(newProduct){
        let {title, description, code, price, stock, category, thumbnails} = newProduct;

        if(!title || !description || !code || !price || !stock || !category){
            console.log("Hay uno o mas campos vacios")
            return false;
        }

        const existingProduct = await ProductModel.findOne({code:code});

        if(existingProduct){
            console.log("Codigo ya registrado")
            return false;
        }

        const product= new ProductModel({
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        })
        await product.save();
        return true;
    }

    async getProducts({limit, page , sort, query} = {}){
        try {

            const skip = (page - 1) * limit;
            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            console.error("Error al obtener los productos", error);
        }
    }

    async getProductById(id){
        try {
            const productFinded = await ProductModel.findById(id);

            if(!productFinded){
                console.log("Producto no encontrado");
            }else{
                console.log("Producto encotrado", productFinded);
                return productFinded;
            }
        } 
        catch (error) {
            console.log("Error al buscar el producto por id");
        }
    }

    async updateProduct(id, dataUpdate){
        try {
            const productUpdated = await ProductModel.findByIdAndUpdate(id, dataUpdate);

            if(!productUpdated){
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto actualizado.")
            return productUpdated;

        } catch (error) {
            console.log("Error al actualizar el archivo", error)
        }
    }

    async deleteProduct(id){
        try {
            
            const productDelete = await ProductModel.findByIdAndDelete(id);

            if(!productDelete){
                console.log("Producto para eliminar, no encontrado.");
                return false;
            }

            console.log("Producto eliminado.")
            return true;
        } catch (error) {
            console.log("Error al acceder a la base de datos.")
        }
    }
}

module.exports = ProductService;