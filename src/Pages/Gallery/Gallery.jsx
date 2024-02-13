import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./Gallery.css";
import Footer from "../../Components/Footer/Footer";
import MonthWiseImages from "../../Components/Gallery/MonthWiseImages";




function getNextMonth(prevDate) {
  console.log(prevDate)
  var preDate = new Date(prevDate + "-30");
  if (preDate.getMonth() - 1 >= 0) {
    console.log((preDate.getMonth() - 1), preDate.getFullYear());
    return ((preDate.getFullYear()) + "-" + (preDate.getMonth() - 1));
  }
  else {
    console.log((preDate.getMonth() + 11), preDate.getFullYear() - 1);
    return ((preDate.getFullYear() - 1) + "-" + (preDate.getMonth() + 12));
  }

}


const Gallery = () => {

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
  const formattedDate = `${year}-${month}`;

  console.log(formattedDate);
  const [getSelectedDate, setSelectedDate] = useState(formattedDate);
  const [getFormatedDates, setFormatedDates] = useState([formattedDate]);
  const [MonthsCount, setMonthsCount] = useState(0);

  const viewMore = () => {
    console.log("clicked");
    console.log(getNextMonth(getFormatedDates[MonthsCount]));
    setFormatedDates(prevDates => [...prevDates, getNextMonth(getFormatedDates[MonthsCount])]);
    setMonthsCount(MonthsCount + 1);

  }

  const ChangesDate = (e) => {
    setSelectedDate(e.target.value);

    setFormatedDates((preDate) => [e.target.value]);
    setMonthsCount(0);
  }

  return (
    <Container fluid >
      <Row>
        <Col md={3} className="mb-3" >

          <Col className="datePicker">
            <span className="SelcetMonth">Select Month</span><br />
            <input id="bday-month" type="month" name="bday-month" value={getSelectedDate} min="2023-12" max={formattedDate} onChange={(e) => { ChangesDate(e); console.log(e.target.value); }} />
          </Col>

        </Col>
        <Col md={9} className="GalleryCol">
          {/* Gallery */}

          {getFormatedDates.map((FormatedDate) => {
            return (
              <MonthWiseImages FormatedDate={FormatedDate} onSelect={() => { viewMore() }} />
            )
          })

          }

        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Gallery;
