const mongoose = require("mongoose");

const adminSidebarSchema = new mongoose.Schema({
  user: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  navlinks: [
    {
      name: { type: String, required: true },
      path: { type: String, required: true },
      icon: { type: String, required: true }, // store icon name as string (like "LayoutDashboardIcon")
    },
  ],
});

const AdminSidebarModel = mongoose.model("AdminSidebar", adminSidebarSchema);
module.exports = AdminSidebarModel;
