// const adminUserService = require("./adminUser.service");
const {
  getAllUsersService,
  deactivateUserService,
  activateUserService,
} = require("./adminUser.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ADMIN USERS ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const adminId = req.user.id;
    const result = await deactivateUserService(userId, adminId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("DEACTIVATE USER ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to disable user",
    });
  }
};

const activateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const result = await activateUserService(userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("ACTIVATE USER ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to enable user",
    });
  }
};

module.exports = {
  getAllUsers,
  deactivateUser,
  activateUser,
};

// const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await getAllUsersService();

//     return res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deactivateUser = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const result = await deactivateUserService(
//       id,
//       req.user.id,
//     );

//     return res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getAllUsers,
//   deactivateUser,
// };
