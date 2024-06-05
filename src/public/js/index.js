const socket = io();

const renderProductos = (products) => {
    const contanerProducts = document.getElementById("contanerProducts");
    contanerProducts.innerHTML = "";


    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <p>Id: ${item.id} </p>
                <p>Titulo: ${item.title} </p>
                <p>Precio: ${item.price} </p>
                <button> Eliminar Producto </button>
        
        `;
        contanerProducts.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
}

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("addProduct", product);
};

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
});


socket.on("products", (data) => {
    renderProductos(data);
})