import React from 'react';
import "./UploadProgress.css"
import successImage from "../../assets/success.jpg"
import uploadImgGif from "../../assets/uploadingImages.gif"

function UploadProgress({ Status, Success = false, onClose }) {
    return (
        <div className='UploadProgressContainer'>
            {Success && <div className='CloseButton' onClick={() => { onClose() }}>╳</div>}
            <div className='UploadSuccessImage' style={{ backgroundImage: `url("${Success ? successImage : uploadImgGif}")` }}></div>
            <div className='UploadProgressBg'>
                <div className='UploadProgress' style={{ width: Status + "%" }}>
                    {Status}
                </div>
            </div>
        </div>
    );
}

export default UploadProgress;