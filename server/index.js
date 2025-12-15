const express = require("express");
const connection = require("./config/db");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
const addShowRoute = require("./routes/addShowRoute");
const buyTicketRoute = require("./routes/buyTicketRoute");
const seatLayoutRoutes = require("./routes/seatLayoutRoute");
const seatBookingRoute = require("./routes/seatBookingRoute");
const bookingRoute = require("./routes/bookingRoute");
const checkoutRoute = require("./routes/checkoutRoute");
const paynowRoute = require("./routes/paynowRoute");
const homepageRouter = require("./routes/homepageRoute");
const featuredSectionRoute = require("./routes/featuredSectionRoute");
const adminSidebarRoute = require("./routes/adminSidebarRoute");
const dashboardRoute = require("./routes/adminDashboardRoute");
const favoriteRouter = require("./routes/favoriteRoute");
const adminListBookingsRoute = require("./routes/adminListBookingsRoute");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/user", userRoute);
app.use("/shows", addShowRoute);
app.use("/buy-ticket", buyTicketRoute);
app.use("/book-ticket", bookingRoute);
app.use("/seat-layout", seatLayoutRoutes);
app.use("/seat-booking", seatBookingRoute);
app.use("/checkout", checkoutRoute);
app.use("/payments", paynowRoute);
app.use("/homepage", homepageRouter);
app.use("/featuredSection", featuredSectionRoute);
app.use("/adminSidebar", adminSidebarRoute);
app.use("/adminDashboard", dashboardRoute);
app.use("/favorite", favoriteRouter);
app.use("/admin", adminListBookingsRoute);
app.listen(process.env.PORT || 3690, (error) => {
  if (error) {
    console.log("Server is not connected", error.message);
    return;
  }
  connection();
  console.log("server is connected", process.env.PORT);
});
