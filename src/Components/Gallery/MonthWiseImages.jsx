import React, { useState, useEffect } from "react";
import { imageDb } from "../../config/config";
import { listAll, getDownloadURL, ref, deleteObject } from "firebase/storage";
import Loading from "../../assets/Loading.gif";
import emptyGallery from "../../assets/empty Gallery.jpg";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
import edit from "../../assets/edit.png";
import editActive from "../../assets/editActive.png";
import { v4 } from "uuid";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa"; // Importing icons
import "./Month.css";

var monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let monthFullName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function storeImagesDataInAObject(imageData) {
  imageData.sort((a, b) => {
    var Adate = new Date(a.item._location.path_.slice(13, 25));
    var Bdate = new Date(b.item._location.path_.slice(13, 25));
    console.log(
      a.item._location.path_,
      "\n",
      a.item._location.path_.slice(13, 25)
    );
    console.log("sort :-", Adate.getDate(), Bdate.getDate());

    if (Adate.getDate() > Bdate.getDate()) {
      return -1;
    } else if (Adate.getDate() < Bdate.getDate()) {
      return 1;
    } else {
      return 0;
    }
  });
  console.log("sorted array:-", imageData);
  return imageData;
}

async function converToUrl(item) {
  var url;
  try {
    url = await getDownloadURL(item);
  } catch (e) {
    console.log(e.message);
  }
  return url;
}

function MonthWiseImages({ FormatedDate, onSelect, EditButton = false }) {
  const [isLoading, setLoading] = useState(false);
  const [getImagesFromFireBase, setImagesFromFireBase] = useState([]);
  const [getSelectedDate, setSelectedDate] = useState(FormatedDate);
  const [viewMoreVisiblity, setViewMoreVisiblity] = useState(true);
  const [editButtonClicked, setEditButtonClick] = useState(true);
  const [reload, setReload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const DeleteImage = (path) => {
    var conf = "do you want to delete!";
    if (conf) {
      const deleteRef = ref(imageDb, path);
      deleteObject(deleteRef)
        .then((res) => {
          console.log(res);
          alert("image deleted !" + res);
          setReload(true);
          setViewMoreVisiblity(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setSelectedDate(FormatedDate);
    setViewMoreVisiblity(true);
    setLoading(false);
    var index = 0;
    var arrayOfImagesData = [];

    const date = new Date(FormatedDate);
    const Path = date.getFullYear() + "/" + monthName[date.getMonth()] + "/";
    listAll(ref(imageDb, Path))
      .then((files) => {
        console.log(files.items);
        files.items.forEach((item) => {
          converToUrl(item).then((url) => {
            let obj = { url: url, item: item };
            arrayOfImagesData[index] = obj;
            index++;
          });
        });
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        console.log(arrayOfImagesData.length, arrayOfImagesData);
        setTimeout(() => {
          arrayOfImagesData = storeImagesDataInAObject(arrayOfImagesData);
          setTimeout(() => {
            setImagesFromFireBase([...arrayOfImagesData]);
            console.log(arrayOfImagesData);
            console.log();
            setLoading(true);
          }, 1000);
        }, 1000);
      });

    setReload(false);
  }, [getSelectedDate, FormatedDate, reload]);

  // Function to open big image modal
  const openBigImageModal = (index) => {
    handleShowModal(index);
  };

  const handleNextImage = () => {
    const newIndex = (selectedImageIndex + 1) % getImagesFromFireBase.length;
    setSelectedImageIndex(newIndex);
  };

  // Updated handlePreviousImage function
  const handlePreviousImage = () => {
    const newIndex =
      (selectedImageIndex - 1 + getImagesFromFireBase.length) %
      getImagesFromFireBase.length;
    setSelectedImageIndex(newIndex);
  };
  return (
    <>
      <Col className="GalleryHeader">
        <h2 className="GalleryHeaderText">{getSelectedDate.slice(0, 4)}</h2>
        <span className="GalleryHeaderText_month">
          {monthFullName[parseInt(getSelectedDate.slice(5)) - 1]}
        </span>
        {editButtonClicked && (
          <span style={{ float: "right" }}>
            <button
              onClick={() => setEditButtonClick((prevState) => !prevState)}
              className={`${
                editButtonClicked ? "EditButtonActive" : "EditButton"
              }`}
            >
              Edit <img src={!editButtonClicked ? edit : editActive}></img>
            </button>
          </span>
        )}
      </Col>
      <Row>
        {isLoading ? (
          getImagesFromFireBase.length ? (
            getImagesFromFireBase.map((imageData, index) => (
              <Col key={v4()} sm={5} md={6} lg={3}>
                <Row className="imageRow">
                  <div
                    className="imageCard"
                    style={{ backgroundImage: `url("${imageData.url}")` }}
                    onClick={() => openBigImageModal(index)} // Open big image modal on click
                  >
                    {!editButtonClicked && (
                      <span
                        className="deleteButton"
                        onClick={() => {
                          DeleteImage(imageData.item);
                        }}
                      >
                        ╳
                      </span>
                    )}
                  </div>
                </Row>
              </Col>
            ))
          ) : (
            <div className="LoadingBg">
              <img src={emptyGallery}></img>
            </div>
          )
        ) : (
          <div className="LoadingBg">
            <img src={Loading} className="Loading"></img>
          </div>
        )}

        {isLoading && viewMoreVisiblity && (
          <Col sm={6} md={4} lg={3}>
            <Card
              className="mb-3 imageCard"
              onClick={() => {
                onSelect();
                setViewMoreVisiblity(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Text className="viewMore">View More</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Big Image Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="modal_container"
      >
        <Button
          variant="light"
          className="close_btn"
          onClick={handleCloseModal}
        >
          <FaTimes />
        </Button>{" "}
        {/* Close button as icon */}
        <Modal.Body>
          {getImagesFromFireBase.length > 1 && (
            <Button variant="secondary" onClick={handlePreviousImage}>
              <FaChevronLeft />
            </Button>
          )}{" "}
          {/* Previous button as icon */}
          <img
            src={getImagesFromFireBase[selectedImageIndex]?.url}
            alt="Big Image"
            className="bigImage"
          />
          {getImagesFromFireBase.length > 1 && (
            <Button variant="secondary" onClick={handleNextImage}>
              <FaChevronRight />
            </Button>
          )}{" "}
          {/* Next button as icon */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MonthWiseImages;
