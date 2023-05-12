class Room {
  constructor(name, bookings, rate, discount) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date) {
    let occupied = false;

    this.bookings.forEach((booking) => {
      if (
        date.getTime() >= booking.checkIn.getTime() &&
        date.getTime() <= booking.checkOut.getTime()
      ) {
        occupied = true;
      }
    });
    return occupied;
  }

  occupancyPercentage(startDate, endDate) {
    let countDays = 0;

    let day = 1000 * 3600 * 24;

    let daysDifference =
      Math.ceil((endDate.getTime() - startDate.getTime()) / day) + 1;

    let occupied = [];

    if (startDate.getTime() > endDate.getTime()) {
      return "Start can not be greater than end date";
    }

    do {
      occupied.push(
        this.isOccupied(new Date(startDate.getTime() + countDays * day))
      );
      countDays++;
    } while (startDate.getTime() + day * countDays <= endDate.getTime());

    let totalOccupied = occupied.filter((item) => item).length;

    return Math.floor((totalOccupied / daysDifference) * 100);
  }

  static totalOccupancyPercentage(rooms, startDate, endDate) {
    let occupancy = 0;
    rooms.forEach((room) => {
      const result = room.occupancyPercentage(startDate, endDate);
      if (typeof result === "number") {
        occupancy += result;
      } else {
        occupancy = 0;
      }
    });

    const percentageTotal = occupancy / rooms.length;
    return percentageTotal;
  }

  static availableRooms(rooms, startDate, endDate) {
    const roomsAvailable = [];

    rooms.forEach((room) => {
      if (room.occupancyPercentage(startDate, endDate) === 0) {
        roomsAvailable.push(room);
      }
    });

    return roomsAvailable;
  }
}

class Booking {
  constructor(name, email, checkIn, checkOut, discount, room) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  getFee() {
    const total =
      this.discount + this.room.discount >= 90
        ? 90
        : this.discount + this.room.discount;
    return Math.floor(this.room.rate * (total / 100));
  }
}

module.exports = { Room, Booking };
