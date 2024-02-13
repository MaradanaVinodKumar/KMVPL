import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./AdminPage.css";
import upload from "../../assets/upload.png";
import Footer from "../../Components/Footer/Footer";
import Compressor from "compressorjs";
import uploadSym from "../../assets/uploadSym.png";
import MonthWiseImages from "../../Components/Gallery/MonthWiseImages";
import { imageDb } from "../../config/config";
import { v4 } from "uuid";
import { uploadBytes, ref } from "firebase/storage";
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
  const preDate = new Date(prevDate + "-30");
  if (preDate.getMonth() - 1 >= 0) {
    return `${preDate.getFullYear()}-${preDate.getMonth() - 1}`;
  } else {
    return `${preDate.getFullYear() - 1}-${preDate.getMonth() + 12}`;
  }
}

const AdminPage = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const todayForUpload = new Date().toISOString().split("T")[0];

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const formattedDate = `${year}-${month}`;

  const [getFiles, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(true);
  const [getprogress, setProgress] = useState(0);
  const [uploadDate, setUploadDate] = useState(todayForUpload);
  const [UploadSuccess, setUploadSuccess] = useState(false);
  const [getSelectedDate, setSelectedDate] = useState(formattedDate);
  const [getFormatedDates, setFormatedDates] = useState([formattedDate]);
  const [showMonths, setShowMonths] = useState(false); // To toggle display of months
  const [ProgressBarStatus, setProgressBarStatus] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [formattedDates, setFormattedDates] = useState([
    `${selectedYear}-${selectedMonth}`,
  ]);
  const [monthsCount, setMonthsCount] = useState(0);

  const viewMore = () => {
    setFormattedDates((prevDates) => [
      ...prevDates,
      getNextMonth(prevDates[monthsCount]),
    ]);
    setMonthsCount(monthsCount + 1);
  };

  const ChangesDate = (e) => {
    setSelectedDate(e.target.value);
    setFormatedDates([e.target.value]);
    setMonthsCount(0);
  };

  const UploadDateHandling = (e) => {
    setUploadDate(e.target.value);
    const date = new Date(e.target.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const formattedDate = `${year}-${month}`;
    setSelectedDate(formattedDate);
    setFormatedDates([formattedDate]);
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
          `${date.getFullYear()}/${monthName[date.getMonth()]}/${
            date + "-" + v4()
          }`
        );
        let uploadTask = uploadBytes(imageref, image).then((res) => {
          setTimeout(() => {
            conunt = conunt + progressPersentage;
            setProgress((getprogress) => {
              return conunt;
            });

            if (conunt > 95) {
              setUploadSuccess(true);
              setTimeout(() => {
                setFiles([]);
              }, 100);
            }
          }, 100);
        });
      });
    }
  };

  const deleteFile = (index) => {
    var arrayFiles = getFiles.filter((value, ind) => index !== ind);
    setFiles(arrayFiles);
    if (arrayFiles.length === 0) {
      setSelectedFiles(true);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    setFiles([]);
    for (let fileObj of uploadedFiles) {
      if (fileObj.size > 10000000) {
        new Compressor(fileObj, {
          quality: 0.8,
          success: (compressedResult) => {
            setFiles((file) => [...file, compressedResult]);
          },
        });
      } else {
        setFiles((file) => [...file, fileObj]);
      }
    }

    if (uploadedFiles.length !== 0) {
      setTimeout(() => {
        setSelectedFiles(false);
      }, 100);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setMonthsCount(0);
    setShowMonths(true); // Show months when year changes
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setFormatedDates([`${selectedYear}-${e.target.value}`]);
    setMonthsCount(0);
  };

  return (
    <>
      {ProgressBarStatus && (
        <UploadProgress
          Status={getprogress}
          Success={UploadSuccess}
          onClose={() => {
            setProgressBarStatus(false);
          }}
        />
      )}
      <Container fluid>
        <div className="upload-container">
          <div className="dashed-container">
            {selectedFiles ? (
              <div className="dashed-container-upload">
                <label htmlFor="file-upload">
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
                  {getFiles.map((image, index) => (
                    <Col
                      sm={6}
                      md={4}
                      lg={3}
                      key={index}
                      style={{
                        backgroundImage: `url("${URL.createObjectURL(image)}")`,
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
                  ))}
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
              <br />
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className={`select ${
                  parseInt(selectedYear) === year ? "active" : ""
                }`}
              >
                {Array.from({ length: 10 }, (_, i) => year - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <br />
              {showMonths && (
                <div
                  className="scrollable-months"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                >
                  {/* Display all twelve months */}
                  <Row>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <Col key={month} xs={12}>
                          <button
                            className={`btn btn-light w-100 mb-2 months_font ${
                              parseInt(selectedMonth) === month ? "active" : ""
                            }`}
                            value={month.toString().padStart(2, "0")}
                            onClick={handleMonthChange}
                          >
                            {new Date(selectedYear, month - 1).toLocaleString(
                              "default",
                              { month: "long" }
                            )}
                          </button>
                        </Col>
                      )
                    )}
                  </Row>
                </div>
              )}
            </Col>
          </Col>
          <Col md={9} className="GalleryCol">
            {getFormatedDates.map((FormatedDate) => (
              <MonthWiseImages
                FormatedDate={FormatedDate}
                onSelect={viewMore}
                EditButton={true}
                key={v4()}
              />
            ))}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPage;
