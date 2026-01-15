import Product from "../model/productModel.js";

export const create = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Un tableau de produits est requis." });
        }

        const products = await Product.insertMany(req.body);
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// FETCH ALL
export const fetch = async (req, res) => {
    try {
        const products = await Product.find();

        if (!products.length) {
            return res.status(404).json({ message: "Products not found." });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// EDIT
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },   
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE
export const remove = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({ message: "Product deleted successfully." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
