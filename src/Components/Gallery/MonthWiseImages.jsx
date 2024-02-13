import React, { useState, useEffect } from "react";
import { imageDb } from "../../config/config";
import { listAll, getDownloadURL, ref, deleteObject } from "firebase/storage";
import Loading from "../../assets/Loading.gif";
import emptyGallery from "../../assets/empty Gallery.jpg";
import { Row, Col, Card, Modal } from "react-bootstrap";
import edit from "../../assets/edit.png";
import editActive from "../../assets/editActive.png";

import { v4 } from "uuid";
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
  const [editBttonShow] = useState(EditButton);
  const [reload, setReload] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? getImagesFromFireBase.length - 1 : prevIndex - 1
    );
  };

  const handleModalNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === getImagesFromFireBase.length - 1 ? 0 : prevIndex + 1
    );
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
    // This code will run when the component is mounted
    // window.scrollTo(0, 0); // Reset scroll position to the top
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
        // console.log(getImages);
      });

    setReload(false);
  }, [getSelectedDate, FormatedDate, reload]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <Col className="GalleryHeader">
        <h2 className="GalleryHeaderText">{getSelectedDate.slice(0, 4)}</h2>

        <span className="GalleryHeaderText_month">
          {monthFullName[parseInt(getSelectedDate.slice(5)) - 1]}
        </span>
        {editBttonShow && (
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
              <Col key={v4()} sm={6} md={4} lg={3}>
                <Row className="imageRow">
                  {" "}
                  <div
                    className="imageCard"
                    style={{ backgroundImage: `url("${imageData.url}")` }}
                    onClick={() => handleImageClick(index)}
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          {selectedImageIndex !== null && (
            <img
              src={getImagesFromFireBase[selectedImageIndex].url}
              alt="Selected Image"
              className="modal-image"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleModalPrevious}
            disabled={getImagesFromFireBase.length <= 1}
          >
            &#10094; Previous
          </button>
          <button
            onClick={handleModalNext}
            disabled={getImagesFromFireBase.length <= 1}
          >
            Next &#10095;
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MonthWiseImages;
