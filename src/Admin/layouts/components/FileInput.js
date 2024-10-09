import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import useTheme from "@mui/material/styles/useTheme";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFormLabel-root.Mui-disabled": {
    color: theme.palette.text.secondary,
  },
}));

const CustomButtonBase = styled(ButtonBase)({
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const FileInput = ({ label, onChange, error }) => {
  const ref = useRef();
  const theme = useTheme();
  const [attachments, setAttachments] = useState([]);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(files);
    if (onChange) {
      onChange({ target: { files } }); // Update parent state with files
    }
  };

  return (
    <Box
      position="relative"
      height={98}
      color={error ? theme.palette.error.main : theme.palette.background.paper}
      border={1}
      sx={{
        border: "1px solid #dc3545",
        borderRadius: "5px",
      }}
    >
      <Box position="absolute" top={0} bottom={0} left={0} right={0} mx={2}>
        <CustomTextField
          variant="standard"
          InputProps={{ disableUnderline: true }}
          margin="normal"
          fullWidth
          disabled
          label={label}
          value={attachments.map((file) => file.name).join(", ") || ""}
          error={!!error}
          helperText={error?.message || " "}
        />
      </Box>
      <CustomButtonBase
        component="label"
        onKeyDown={(e) => e.keyCode === 32 && ref.current?.click()}
      >
        <input ref={ref} type="file" accept="image/*" hidden onChange={handleChange} multiple />
      </CustomButtonBase>
    </Box>
  );
};

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

export default FileInput;
