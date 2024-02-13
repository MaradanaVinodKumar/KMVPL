import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for DatePicker
import { Row, Col, Container } from "react-bootstrap";

import "./AdminPage.css";
import "./scroll_bar.css";
import upload from "../../assets/upload.png";
import Footer from "../../Components/Footer/Footer";
import Compressor from "compressorjs";
import uploadSym from "../../assets/uploadSym.png";
import MonthWiseImages from "../../Components/Gallery/MonthWiseImages";
import { imageDb } from "../../config/config";
import { v4 } from "uuid";
import { uploadBytes, ref } from "firebase/storage";
import loading from "../../assets/Loading.gif";
import UploadProgress from "../../Components/Admin/UploadProgress";

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
function getNextMonth(prevDate) {
  console.log(prevDate);
  var preDate = new Date(prevDate + "-30");
  if (preDate.getMonth() - 1 >= 0) {
    console.log(preDate.getMonth() - 1, preDate.getFullYear());
    return preDate.getFullYear() + "-" + (preDate.getMonth() - 1);
  } else {
    console.log(preDate.getMonth() + 11, preDate.getFullYear() - 1);
    return preDate.getFullYear() - 1 + "-" + (preDate.getMonth() + 12);
  }
}

const AdminPage = (props) => {
  useEffect(() => {
    // This code will run when the component is mounted
    window.scrollTo(0, 0); // Reset scroll position to the top
  }, []);

  const todayForUpload = new Date().toISOString().split("T")[0];

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const formattedDate = `${year}-${month}`;

  const [getFiles, setFiles] = useState([]); // For file upload
  const [selectedFiles, setSelectedFiles] = useState(true);
  const [getprogress, setProgress] = useState(0);
  const [uploadDate, setUploadDate] = useState(todayForUpload);
  const [UploadSuccess, setUploadSuccess] = useState(false);


  //
  const [getSelectedDate, setSelectedDate] = useState(formattedDate);
  const [getFormatedDates, setFormatedDates] = useState([formattedDate]);
  const [MonthsCount, setMonthsCount] = useState(0);
  const [ProgressBarStatus, setProgressBarStatus] = useState(false)

  const viewMore = () => {
    console.log("clicked");
    console.log(getNextMonth(getFormatedDates[MonthsCount]));
    setFormatedDates((prevDates) => [
      ...prevDates,
      getNextMonth(getFormatedDates[MonthsCount]),
    ]);
    setMonthsCount(MonthsCount + 1);
  };

  const ChangesDate = (e) => {
    setSelectedDate(e.target.value);

    setFormatedDates((preDate) => [e.target.value]);
    setMonthsCount(0);
  };
  //

  const UploadDateHandling = (e) => {
    setUploadDate(e.target.value);
    const date = new Date(e.target.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
    const formattedDate = `${year}-${month}`;
    setSelectedDate(formattedDate);
    setFormatedDates((preDate) => [formattedDate]);
    setMonthsCount(0);
  };

  const uploadCompressed = () => {
    setProgressBarStatus(true);
    setSelectedFiles(true);
    setUploadDate(todayForUpload);
    if (getFiles.length !== 0) {
      setProgress(0);
      var progressPersentage = 100 / getFiles.length;
      var conunt = 0;
      var date = new Date(uploadDate);
      getFiles.forEach((image, index) => {
        const imageref = ref(
          imageDb,
          `${date.getFullYear()}/${monthName[date.getMonth()]}/${date + "-" + v4()
          }`
        );
        let uploadTask = uploadBytes(imageref, image).then((res) => {
          setTimeout(() => {
            conunt = conunt + progressPersentage;
            setProgress((getprogress) => {
              return conunt;
            });

            if (conunt > 95) {
              /*show alert card for successful uploaded*/
              setUploadSuccess(true);
              setTimeout(() => {
                // setProgress(0);

                // Remove uploaded files from the state
                setFiles([]);
              }, 100);
            }
          }, 100);
        });
      });
    }
  };

  const deleteFile = (index) => {
    var arrayFiles = getFiles;
    arrayFiles = arrayFiles.filter((value, ind) => {
      if (index !== ind) {
        return value;
      }
    });

    setFiles([...arrayFiles]);
    if (arrayFiles.length === 0) {
      setSelectedFiles(true);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    setFiles([]);
    console.log(uploadedFiles);
    for (let fileObj of uploadedFiles) {
      console.log(fileObj.size);
      if (fileObj.size > 10000000) {
        new Compressor(fileObj, {
          quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
          success: (compressedResult) => {
            // compressedResult has the compressed file.
            // Use the compressed file to upload the images to your server.
            setFiles((file) => [...file, compressedResult]);
            console.log(compressedResult);
            // setCompressedFile(res)
          },
        });
      } else {
        setFiles((file) => [...file, fileObj]);
      }
    }

    if (uploadedFiles.length !== 0) {
      setTimeout(() => {
        setSelectedFiles(false);
        console.log(getFiles);
      }, 100);
    }
  };

  return (
    <>
      {ProgressBarStatus && <UploadProgress Status={getprogress} Success={UploadSuccess} onClose={() => { setProgressBarStatus(false) }} />}
      <Container fluid>
        {/* Drag and drop container */}

        <div className="upload-container">
          <div className="dashed-container">
            {selectedFiles ? (
              <div className="dashed-container-upload">
                <label htmlFor="file-upload">
                  {/* Here we display the image */}
                  <img src={upload} alt="Upload Image" />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                  multiple
                  accept="image/*"
                />
                <div className="upload-text">
                  <p>Drag and drop files here or click to browse</p>
                </div>
              </div>
            ) : (
              <div className="dashed-container-preview-bg">
                <Row className="dashed-container-preview-body">
                  {getFiles.map((image, index) => {
                    return (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        key={index}
                        style={{
                          backgroundImage: `url("${URL.createObjectURL(
                            image
                          )}")`,
                        }}
                        className="PreviewImage"
                      >
                        <div style={{ marginTop: 7, textAlign: "center" }}>
                          <span
                            className="deleteButton"
                            onClick={() => {
                              deleteFile(index);
                            }}
                          >
                            ╳
                          </span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                <div className="dashed-container-Buttons">
                  <input
                    type="date"
                    className="dateForUpload"
                    value={uploadDate}
                    min="2023-12-01"
                    max={todayForUpload}
                    onChange={(e) => {
                      UploadDateHandling(e);
                    }}
                  />
                  <button
                    className="uploadButton"
                    onClick={() => {
                      uploadCompressed();
                    }}
                  >
                    Upload <img src={uploadSym} alt="" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Row>
          <Col md={3} className="mb-3">
            <Col className="datePicker">
              <span className="SelcetMonth">Select Month</span>
              <br />
              <input
                id="bday-month"
                type="month"
                name="bday-month"
                value={getSelectedDate}
                min="2023-12"
                max={formattedDate}
                onChange={(e) => {
                  ChangesDate(e);
                  console.log(e.target.value);
                }}
              />
            </Col>
          </Col>
          <Col md={9} className="GalleryCol">
            {/* Gallery */}

            {getFormatedDates.map((FormatedDate) => {
              return (
                <MonthWiseImages
                  FormatedDate={FormatedDate}
                  onSelect={() => {
                    viewMore();
                  }}
                  EditButton={true}
                  key={v4()}
                />
              );
            })}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPage;
