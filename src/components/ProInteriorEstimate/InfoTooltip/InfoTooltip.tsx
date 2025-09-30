import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface Props {
  message?: string;
}

const InfoTooltip = ({ message = "" }: Props) => {
  return (
    <Tooltip
      title={message}
      arrow // Optional: Adds an arrow to the tooltip
    >
      <IconButton>
        <InfoOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;
