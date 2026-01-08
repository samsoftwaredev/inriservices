import { Input, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  room: {
    id: string;
    name: string;
    title: string;
    description: string;
    floorNumber: number;
  };
  index: number;
  onChangeRoomName: (roomId: string, name: string) => void;
}

const RoomGeneralInfo = ({ room, index, onChangeRoomName }: Props) => {
  const [roomName, setRoomName] = useState(room.name);

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
    onChangeRoomName(room.id, e.target.value);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Room {index + 1}
      </Typography>
      <Input
        value={roomName}
        fullWidth
        sx={{ mb: 2 }}
        onChange={handleRoomNameChange}
      />
    </>
  );
};

export default RoomGeneralInfo;
