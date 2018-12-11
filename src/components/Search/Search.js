import React from "react";
import "./Search.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
//import '../FilterDrawer.css'

const search = props => {
  let showUploadImageButton = null;
  if (props.imageUploadButton) {
    showUploadImageButton = (
      <div style={{ padding: "16px" }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file-image"
          type="file"
          onChange={props.imageSelect}
        />
        <label htmlFor="icon-button-file-image">
          <Button
            variant="contained"
            style={{ 
              backgroundColor: "#424242"
            }}
            color="primary"
            className={props.button}
            onClick={() =>
              document.getElementById("icon-button-file-image").click()
            }
          >
            Image Search
          </Button>
        </label>
      </div>
    );
  }

  let showUploadBarcodeButton = null;

  if (props.barcodeUploadButton) {
    showUploadBarcodeButton = (
      <div style={{ padding: "16px" }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file-barcode"
          type="file"
          onChange={props.barcodeSelect}
        />
        <label htmlFor="icon-button-file-barcode">
          <Button
            variant="contained"
            style={{ 
              backgroundColor: "#424242",
              padding: "10px"
            }}
            color="#424242"
            className={props.button}
            onClick={() =>
              document.getElementById("icon-button-file-barcode").click()
            }
            // onSubmit={props.click}
          >
            Barcode Search
          </Button>
        </label>
      </div>
    );
  }
  return (
    <div className="Search">
      <div style={{ display: "flex" }}>
        <TextField
          id="outlined-full-width"
          label="Search your favorite book"
          style={{ margin: 8 }}
          placeholder={props.placeholder}
          // helperText="Enter title, author, genre, ISBN"
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          onChange={props.change}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {showUploadImageButton}
        <div style={{ padding: "16px" }}>
          <Button
            style={{ 
              backgroundColor: "#424242"
            }}
            variant="contained"
            color="primary"
            className={props.button}
            onClick={props.click}
          >
            Search
          </Button>
        </div>
        {showUploadBarcodeButton}
      </div>
    </div>
  );
};

export default search;
