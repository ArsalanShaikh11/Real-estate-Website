// import asyncHandler from "express-async-handler";

// import { prisma } from "../config/prismaConfig.js";

// export const createResidency = asyncHandler(async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     address,
//     country,
//     city,
//     facilities,
//     image,
//     userEmail,
//   } = req.body.data;

//   console.log(req.body.data);
//   try {
//     const residency = await prisma.residency.create({
//       data: {
//         title,
//         description,
//         price,
//         address,
//         country,
//         city,
//         facilities,
//         image,
//         owner: { connect: { email: userEmail } },
//       },
//     });

//     res.send({ message: "Residency created successfully", residency });
//   } catch (err) {
//     if (err.code === "P2002") {
//       throw new Error("A residency with address already there");
//     }
//     throw new Error(err.message);
//   }
// });

// export const getAllResidencies = asyncHandler(async (req, res) => {
//   const residencies = await prisma.residency.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   res.send(residencies);
// });

// export const getResidency = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   try {
//     const residency = await prisma.residency.findUnique({
//       where: { id },
//     });
//     res.send(residency);
//   } catch (err) {
//     throw new Error(err.message);
//   }
// });
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Create a new residency
export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;

  console.log(req.body.data);
  try {
    // Ensure the user exists before creating the residency
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });

    res
      .status(201)
      .json({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "A residency with this address already exists" });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get all residencies, ordered by creation date
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(residencies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch residencies" });
  }
});

// Get a single residency by ID
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({ where: { id } });
    if (!residency) {
      return res.status(404).json({ message: "Residency not found" });
    }
    res.status(200).json(residency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
