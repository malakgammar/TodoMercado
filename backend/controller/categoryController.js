import Category from "../model/categoryModel.js";

// CREATE
export const create = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// FETCH ALL
export const fetch = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// DELETE
export const remove = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json("Category not found");
        }

        res.json("Category deleted");
    } catch (error) {
        res.status(500).json(error.message);
    }
};
