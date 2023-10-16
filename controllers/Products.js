import Products from "../models/ProductModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product)
      return res.status(404).json({ msg: "Produk tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product berhasil dimasukan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product)
      return res.status(404).json({ msg: "Produk tidak ditemukan" });

    const { name, price } = req.body;
    if (req.role === "admin") {
      await product.update(
        {
          name,
          price,
        },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses ditolak" });
      await product.update(
        {
          name,
          price,
        },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({msg: "Produk berhasil diperbarui"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
          where: {
            uuid: req.params.id,
          },
        });
        if (!product)
          return res.status(404).json({ msg: "Produk tidak ditemukan" });
    
        const { name, price } = req.body;
        if (req.role === "admin") {
          await product.destroy(
            {
              where: {
                id: product.id,
              },
            }
          );
        } else {
          if (req.userId !== product.userId)
            return res.status(403).json({ msg: "Akses ditolak" });
          await product.destroy(
            {
              where: {
                [Op.and]: [{ id: product.id }, { userId: req.userId }],
              },
            }
          );
        }
        res.status(200).json({msg: "Produk berhasil dihapus"});
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
};
