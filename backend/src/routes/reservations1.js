const {
  getAllReservations1,
  saveReservation1,
  deleteReservationById,
} = require("../models/reservation1");
const express = require("express");
const router = express.Router();

router.get("/reservations1/:day/:month/:years", async (req, res) => {
  const date = `${req.params.day}/${req.params.month}/${req.params.years}`;
  let reservations = await getAllReservations1();
  let reservationOfCurrentDay = reservations.filter(
    (reservation) => reservation.day === date
  );
  res.status(200).json(reservationOfCurrentDay);
});

router.get("/reservations1/userId/:userId", async (req, res) => {
  const userId = `${req.params.userId}`;
  let reservations = await getAllReservations1();
  let reservationOfCurrentDay = reservations.filter(
    (reservation) => reservation.id_user === userId
  );
  res.status(200).json(reservationOfCurrentDay);
});

router.post("/reservations1/employeId", async (req, res) => {
  const employeId = req.body.employeId;
  const dateRange = req.body.rangeDate;
  const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
  const endDate = new Date(dateRange[1]).setHours(0, 0, 0, 0);

  let reservations = await getAllReservations1();
  let reservationOfSelectedEmploye = reservations.filter(
    (reservation) =>
      reservation.id_employe === employeId &&
      new Date(reservation.date).getTime() >= startDate &&
      new Date(reservation.date).getTime() <= endDate
  );

  res.status(200).json(reservationOfSelectedEmploye);
});

router.post("/reservations1", async (req, res) => {
  console.log(req.body);
  const newReservation1 = await saveReservation1(req.body);
  res.status(200).json(newReservation1);
});

router.get("/reservations1/removeReservation/:id", async (req, res) => {
  const id = req.params.id;
  await deleteReservationById(id);
  res.status(200).send({ statusCode: 200, id });
});

module.exports = router;
